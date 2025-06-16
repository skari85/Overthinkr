import type { Metadata } from "next"
import ChatPageClient from "./ChatPageClient"

export const metadata: Metadata = {
  title: "Chat",
  description: "Chat with Overthinkr AI to determine if you're overthinking",
}

interface ChatPageProps {
  searchParams?: {
    shared?: string
    upgrade?: string // Add upgrade to searchParams type
  }
}

export default function ChatPage({ searchParams }: ChatPageProps) {
  return <ChatPageClient searchParams={searchParams} />
}
