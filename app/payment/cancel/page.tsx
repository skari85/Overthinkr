import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, ArrowLeft, HelpCircle } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Payment Canceled - Overthinkr",
  description: "Your Overthinkr Premium subscription was not completed.",
}

export default function PaymentCancelPage() {
  return (
    <div className="container mx-auto py-6 px-4 md:py-10">
      <div className="mx-auto max-w-md text-center">
        <Card className="border-2 shadow-lg rounded-xl overflow-hidden border-orange-200 bg-orange-50 dark:bg-orange-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl flex items-center justify-center gap-2 text-orange-600">
              <XCircle className="h-8 w-8" />
              Payment Canceled
            </CardTitle>
            <CardDescription className="text-orange-700 dark:text-orange-300">
              No worries! Your payment was not processed and you can try again anytime.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-left">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Common reasons for cancellation:
              </h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Payment window was closed</li>
                <li>• Card details were incorrect</li>
                <li>• Changed your mind (totally fine!)</li>
                <li>• Technical issue occurred</li>
              </ul>
            </div>

            <p className="text-sm text-orange-600 dark:text-orange-400">
              You can continue using Overthinkr with all the free features, or try upgrading again later.
            </p>

            <div className="space-y-2">
              <Link href="/subscribe" passHref>
                <Button variant="customPrimary" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </Link>
              <Link href="/chat" passHref>
                <Button variant="outline" className="w-full">
                  Continue with Free Version
                </Button>
              </Link>
            </div>

            <div className="text-xs text-muted-foreground pt-2 border-t">
              <p>Need help? Contact support or check our FAQ.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
