import type { Metadata } from "next"
import SuccessPageClient from "./SuccessPageClient"

export const metadata: Metadata = {
  title: "Subscription Success",
  description: "Your Overthinkr Premium subscription is now active!",
}

export default function SuccessPage() {
  return <SuccessPageClient />
}
