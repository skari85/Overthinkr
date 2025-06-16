import WhatIfExplorer from "@/components/what-if-explorer"
import type { Metadata } from "next"
import APIConfig from "@/components/api-config"

export const metadata: Metadata = {
  title: "What If Explorer",
  description: "Explore hypothetical scenarios with AI to understand outcomes and coping strategies.",
}

export default function WhatIfPage() {
  return (
    <div>
      <WhatIfExplorer />
      <div className="mt-4">
        <APIConfig />
      </div>
    </div>
  )
}
