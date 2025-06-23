import Stripe from "stripe"
import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { db } from "@/lib/firebase"
import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
})

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("stripe-signature")

  if (!signature) {
    return new NextResponse("No Stripe signature header", { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured in environment variables.")
    return new NextResponse("Server configuration error: Stripe webhook secret missing.", { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.CheckoutSession
      console.log(`✅ Test Checkout session completed for session ID: ${session.id}`)

      // Get user ID from metadata (you'll need to pass this when creating the checkout session)
      const userId = session.metadata?.userId

      if (userId) {
        try {
          const userRef = doc(db, "users", userId)

          // Check if user document exists
          const userSnap = await getDoc(userRef)

          if (userSnap.exists()) {
            // Update existing user
            await updateDoc(userRef, {
              isPremium: true,
              stripeCustomerId: session.customer,
              premiumStartDate: new Date(),
              lastUpdated: new Date(),
              testMode: true, // Mark as test transaction
            })
          } else {
            // Create new user document
            await setDoc(userRef, {
              isPremium: true,
              stripeCustomerId: session.customer,
              premiumStartDate: new Date(),
              createdAt: new Date(),
              lastUpdated: new Date(),
              testMode: true, // Mark as test transaction
            })
          }

          console.log(`✅ Test: User ${userId} updated to premium status in Firestore.`)
        } catch (firestoreError) {
          console.error("❌ Error updating user premium status in Firestore:", firestoreError)
        }
      } else {
        console.warn("⚠️ No user ID found in session metadata. Cannot update premium status.")
      }
      break

    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log(`✅ Test PaymentIntent ${paymentIntent.id} succeeded!`)
      break

    case "customer.subscription.deleted":
      // Handle subscription cancellation
      const deletedSubscription = event.data.object as Stripe.Subscription
      const customerId = deletedSubscription.customer as string

      // You would need to find the user by stripeCustomerId and update their premium status
      console.log(`❌ Test: Subscription deleted for customer: ${customerId}`)
      break

    default:
      console.log(`ℹ️ Unhandled event type ${event.type}`)
  }

  return new NextResponse("Received", { status: 200 })
}
