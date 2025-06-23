"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Sparkles } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export default function SuccessPageClient() {
  const { refreshUserData, isPremium, user } = useAuth()
  const [isRefreshing, setIsRefreshing] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get session ID from URL params
    const sessionIdFromUrl = searchParams.get("session_id")
    setSessionId(sessionIdFromUrl)

    // Refresh user data to get updated premium status
    const refreshData = async () => {
      if (user) {
        await refreshUserData()
      }
      setIsRefreshing(false)
    }

    // Add a delay to ensure webhook has processed
    const timer = setTimeout(refreshData, 3000)
    return () => clearTimeout(timer)
  }, [refreshUserData, user, searchParams])

  if (!user) {
    return (
      <div className="container mx-auto py-6 px-4 md:py-10">
        <div className="mx-auto max-w-md text-center">
          <Card className="border-2 shadow-lg rounded-xl overflow-hidden border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl text-orange-600">Authentication Required</CardTitle>
              <CardDescription className="text-orange-700 dark:text-orange-300">
                Please log in to access your premium features.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <Link href="/login">
                <Button variant="customPrimary" className="w-full">
                  Login to Continue
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 md:py-10">
      <div className="mx-auto max-w-md text-center">
        <Card className="border-2 shadow-lg rounded-xl overflow-hidden border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="h-8 w-8" />🎉 Payment Successful!
            </CardTitle>
            <CardDescription className="text-green-700 dark:text-green-300">
              {isRefreshing
                ? "Processing your premium upgrade..."
                : isPremium
                  ? "Welcome to Overthinkr Premium! Your advanced features are now active."
                  : "Your payment was successful. Premium features will be available shortly."}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {sessionId && (
              <div className="text-xs text-muted-foreground bg-white dark:bg-gray-800 p-2 rounded">
                Session: {sessionId.slice(-8)}
              </div>
            )}

            {isRefreshing ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    <span>Premium "What If" Scenario Explorer</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    <span>Advanced AI Personas</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    <span>File Upload & Analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    <span>Priority Support</span>
                  </div>
                </div>

                <p className="text-sm text-green-600 dark:text-green-400">
                  Thank you for supporting Overthinkr! 🙏
                  <br />
                  <span className="text-xs">Linked to: {user.email}</span>
                </p>
              </>
            )}

            <div className="space-y-2">
              <Link href="/what-if" passHref>
                <Button variant="customPrimary" className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Try "What If" Explorer
                </Button>
              </Link>
              <Link href="/chat" passHref>
                <Button variant="outline" className="w-full">
                  Go to Chat
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
