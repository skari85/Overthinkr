import { Suspense } from "react"
import type { Metadata } from "next"
import AnalyticsPageClient from "./AnalyticsPageClient"

export const metadata: Metadata = {
  title: "Analytics",
  description: "View your overthinking patterns and insights",
}

export default function AnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-6 px-4 md:py-10">
          <div className="mx-auto max-w-4xl">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <AnalyticsPageClient />
    </Suspense>
  )
}
