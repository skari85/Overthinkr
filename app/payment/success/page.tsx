import type { Metadata } from "next"
import PaymentSuccessClient from "./PaymentSuccessClient"

export const metadata: Metadata = {
  title: "Payment Success - Overthinkr",
  description: "Your Overthinkr Premium subscription is now active!",
}

export default function PaymentSuccessPage() {
  return <PaymentSuccessClient />
}
