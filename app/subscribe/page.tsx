import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Subscription",
  description: "Unlock premium features with Overthinkr Premium.",
}

// Placeholder Stripe Checkout URL (replace with your actual URL)
// You can generate test links from your Stripe Dashboard: https://dashboard.stripe.com/test/products
const STRIPE_CHECKOUT_URL = "https://buy.stripe.com/7sYbJ1f5CdqK0jx3Pa0Fi02"

export default function SubscribePage() {
  return (
    <div className="container mx-auto py-6 px-4 md:py-10">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-3xl font-bold text-overthinkr-600 mb-2">Unlock Premium Insights</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Upgrade to Overthinkr Premium for advanced features and deeper analysis.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Free Tier Card */}
          <Card className="flex flex-col border-2 shadow-lg rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Basic features for everyday use.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3 text-left">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Unlimited Chat Sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Basic Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Achievement Tracking</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <X className="h-5 w-5 text-red-500" />
                <span>"What If" Scenario Explorer</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <X className="h-5 w-5 text-red-500" />
                <span>Advanced AI Personas</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <X className="h-5 w-5 text-red-500" />
                <span>Priority Support</span>
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </CardFooter>
          </Card>

          {/* Premium Tier Card */}
          <Card className="flex flex-col border-2 border-overthinkr-500 shadow-lg rounded-xl relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-overthinkr-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              BEST VALUE
            </div>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Premium</CardTitle>
              <CardDescription>Unlock everything Overthinkr has to offer.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3 text-left">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Unlimited Chat Sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Advanced Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>All Achievements</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>"What If" Scenario Explorer</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Advanced AI Personas</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Priority Support</span>
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Link href={STRIPE_CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button variant="customPrimary" className="w-full">
                  Get Premium
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
