import WhatIfExplorer from "@/components/what-if-explorer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "What If Explorer",
  description: "Explore hypothetical scenarios with AI to understand outcomes and coping strategies.",
}

export default function WhatIfPage() {
  return <WhatIfExplorer />
}
