import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, Roboto, Open_Sans, Lato, Montserrat, Merriweather, Roboto_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ConditionalLayout } from "@/components/conditional-layout"
import { APIProvider } from "@/contexts/api-context"
import { UICustomizationProvider, type CustomFont } from "@/contexts/ui-customization-context"
import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/header" // Import Header
import { Footer } from "@/components/footer" // Import Footer

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-roboto" })
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans" })
const lato = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-lato" })
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" })
const merriweather = Merriweather({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-merriweather" })
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-roboto-mono" })

// Map CustomFont to Next.js Font variable
const fontMap: Record<CustomFont, string> = {
  Inter: inter.variable,
  Roboto: roboto.variable,
  "Open Sans": openSans.variable,
  Lato: lato.variable,
  Montserrat: montserrat.variable,
  Merriweather: merriweather.variable,
  "Roboto Mono": robotoMono.variable,
}

export const metadata: Metadata = {
  title: {
    template: "Overthinkr | %s",
    default: "Overthinkr",
  },
  description: "A simple but powerful web app that helps people figure out whether they're overthinking something.",
  keywords: ["overthinking", "AI", "mental health", "clarity"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Fetch environment variables here in the Server Component

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${roboto.variable} ${openSans.variable} ${lato.variable} ${montserrat.variable} ${merriweather.variable} ${robotoMono.variable}`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <APIProvider>
            <UICustomizationProvider>
              <ConditionalLayout header={<Header />} footer={<Footer />}>
                {children}
              </ConditionalLayout>
              <Toaster />
            </UICustomizationProvider>
          </APIProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
