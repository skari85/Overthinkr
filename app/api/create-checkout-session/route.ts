import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getAuth } from "firebase-admin/auth"
import { initializeApp, getApps, cert } from "firebase-admin/app"

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    const privateKey = process.env.FIREBASE_PRIVATE_KEY

    // Validate required environment variables
    if (!projectId) {
      throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is required")
    }
    if (!clientEmail) {
      throw new Error("FIREBASE_CLIENT_EMAIL is required")
    }
    if (!privateKey) {
      throw new Error("FIREBASE_PRIVATE_KEY is required")
    }

    // Verify the client email format
    if (!clientEmail.includes("@overthinkr-8a79c.iam.gserviceaccount.com")) {
      throw new Error("Invalid Firebase client email format")
    }

    console.log("Initializing Firebase Admin with project:", projectId)
    console.log("Client email:", clientEmail)

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, "\n"),
      }),
    })

    console.log("✅ Firebase Admin initialized successfully")
  } catch (error) {
    console.error("❌ Failed to initialize Firebase Admin:", error)
    // Don't throw here to prevent build failures
  }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
})

export async function POST(req: NextRequest) {
  try {
    // Check if Firebase Admin is properly initialized
    if (!getApps().length) {
      console.error("Firebase Admin not initialized - falling back to simple checkout")
      return NextResponse.json(
        {
          error: "Server configuration error - Firebase Admin not available",
          fallback: true,
        },
        { status: 500 },
      )
    }

    const { idToken } = await req.json()

    if (!idToken) {
      return NextResponse.json({ error: "Authentication token required" }, { status: 401 })
    }

    // Verify the Firebase ID token
    let decodedToken
    try {
      decodedToken = await getAuth().verifyIdToken(idToken)
    } catch (tokenError) {
      console.error("Token verification failed:", tokenError)
      return NextResponse.json({ error: "Invalid authentication token" }, { status: 401 })
    }

    const userId = decodedToken.uid
    const userEmail = decodedToken.email

    if (!userId || !userEmail) {
      return NextResponse.json({ error: "Invalid user data in token" }, { status: 400 })
    }

    console.log(`Creating checkout session for user: ${userId} (${userEmail})`)

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1RdGZvEES22QZElqh3u98g0v", // Your Stripe Price ID
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer_email: userEmail,
      metadata: {
        userId: userId, // Critical: Link payment to user
        userEmail: userEmail,
        source: "overthinkr-premium-upgrade",
      },
      success_url: `${req.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/cancel`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      subscription_data: {
        metadata: {
          userId: userId,
          userEmail: userEmail,
        },
      },
    })

    console.log(`✅ Checkout session created: ${session.id}`)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      userId: userId, // For debugging
    })
  } catch (error: any) {
    console.error("❌ Error creating checkout session:", error)
    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
