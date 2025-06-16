import Stripe from "stripe"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  // Ensure STRIPE_SECRET_KEY is set in your environment variables
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY

  if (!stripeSecretKey) {
    console.error("STRIPE_SECRET_KEY is not configured in environment variables.")
    return NextResponse.json({ error: "Server configuration error: Stripe key missing." }, { status: 500 })
  }

  // Check if the key is actually a secret key (should start with 'sk_')
  if (!stripeSecretKey.startsWith("sk_")) {
    console.error(
      "Invalid Stripe key format. Expected secret key starting with 'sk_', got:",
      stripeSecretKey.substring(0, 7) + "...",
    )
    return NextResponse.json({ error: "Server configuration error: Invalid Stripe key format." }, { status: 500 })
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2024-04-10", // Use a recent Stripe API version
  })

  try {
    // In a real application, you might pass the price ID from the frontend
    // based on the selected plan. For this example, we use a hardcoded test price.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // IMPORTANT: Replace 'price_12345' with your actual Stripe Price ID
          // You can find this in your Stripe Dashboard under Products -> Pricing.
          price: "price_12345",
          quantity: 1,
        },
      ],
      mode: "payment",
      // These URLs will redirect the user back to your app after checkout
      success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error("Stripe checkout session creation error:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
