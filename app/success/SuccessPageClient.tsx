"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Sparkles, AlertCircle } from "lucide-react"
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
    console.log("Success page loaded")
    console.log("Search params:", searchParams.toString())

    // Get session ID from URL params
    const sessionIdFromUrl = searchParams.get("session_id")
    console.log("Session ID from URL:", sessionIdFromUrl)
    setSessionId(sessionIdFromUrl)

    // Refresh user data to get updated premium status
    const refreshData = async () => {
      console.log("Refreshing user data...")
      if (user) {
        await refreshUserData()
        console.log("User data refreshed, isPremium:", isPremium)
      }
      setIsRefreshing(false)
    }

    // Add a delay to ensure webhook has processed
    const timer = setTimeout(refreshData, 3000)
    return () => clearTimeout(timer)
  }, [refreshUserData, user, searchParams, isPremium])

  // Show loading state while checking auth
  if (isRefreshing) {
    return (
      <div className="container mx-auto py-6 px-4 md:py-10">
        <div className="mx-auto max-w-md text-center">
          <Card className="border-2 shadow-lg rounded-xl overflow-hidden border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl text-blue-600">Processing Payment...</CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300">
                Please wait while we activate your premium features.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
              {sessionId && (
                <div className="text-xs text-muted-foreground bg-white dark:bg-gray-800 p-2 rounded mt-4">
                  Session: {sessionId.slice(-8)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show login prompt if no user
  if (!user) {
    return (
      <div className="container mx-auto py-6 px-4 md:py-10">
        <div className="mx-auto max-w-md text-center">
          <Card className="border-2 shadow-lg rounded-xl overflow-hidden border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl text-orange-600 flex items-center justify-center gap-2">
                <AlertCircle className="h-6 w-6" />
                Authentication Required
              </CardTitle>
              <CardDescription className="text-orange-700 dark:text-orange-300">
                Please log in to access your premium features.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <p className="text-sm">
                Your payment was successful, but you need to log in to activate your premium features.
              </p>
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

  // Main success content
  return (
    <div className="container mx-auto py-6 px-4 md:py-10">
      <div className="mx-auto max-w-md text-center">
        <Card className="border-2 shadow-lg rounded-xl overflow-hidden border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="h-8 w-8" />🎉 Payment Successful!
            </CardTitle>
            <CardDescription className="text-green-700 dark:text-green-300">
              {isPremium
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
