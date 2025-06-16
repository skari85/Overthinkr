"use client"

import OverthinkrChat from "@/components/overthinkr-chat"
import { decodeSharedMessages } from "@/lib/share-utils"
import { SharedContentView } from "@/components/shared-content-view"
import { useEffect } from "react" // Import useEffect

interface ChatPageProps {
  searchParams?: {
    shared?: string
    upgrade?: string // Add upgrade to searchParams type
  }
}

export default function ChatPageClient({ searchParams }: ChatPageProps) {
  const encodedMessages = searchParams?.shared
  const upgradeStatus = searchParams?.upgrade // Get upgrade status

  // Client-side logic for upgrade detection
  useEffect(() => {
    if (upgradeStatus === "success") {
      localStorage.setItem("hasPremium", "true")
      // Optionally, remove the query parameter to clean the URL
      // window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [upgradeStatus])

  if (encodedMessages) {
    const decodedMessages = decodeSharedMessages(encodedMessages)
    return <SharedContentView messages={decodedMessages || []} />
  }

  return (
    <div>
      {upgradeStatus === "success" && (
        <div className="bg-green-100 text-green-800 p-3 rounded-lg mb-4 text-center mx-auto max-w-3xl">
          🎉 Premium unlocked! Enjoy your upgraded experience.
        </div>
      )}
      <OverthinkrChat />
    </div>
  )
}
