"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"
import { Sparkles, Loader2 } from "lucide-react"
import stripePromise from "@/lib/stripe-client"

interface PremiumUpgradeButtonProps {
  className?: string
  children?: React.ReactNode
}

export function PremiumUpgradeButton({ className, children }: PremiumUpgradeButtonProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to upgrade to Premium.",
        variant: "destructive",
      })
      return
    }

    // Validate user email
    if (!user.email) {
      toast({
        title: "Email Required",
        description: "Please ensure your account has a valid email address.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Get Firebase ID token for secure authentication
      const idToken = await user.getIdToken()

      console.log("Creating checkout session for user:", user.uid)
      console.log("User email:", user.email)

      // Try the secure endpoint first
      let response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken,
          userEmail: user.email,
          userId: user.uid,
        }),
      })

      let data = await response.json()

      // If Firebase Admin isn't available, fall back to simple checkout
      if (data.fallback || !response.ok) {
        console.log("Falling back to simple checkout")
        response = await fetch("/api/create-checkout-session-simple", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail: user.email,
            userId: user.uid,
          }),
        })
        data = await response.json()
      }

      if (!response.ok) {
        console.error("API Error:", data)
        throw new Error(data.error || `Server error: ${response.status}`)
      }

      if (!data.sessionId) {
        throw new Error("No session ID received from server")
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error("Stripe failed to load")
      }

      console.log("Redirecting to checkout:", data.sessionId)

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      })

      if (error) {
        console.error("Stripe redirect error:", error)
        throw new Error(error.message)
      }
    } catch (error: any) {
      console.error("Upgrade error:", error)

      // More specific error messages
      let errorMessage = "Something went wrong. Please try again."

      if (error.message?.includes("pattern")) {
        errorMessage = "Invalid data format. Please contact support if this persists."
      } else if (error.message?.includes("price")) {
        errorMessage = "Pricing configuration error. Please contact support."
      } else if (error.message?.includes("email")) {
        errorMessage = "Invalid email format. Please check your account email."
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: "Upgrade Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleUpgrade} disabled={isLoading} className={className} variant="customPrimary">
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        children || (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Upgrade to Premium
          </>
        )
      )}
    </Button>
  )
}
