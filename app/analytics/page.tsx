import { Suspense } from "react"
import AnalyticsPageClient from "./AnalyticsPageClient"

export default function AnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-6 px-4 md:py-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      }
    >
      <AnalyticsPageClient />
    </Suspense>
  )
}
