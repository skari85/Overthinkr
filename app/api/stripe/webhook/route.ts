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
      console.log(`✅ Checkout session completed for session ID: ${session.id}`)

      // Get user ID from metadata - THIS IS CRITICAL!
      const userId = session.metadata?.userId
      const userEmail = session.metadata?.userEmail

      if (!userId) {
        console.error("❌ No user ID found in session metadata. Cannot update premium status.")
        return new NextResponse("No user ID in metadata", { status: 400 })
      }

      try {
        const userRef = doc(db, "users", userId)

        // Check if user document exists
        const userSnap = await getDoc(userRef)

        const userData = {
          isPremium: true,
          stripeCustomerId: session.customer,
          stripeSessionId: session.id,
          premiumStartDate: new Date(),
          lastUpdated: new Date(),
          subscriptionStatus: "active",
          // Keep test mode flag if in test environment
          ...(process.env.NODE_ENV === "development" && { testMode: true }),
        }

        if (userSnap.exists()) {
          // Update existing user
          await updateDoc(userRef, userData)
        } else {
          // Create new user document
          await setDoc(userRef, {
            email: userEmail,
            createdAt: new Date(),
            ...userData,
          })
        }

        console.log(`✅ User ${userId} (${userEmail}) updated to premium status in Firestore.`)
      } catch (firestoreError) {
        console.error("❌ Error updating user premium status in Firestore:", firestoreError)
        return new NextResponse("Database update failed", { status: 500 })
      }
      break

    case "customer.subscription.updated":
      const updatedSubscription = event.data.object as Stripe.Subscription
      console.log(`📝 Subscription updated: ${updatedSubscription.id}`)

      // Handle subscription status changes
      const customerId = updatedSubscription.customer as string
      // You'd need to find user by stripeCustomerId and update status
      break

    case "customer.subscription.deleted":
      const deletedSubscription = event.data.object as Stripe.Subscription
      const canceledCustomerId = deletedSubscription.customer as string

      console.log(`❌ Subscription canceled for customer: ${canceledCustomerId}`)

      // Find user by stripeCustomerId and revoke premium access
      // This would require a query to find the user document
      break

    case "invoice.payment_failed":
      const failedInvoice = event.data.object as Stripe.Invoice
      console.log(`💳 Payment failed for invoice: ${failedInvoice.id}`)

      // Handle failed payments - maybe send email or update user status
      break

    default:
      console.log(`ℹ️ Unhandled event type ${event.type}`)
  }

  return new NextResponse("Received", { status: 200 })
}
