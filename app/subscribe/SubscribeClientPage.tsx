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
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Upgrade to Overthinkr Premium for advanced features and deeper analysis.
        </p>
        <p className="text-sm text-orange-600 dark:text-orange-400 mb-8 font-medium">
          🧪 Test Mode: Use test card 4242 4242 4242 4242 with any future date and CVC
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
                <div className="w-full">
                  <stripe-buy-button
                    buy-button-id="buy_btn_1RdGZvEES22QZElqh3u98g0v"
                    publishable-key="pk_test_51RabEeEES22QZElq7Tfsx2O7ucsjDV0nkYjLA6Qg3ZZ8707A2LV1IhxTmvAaTeRspvktmO081snZm08bl5CpdWRW00VXr61k70"
                  ></stripe-buy-button>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Test Instructions */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">🧪 Test Payment Instructions</h3>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p>
              <strong>Test Card Number:</strong> 4242 4242 4242 4242
            </p>
            <p>
              <strong>Expiry:</strong> Any future date (e.g., 12/25)
            </p>
            <p>
              <strong>CVC:</strong> Any 3 digits (e.g., 123)
            </p>
            <p>
              <strong>ZIP:</strong> Any 5 digits (e.g., 12345)
            </p>
            <p className="mt-2 text-xs">This is a test environment - no real charges will be made.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
