"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, BarChart3, Trophy, Settings, Crown, ArrowRight, User, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function DashboardPageClient() {
  const { user, loading, isPremium } = useAuth()

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4 md:py-10">
        <div className="mx-auto max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-6 px-4 md:py-10">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Please Log In</h2>
                <p className="text-muted-foreground mb-4">You need to be logged in to access your dashboard.</p>
                <Button asChild>
                  <Link href="/login">Log In</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 md:py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user.displayName || user.email?.split("@")[0]}!
              </h1>
              <p className="text-muted-foreground">Here's your Overthinkr overview</p>
            </div>
            <div className="flex items-center gap-2">
              {isPremium ? (
                <Badge variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              ) : (
                <Badge variant="outline">Free</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/chat">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Start Chat</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">New Session</div>
                <p className="text-xs text-muted-foreground mb-3">Begin a new overthinking analysis</p>
                <Button size="sm" className="w-full">
                  Start Now <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/analytics">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Analytics</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">View Stats</div>
                <p className="text-xs text-muted-foreground mb-3">Track your progress and patterns</p>
                <Button size="sm" variant="outline" className="w-full">
                  View Analytics <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/achievements">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">Rewards</div>
                <p className="text-xs text-muted-foreground mb-3">See your accomplishments</p>
                <Button size="sm" variant="outline" className="w-full">
                  View Achievements <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/what-if">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">What-If Explorer</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">Explore</div>
                <p className="text-xs text-muted-foreground mb-3">Scenario planning tool</p>
                <Button size="sm" variant="outline" className="w-full">
                  Start Exploring <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/customize">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customize</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">Settings</div>
                <p className="text-xs text-muted-foreground mb-3">Personalize your experience</p>
                <Button size="sm" variant="outline" className="w-full">
                  Customize <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Link>
          </Card>

          {!isPremium && (
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <Link href="/subscribe">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upgrade</CardTitle>
                  <Crown className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1 text-purple-700">Premium</div>
                  <p className="text-xs text-purple-600 mb-3">Unlock advanced features</p>
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Upgrade Now <Crown className="h-3 w-3 ml-1" />
                  </Button>
                </CardContent>
              </Link>
            </Card>
          )}
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                <p className="text-sm">{isPremium ? "Premium" : "Free"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                <p className="text-sm">
                  {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "Recently"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Sign In</p>
                <p className="text-sm">
                  {user.metadata?.lastSignInTime
                    ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
                    : "Today"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
