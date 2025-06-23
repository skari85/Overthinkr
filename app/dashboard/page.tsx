"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Trophy, MessageSquare, Sparkles, TrendingUp, Calendar, Brain, Settings } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function DashboardPage() {
  const { user, loading: authLoading, isPremium } = useAuth()
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      setIsLoadingData(false)
    }
  }, [authLoading])

  if (authLoading || isLoadingData) {
    return (
      <div className="container mx-auto py-6 px-4 md:py-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 md:py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back{user?.displayName ? `, ${user.displayName}` : ""}!</h1>
          <p className="text-muted-foreground">Here's your Overthinkr dashboard with quick access to all features.</p>
        </div>

        {!user && (
          <Alert className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <Link href="/login" className="underline font-medium">
                Log in
              </Link>{" "}
              to save your data and access premium features.
            </AlertDescription>
          </Alert>
        )}

        {user && !isPremium && (
          <Alert className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              <Link href="/subscribe" className="underline font-medium">
                Upgrade to Premium
              </Link>{" "}
              for unlimited conversations and advanced features - just $5.99 one-time!
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Chat Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/chat">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="h-5 w-5 text-overthinkr-600" />
                  Start Chatting
                </CardTitle>
                <CardDescription>Talk to Overthinkr about your thoughts and concerns</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Open Chat
                </Button>
              </CardContent>
            </Link>
          </Card>

          {/* Analytics Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/analytics">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Analytics
                </CardTitle>
                <CardDescription>View insights into your overthinking patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  View Analytics
                </Button>
              </CardContent>
            </Link>
          </Card>

          {/* Achievements Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/achievements">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Achievements
                </CardTitle>
                <CardDescription>Track your progress and unlock badges</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  View Achievements
                </Button>
              </CardContent>
            </Link>
          </Card>

          {/* What-If Explorer Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/what-if">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5 text-green-600" />
                  What-If Explorer
                </CardTitle>
                <CardDescription>Explore different scenarios and outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Explore Scenarios
                </Button>
              </CardContent>
            </Link>
          </Card>

          {/* Prompts Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/prompts">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Prompt Feed
                </CardTitle>
                <CardDescription>Browse and share thought-provoking prompts</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Browse Prompts
                </Button>
              </CardContent>
            </Link>
          </Card>

          {/* Customize Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/customize">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="h-5 w-5 text-gray-600" />
                  Customize
                </CardTitle>
                <CardDescription>Personalize your Overthinkr experience</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Customize App
                </Button>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Quick Stats Section */}
        {user && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-overthinkr-600">{isPremium ? "Premium" : "Free"}</p>
                  <p className="text-sm text-muted-foreground">Account Type</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{user.email ? "✓" : "✗"}</p>
                  <p className="text-sm text-muted-foreground">Email Verified</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">Active</p>
                  <p className="text-sm text-muted-foreground">Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
