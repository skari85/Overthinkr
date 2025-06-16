import Stripe from "stripe"
import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { db } from "@/lib/firebase" // Import Firestore DB
import { doc, updateDoc } from "firebase/firestore" // Import Firestore functions

// Initialize Stripe with your secret key
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
      console.log(`Checkout session completed for session ID: ${session.id}`)

      // You can access customer information here, e.g., session.customer_details.email
      // If you passed a customer ID or user ID in metadata during session creation,
      // you would retrieve it here: session.metadata?.userId

      // Example: Update user's premium status in Firestore
      // This assumes you have a 'users' collection and a way to link Stripe customer to your user.
      // For anonymous users, you might need to store the Stripe customer ID in their local storage
      // or associate it with their anonymous Firebase UID if you have a mapping.
      // For simplicity, let's assume we can get a userId from metadata or a lookup.
      const userId = session.metadata?.userId || "anonymous_user_id_example" // Replace with actual user ID logic

      if (userId) {
        try {
          const userRef = doc(db, "users", userId) // Assuming a 'users' collection
          await updateDoc(userRef, {
            isPremium: true,
            stripeCustomerId: session.customer, // Store Stripe Customer ID for future management
            premiumStartDate: new Date(),
          })
          console.log(`User ${userId} updated to premium status in Firestore.`)
        } catch (firestoreError) {
          console.error("Error updating user premium status in Firestore:", firestoreError)
          // Consider logging this to a monitoring service
        }
      } else {
        console.warn("No user ID found in session metadata. Cannot update premium status.")
      }

      // Fulfill the purchase here (e.g., grant access to premium features)
      break
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log(`PaymentIntent ${paymentIntent.id} succeeded!`)
      // Handle successful payment (e.g., update order status)
      break
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  // Return a 200 response to acknowledge receipt of the event
  return new NextResponse("Received", { status: 200 })
}
