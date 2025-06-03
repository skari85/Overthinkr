import OverthinkrChat from "@/components/overthinkr-chat"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chat - Overthinkr",
  description: "Chat with Overthinkr AI to determine if you're overthinking",
}

export default function ChatPage() {
  return <OverthinkrChat />
}
