import { Suspense } from "react"
import AchievementsPageClient from "./AchievementsPageClient"

export default function AchievementsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-6 px-4 md:py-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-muted-foreground">Loading achievements...</p>
          </div>
        </div>
      }
    >
      <AchievementsPageClient />
    </Suspense>
  )
}
