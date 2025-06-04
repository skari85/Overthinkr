import OverthinkrChat from "@/components/overthinkr-chat"
import type { Metadata } from "next"
import { decodeSharedMessages } from "@/lib/share-utils"
import { SharedContentView } from "@/components/shared-content-view" // Import the new component

export const metadata: Metadata = {
  title: "Chat",
  description: "Chat with Overthinkr AI to determine if you're overthinking",
}

interface ChatPageProps {
  searchParams?: {
    shared?: string
  }
}

export default function ChatPage({ searchParams }: ChatPageProps) {
  const encodedMessages = searchParams?.shared

  if (encodedMessages) {
    const decodedMessages = decodeSharedMessages(encodedMessages)
    return <SharedContentView messages={decodedMessages || []} />
  }

  return <OverthinkrChat />
}
