import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ConditionalLayout } from "@/components/conditional-layout"
import { APIProvider } from "@/contexts/api-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Overthinkr - Stop Overthinking, Start Clarity",
  description: "A simple but powerful web app that helps people figure out whether they're overthinking something.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <APIProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
          </APIProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
