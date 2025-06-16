"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

export default function SubscribeClientPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handlePremiumCheckout = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/stripe-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // If you have multiple premium tiers, you might send a priceId here:
        // body: JSON.stringify({ priceId: 'your_premium_price_id' }),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirect to the Stripe Checkout URL
        window.location.href = data.url
      } else {
        toast({
          title: "Checkout Failed",
          description: data.error || "Could not initiate Stripe checkout. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      toast({
        title: "Network Error",
        description: "Could not connect to the server for checkout. Please check your internet connection.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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
              <Button onClick={handlePremiumCheckout} disabled={isLoading} variant="customPrimary" className="w-full">
                {isLoading ? "Redirecting..." : "Get Premium"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
