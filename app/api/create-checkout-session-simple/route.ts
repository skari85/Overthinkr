import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
})

export async function POST(req: NextRequest) {
  try {
    const { userEmail, userId } = await req.json()

    if (!userEmail || !userId) {
      return NextResponse.json({ error: "User email and ID required" }, { status: 400 })
    }

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
        userId: userId,
        userEmail: userEmail,
      },
      success_url: `${req.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/cancel`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
