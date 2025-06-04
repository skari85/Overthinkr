"use client"

import type React from "react"

import { useEffect } from "react"
import { initializeReminders } from "@/lib/notification-utils" // Import initializeReminders
import { Toaster } from "@/components/ui/toaster" // Assuming you have a Toaster component

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Initialize reminders when the client-side layout mounts
    initializeReminders()
  }, [])

  return (
    <>
      {children}
      <Toaster /> {/* Render Toaster here if it's a client component */}
    </>
  )
}
