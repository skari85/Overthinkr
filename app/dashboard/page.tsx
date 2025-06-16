"use client"

import { useEffect, useState } from "react"
import { getAnalyticsMetrics, getDailyAnalyticsTrends, clearAnalyticsData } from "@/lib/analytics-utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LayoutDashboard, RefreshCcw, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(getAnalyticsMetrics())
  const [dailyTrends, setDailyTrends] = useState(getDailyAnalyticsTrends())

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = () => {
    setMetrics(getAnalyticsMetrics())
    setDailyTrends(getDailyAnalyticsTrends())
  }

  const handleClearAnalytics = () => {
    clearAnalyticsData()
    loadDashboardData() // Reload data after clearing
    toast({
      title: "Analytics Cleared",
      description: "All your local analytics data has been removed.",
    })
  }

  const chartData = [
    { name: "Overthinking", value: metrics.overthinkingCount, fill: "hsl(var(--overthinkr-500))" },
    { name: "Valid Concern", value: metrics.validCount, fill: "hsl(var(--secondary))" },
  ]

  const totalEntries = metrics.totalConversations

  return (
    <div className="container mx-auto py-6 px-4 md:py-10">
      <div className="mx-auto max-w-4xl">
        <Card className="border-2 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5" />
              Your Overthinkr Dashboard
            </CardTitle>
            <CardDescription>
              A visual overview of your overthinking patterns and insights. All data is stored locally in your browser.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-6">
            {totalEntries === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <p>No data yet. Start chatting with Overthinkr to see your patterns!</p>
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
                      <CardTitle className="text-4xl">
                        {metrics.totalConversations > 0
                          ? ((metrics.overthinkingCount / metrics.totalConversations) * 100).toFixed(1)
                          : "0.0"}
                        %
                      </CardTitle>
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
                    <CardTitle>Daily Overthinking Trends</CardTitle>
                    <CardDescription>Your classification patterns over time.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        overthinking: {
                          label: "Overthinking",
                          color: "hsl(var(--overthinkr-500))",
                        },
                        valid: {
                          label: "Valid Concern",
                          color: "hsl(var(--secondary))",
                        },
                      }}
                      className="h-[300px] w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={dailyTrends}
                          margin={{
                            top: 5,
                            right: 10,
                            left: 10,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="overthinking"
                            stroke="hsl(var(--overthinkr-500))"
                            activeDot={{ r: 8 }}
                          />
                          <Line type="monotone" dataKey="valid" stroke="hsl(var(--secondary))" />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={loadDashboardData}>
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
