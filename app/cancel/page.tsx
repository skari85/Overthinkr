import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Subscription Canceled",
  description: "Your Overthinkr Premium subscription was not completed.",
}

export default function CancelPage() {
  return (
    <div className="container mx-auto py-6 px-4 md:py-10">
      <div className="mx-auto max-w-md text-center">
        <Card className="border-2 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-center gap-2 text-red-600">
              <XCircle className="h-6 w-6" />
              Subscription Canceled
            </CardTitle>
            <CardDescription>
              Your Overthinkr Premium subscription was not completed. You can try again or continue with the free
              version.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              If you encountered an issue, please try again. Your current plan remains Free.
            </p>
            <Link href="/subscribe" passHref>
              <Button variant="customPrimary" className="w-full">
                Try Again
              </Button>
            </Link>
            <Link href="/chat" passHref>
              <Button variant="outline" className="w-full">
                Go to Chat
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
