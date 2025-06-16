"use client"

import { useEffect, useState } from "react"
import {
  getAnalyticsMetrics,
  clearAnalyticsData,
  getDailyAnalyticsTrends,
  type AnalyticsEntry,
  getAnalyticsData,
} from "@/lib/analytics-utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, Legend } from "recharts"
import { History, RefreshCcw, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context" // Import useAuth
import { Alert, AlertDescription } from "@/components/ui/alert" // Import Alert components
import { AlertCircle } from "lucide-react" // Import AlertCircle

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsEntry[]>([])
  const [metrics, setMetrics] = useState({ totalConversations: 0, overthinkingCount: 0, validCount: 0 })
  const [dailyTrends, setDailyTrends] = useState([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      loadAnalytics()
    }
  }, [user, authLoading]) // Reload when user or authLoading changes

  const loadAnalytics = async () => {
    setIsLoadingData(true)
    if (user?.uid) {
      const data = await getAnalyticsData(user.uid)
      setAnalyticsData(data)
      setMetrics(await getAnalyticsMetrics(user.uid))
      setDailyTrends(await getDailyAnalyticsTrends(user.uid))
    } else {
      // Clear data if no user is logged in
      setAnalyticsData([])
      setMetrics({ totalConversations: 0, overthinkingCount: 0, validCount: 0 })
      setDailyTrends([])
    }
    setIsLoadingData(false)
  }

  const handleClearAnalytics = async () => {
    if (user?.uid) {
      await clearAnalyticsData(user.uid)
      toast({
        title: "Analytics Cleared",
        description: "All your analytics data has been removed from the cloud.",
      })
    } else {
      toast({
        title: "Analytics Cleared Locally",
        description: "All your local analytics data has been removed.",
      })
    }
    loadAnalytics() // Reload to show empty state
  }

  const overthinkingPercentage =
    metrics.totalConversations > 0 ? ((metrics.overthinkingCount / metrics.totalConversations) * 100).toFixed(1) : "0.0"
  const validPercentage =
    metrics.totalConversations > 0 ? ((metrics.validCount / metrics.totalConversations) * 100).toFixed(1) : "0.0"

  const chartData = [
    { name: "Overthinking", value: metrics.overthinkingCount, fill: "hsl(var(--overthinkr-500))" },
    { name: "Valid Concern", value: metrics.validCount, fill: "hsl(var(--secondary))" },
  ]

  const pieChartData = [
    { name: "Overthinking", value: metrics.overthinkingCount },
    { name: "Valid Concern", value: metrics.validCount },
  ]

  const COLORS = ["hsl(var(--overthinkr-500))", "hsl(var(--secondary))"]

  if (authLoading || isLoadingData) {
    return (
      <div className="container mx-auto py-6 px-4 md:py-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 md:py-10">
      <div className="mx-auto max-w-3xl">
        <Card className="border-2 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="h-5 w-5" />
              Your Overthinkr Analytics
            </CardTitle>
            <CardDescription>
              Insights into your past Overthinkr sessions. Data is stored in the cloud when logged in.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-6">
            {!user && (
              <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Log in to save and access your analytics data across devices.</AlertDescription>
              </Alert>
            )}

            {metrics.totalConversations === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <p>No analytics data yet. Start chatting with Overthinkr to see your patterns!</p>
                <Button
                  onClick={() => (window.location.href = "/chat")}
                  className="mt-4 bg-overthinkr-600 hover:bg-overthinkr-700"
                >
                  Go to Chat
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Total Sessions</CardDescription>
                      <CardTitle className="text-4xl">{metrics.totalConversations}</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Overthinking Rate</CardDescription>
                      <CardTitle className="text-4xl">{overthinkingPercentage}%</CardTitle>
                    </CardHeader>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Classification Distribution</CardTitle>
                    <CardDescription>How often Overthinkr classified your thoughts.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        Overthinking: {
                          label: "Overthinking",
                          color: "hsl(var(--overthinkr-500))",
                        },
                        "Valid Concern": {
                          label: "Valid Concern",
                          color: "hsl(var(--secondary))",
                        },
                      }}
                      className="h-[250px] w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Proportion of Classifications</CardTitle>
                    <CardDescription>A breakdown of your thought patterns.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                    <ChartContainer
                      config={{
                        Overthinking: {
                          label: "Overthinking",
                          color: "hsl(var(--overthinkr-500))",
                        },
                        "Valid Concern": {
                          label: "Valid Concern",
                          color: "hsl(var(--secondary))",
                        },
                      }}
                      className="h-[250px] w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            labelLine={false}
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend />
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={loadAnalytics}>
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Refresh Data
                  </Button>
                  <Button variant="destructive" onClick={handleClearAnalytics}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Analytics
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
