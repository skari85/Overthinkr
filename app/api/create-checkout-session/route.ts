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

    if (!projectId || !clientEmail || !privateKey) {
      console.log("Firebase Admin environment variables not fully configured")
    } else {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
      })
      console.log("✅ Firebase Admin initialized successfully")
    }
  } catch (error) {
    console.error("❌ Failed to initialize Firebase Admin:", error)
  }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
})

export async function POST(req: NextRequest) {
  try {
    const { idToken, userEmail, userId } = await req.json()

    let verifiedUserId = userId
    let verifiedUserEmail = userEmail

    // Try to verify with Firebase Admin if available
    if (idToken && getApps().length > 0) {
      try {
        const decodedToken = await getAuth().verifyIdToken(idToken)
        verifiedUserId = decodedToken.uid
        verifiedUserEmail = decodedToken.email
        console.log("✅ Token verified with Firebase Admin")
      } catch (tokenError) {
        console.log("⚠️ Token verification failed, using provided user data")
      }
    }

    if (!verifiedUserId || !verifiedUserEmail) {
      return NextResponse.json({ error: "User authentication required" }, { status: 401 })
    }

    console.log(`Creating checkout session for user: ${verifiedUserId} (${verifiedUserEmail})`)

    // Use the same URL pattern as Stripe Payment Links
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin
    const successUrl = `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${baseUrl}/payment/cancel`

    console.log("Success URL:", successUrl)
    console.log("Cancel URL:", cancelUrl)

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1RdGZvEES22QZElqh3u98g0v", // Your Stripe Price ID for $5.99 one-time
          quantity: 1,
        },
      ],
      mode: "payment", // Changed from "subscription" to "payment"
      customer_email: verifiedUserEmail,
      metadata: {
        userId: verifiedUserId,
        userEmail: verifiedUserEmail,
        source: "overthinkr-premium-upgrade",
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    })

    console.log(`✅ Checkout session created: ${session.id}`)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      userId: verifiedUserId,
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
