"use client"

import type React from "react"

import { usePathname } from "next/navigation"
// Removed direct import of Header and Footer

interface ConditionalLayoutProps {
  children: React.ReactNode
  header: React.ReactNode // New prop for header
  footer: React.ReactNode // New prop for footer
}

export function ConditionalLayout({ children, header, footer }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isLandingPage = pathname === "/"

  if (isLandingPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen flex-col">
      {header} {/* Render header prop */}
      <main className="flex-1">{children}</main>
      {footer} {/* Render footer prop */}
    </div>
  )
}
