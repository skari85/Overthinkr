import { NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe once to avoid cold start issues
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: Request) {
  console.log("=== CHECKOUT SESSION API CALLED ===")
  console.log("Timestamp:", new Date().toISOString())

  try {
    // Validate Stripe configuration first
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY not found in environment variables")
      return NextResponse.json({ error: "Payment system configuration error" }, { status: 500 })
    }

    if (!process.env.STRIPE_SECRET_KEY.startsWith("sk_")) {
      console.error("Invalid STRIPE_SECRET_KEY format")
      return NextResponse.json({ error: "Invalid payment configuration" }, { status: 500 })
    }

    const body = await request.json()
    const { idToken, userEmail, userId } = body

    console.log("Request body received:")
    console.log("- User ID:", userId)
    console.log("- User Email:", userEmail)
    console.log("- Has ID Token:", !!idToken)

    // Validate required fields
    if (!userEmail || !userId) {
      console.error("Missing required fields:", { userEmail: !!userEmail, userId: !!userId })
      return NextResponse.json({ error: "Missing required user information" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userEmail)) {
      console.error("Invalid email format:", userEmail)
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate user ID format (should be alphanumeric)
    if (!/^[a-zA-Z0-9]+$/.test(userId)) {
      console.error("Invalid user ID format:", userId)
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
    }

    console.log("Validation passed, creating checkout session...")

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
        timestamp: new Date().toISOString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://overthinkr.xyz"}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://overthinkr.xyz"}/payment/cancel`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes
    })

    console.log("✅ Checkout session created successfully:", session.id)
    console.log("Session URL:", session.url)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error: any) {
    console.error("=== CHECKOUT SESSION ERROR ===")
    console.error("Error type:", error.constructor.name)
    console.error("Error message:", error.message)
    console.error("Error code:", error.code)
    console.error("Error type (Stripe):", error.type)
    console.error("Full error:", error)

    // More specific error handling
    if (error.type === "StripeInvalidRequestError") {
      console.error("Stripe validation error:", error.message)
      return NextResponse.json(
        {
          error: `Payment validation error: ${error.message}`,
          details: error.param ? `Invalid parameter: ${error.param}` : undefined,
        },
        { status: 400 },
      )
    }

    if (error.code === "parameter_invalid_empty") {
      return NextResponse.json(
        {
          error: "Missing required payment information",
        },
        { status: 400 },
      )
    }

    if (error.message?.includes("price")) {
      return NextResponse.json(
        {
          error: "Invalid price configuration",
        },
        { status: 400 },
      )
    }

    if (error.code === "api_key_expired") {
      return NextResponse.json(
        {
          error: "Payment system temporarily unavailable",
        },
        { status: 503 },
      )
    }

    return NextResponse.json(
      {
        error: error.message || "Failed to create checkout session",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
