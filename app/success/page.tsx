import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Subscription Success",
  description: "Your Overthinkr Premium subscription is now active!",
}

export default function SuccessPage() {
  return (
    <div className="container mx-auto py-6 px-4 md:py-10">
      <div className="mx-auto max-w-md text-center">
        <Card className="border-2 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              Subscription Successful!
            </CardTitle>
            <CardDescription>
              Thank you for subscribing to Overthinkr Premium. Your advanced features are now active!
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              You can now enjoy all the premium benefits, including the "What If" Scenario Explorer and advanced AI
              personas.
            </p>
            <Link href="/chat" passHref>
              <Button variant="customPrimary" className="w-full">
                Go to Chat
              </Button>
            </Link>
            <Link href="/subscribe" passHref>
              <Button variant="outline" className="w-full">
                Manage Subscription
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
