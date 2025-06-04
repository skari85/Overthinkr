import CustomizePageClient from "./CustomizePageClient"
import type { Metadata } from "next"

// Metadata for the page (client component, so export directly)
export const metadata: Metadata = {
  title: "Customize UI",
  description: "Personalize the look and feel of Overthinkr.",
}

export default function CustomizePage() {
  return <CustomizePageClient />
}
