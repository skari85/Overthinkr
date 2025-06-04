import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { APIProvider } from "@/contexts/api-context"
import { UICustomizationProvider } from "@/contexts/ui-customization-context"
import { UserProfileProvider } from "@/contexts/user-profile-context"
import ClientLayout from "./client-layout" // Import the client layout

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Overthinkr",
  description: "AI-powered tool to help you navigate and manage overthinking.",
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
            <UICustomizationProvider>
              <UserProfileProvider>
                <ClientLayout>
                  {" "}
                  {/* Wrap children with ClientLayout */}
                  {children}
                </ClientLayout>
              </UserProfileProvider>
            </UICustomizationProvider>
          </APIProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
