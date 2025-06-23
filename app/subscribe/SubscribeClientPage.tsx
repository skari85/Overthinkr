"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context" // Import useAuth

export default function SubscribeClientPage() {
  const { isPremium, loading: authLoading } = useAuth() // Get isPremium from auth context
  const [isLoading, setIsLoading] = useState(false)

  // Ensure the Stripe Buy Button script is loaded
  useEffect(() => {
    const scriptId = "stripe-buy-button-script"
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script")
      script.id = scriptId
      script.src = "https://js.stripe.com/v3/buy-button.js"
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  if (authLoading) {
    return (
      <div className="container mx-auto py-6 px-4 md:py-10 text-center">
        <p className="text-muted-foreground">Loading subscription status...</p>
      </div>
    )
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
          <Card className={`flex flex-col border-2 shadow-lg rounded-xl ${!isPremium ? "border-overthinkr-500" : ""}`}>
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
              <Button variant="outline" className="w-full" disabled={!isPremium}>
                {!isPremium ? "Current Plan" : "Downgrade (Not Implemented)"}
              </Button>
            </CardFooter>
          </Card>

          {/* Premium Tier Card */}
          <Card
            className={`flex flex-col border-2 shadow-lg rounded-xl relative ${isPremium ? "border-overthinkr-500" : ""}`}
          >
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
              {isPremium ? (
                <Button variant="customPrimary" className="w-full" disabled>
                  Current Plan
                </Button>
              ) : (
                <stripe-buy-button
                  buy-button-id="buy_btn_1RaiQ5E00WmbeLhMLbXb1qO5"
                  publishable-key="pk_live_51RNfSGE00WmbeLhMiRZzXWIXLxV0vC1qqNcEa0UlMpUfbsaEGAx9GB2MX1QKZGU0fokXmEBOMaGS1V0D9woZyPY900UttZEhmz"
                  success-url="https://overthinkr.xyz/chat?upgrade=success"
                  cancel-url="https://overthinkr.xyz/cancel"
                  className="w-full"
                ></stripe-buy-button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
