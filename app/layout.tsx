import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import {
  Inter,
  Roboto,
  Open_Sans,
  Lato,
  Montserrat,
  Merriweather,
  Roboto_Mono,
  Poppins,
  Nunito,
  Playfair_Display,
} from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ConditionalLayout } from "@/components/conditional-layout"
import { APIProvider } from "@/contexts/api-context"
import { UICustomizationProvider, type CustomFont } from "@/contexts/ui-customization-context"
import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-roboto" })
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans" })
const lato = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-lato" })
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" })
const merriweather = Merriweather({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-merriweather" })
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-roboto-mono" })
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-poppins" }) // New
const nunito = Nunito({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-nunito" }) // New
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair-display",
}) // New

// Map CustomFont to Next.js Font variable (This map is not directly used in layout.tsx, but good for reference)
const fontMap: Record<CustomFont, string> = {
  Inter: inter.variable,
  Roboto: roboto.variable,
  "Open Sans": openSans.variable,
  Lato: lato.variable,
  Montserrat: montserrat.variable,
  Merriweather: merriweather.variable,
  "Roboto Mono": robotoMono.variable,
  Poppins: poppins.variable, // New
  Nunito: nunito.variable, // New
  "Playfair Display": playfairDisplay.variable, // New
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
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${roboto.variable} ${openSans.variable} ${lato.variable} ${montserrat.variable} ${merriweather.variable} ${robotoMono.variable} ${poppins.variable} ${nunito.variable} ${playfairDisplay.variable}`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <APIProvider>
              <UICustomizationProvider>
                <ConditionalLayout header={<Header />} footer={<Footer />}>
                  {children}
                </ConditionalLayout>
                <Toaster />
              </UICustomizationProvider>
            </APIProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
