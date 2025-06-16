import type { Metadata } from "next"
import SubscribeClientPage from "./SubscribeClientPage"

// Metadata for the page (client component, so export directly)
export const metadata: Metadata = {
  title: "Subscription",
  description: "Unlock premium features with Overthinkr Premium.",
}

export default function SubscribePage() {
  return <SubscribeClientPage />
}
