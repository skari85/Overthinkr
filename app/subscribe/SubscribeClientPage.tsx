"use client"

import { PremiumUpgradeButton } from "@/components/premium-upgrade-button"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

export default function SubscribeClientPage() {
  const { user } = useAuth()

  const features = [
    "Unlimited AI conversations",
    "Advanced analytics and insights",
    "Priority support",
    "Export conversations",
    "Custom AI personas",
    "File upload and analysis",
    "Advanced what-if scenarios",
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Upgrade to Premium</h1>
          <p className="text-muted-foreground">Unlock the full potential of Overthinkr with premium features</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Premium Plan</CardTitle>
            <CardDescription>
              <span className="text-3xl font-bold">$5.99</span>
              <span className="text-muted-foreground"> one-time</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="text-center">
              <PremiumUpgradeButton />
            </div>

            {!user && (
              <p className="text-sm text-muted-foreground text-center mt-4">
                <Link href="/login" className="text-blue-600 hover:text-blue-800 underline">
                  Please log in to upgrade to premium
                </Link>
              </p>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>One-time payment. Lifetime access to premium features.</p>
        </div>
      </div>
    </div>
  )
}
