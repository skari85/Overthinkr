import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { idToken, userEmail, userId } = body

    console.log("Creating checkout session...")
    console.log("User ID:", userId)
    console.log("User Email:", userEmail)

    // Validate required fields
    if (!userEmail || !userId) {
      return NextResponse.json({ error: "Missing required user information" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate user ID format (should be alphanumeric)
    if (!/^[a-zA-Z0-9]+$/.test(userId)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
    }

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-06-20",
    })

    // Create checkout session with validated data
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Overthinkr Premium",
              description: "Lifetime access to premium features",
            },
            unit_amount: 599, // $5.99 in cents
          },
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      metadata: {
        userId: userId,
        userEmail: userEmail,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://overthinkr.xyz"}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://overthinkr.xyz"}/payment/cancel`,
    })

    console.log("Checkout session created:", session.id)

    return NextResponse.json({ sessionId: session.id })
  } catch (error: any) {
    console.error("Checkout session error:", error)

    // More specific error handling
    if (error.type === "StripeInvalidRequestError") {
      return NextResponse.json({ error: `Stripe error: ${error.message}` }, { status: 400 })
    }

    return NextResponse.json({ error: error.message || "Failed to create checkout session" }, { status: 500 })
  }
}
