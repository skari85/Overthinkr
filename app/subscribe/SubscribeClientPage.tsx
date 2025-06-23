"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, LogIn } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { PremiumUpgradeButton } from "@/components/premium-upgrade-button"
import Link from "next/link"

export default function SubscribeClientPage() {
  const { isPremium, loading: authLoading, user } = useAuth()

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
        {process.env.NODE_ENV === "development" && (
          <p className="text-sm text-orange-600 dark:text-orange-400 mb-8 font-medium">
            🧪 Test Mode: Use test card 4242 4242 4242 4242 with any future date and CVC
          </p>
        )}

        {/* Login Required Notice */}
        {!user && (
          <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <LogIn className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Login Required</h3>
            </div>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              You need to be logged in to upgrade to Premium. This ensures your subscription is linked to your account.
            </p>
            <div className="flex gap-2 justify-center">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/signup">
                <Button variant="customPrimary">Sign Up</Button>
              </Link>
            </div>
          </div>
        )}

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
                <span>File Upload & Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <X className="h-5 w-5 text-red-500" />
                <span>Priority Support</span>
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Button variant="outline" className="w-full" disabled={!isPremium}>
                {!isPremium ? "Current Plan" : "Downgrade (Contact Support)"}
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
              <div className="text-2xl font-bold text-overthinkr-600">$9.99/month</div>
            </CardHeader>
            <CardContent className="flex-grow space-y-3 text-left">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Everything in Free</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Advanced Analytics & Insights</span>
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
                <span>File Upload & Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Priority Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Cancel Anytime</span>
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              {isPremium ? (
                <Button variant="customPrimary" className="w-full" disabled>
                  ✨ Current Plan - Premium Active
                </Button>
              ) : (
                <PremiumUpgradeButton className="w-full">
                  {user ? "Upgrade to Premium" : "Login to Upgrade"}
                </PremiumUpgradeButton>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Test Instructions - Only show in development */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
              🧪 Test Payment Instructions
            </h3>
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
        )}

        {/* Security Notice */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>🔒 Secure checkout powered by Stripe • Cancel anytime • No hidden fees</p>
        </div>
      </div>
    </div>
  )
}
