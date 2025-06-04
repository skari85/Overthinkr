"use client"

import { useEffect, useState } from "react"
import { getAnalyticsData, clearAnalyticsData, type AnalyticsEntry } from "@/lib/analytics-utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, Legend } from "recharts"
import { History, RefreshCcw, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsEntry[]>([])

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = () => {
    setAnalyticsData(getAnalyticsData())
  }

  const handleClearAnalytics = () => {
    clearAnalyticsData()
    setAnalyticsData([])
    toast({
      title: "Analytics Cleared",
      description: "All your local analytics data has been removed.",
    })
  }

  const overthinkingCount = analyticsData.filter((entry) => entry.classification === "overthinking").length
  const validCount = analyticsData.filter((entry) => entry.classification === "valid").length
  const totalEntries = analyticsData.length

  const overthinkingPercentage = totalEntries > 0 ? ((overthinkingCount / totalEntries) * 100).toFixed(1) : "0.0"
  const validPercentage = totalEntries > 0 ? ((validCount / totalEntries) * 100).toFixed(1) : "0.0"

  const chartData = [
    { name: "Overthinking", value: overthinkingCount, fill: "hsl(var(--overthinkr-500))" },
    { name: "Valid Concern", value: validCount, fill: "hsl(var(--secondary))" },
  ]

  const pieChartData = [
    { name: "Overthinking", value: overthinkingCount },
    { name: "Valid Concern", value: validCount },
  ]

  const COLORS = ["hsl(var(--overthinkr-500))", "hsl(var(--secondary))"]

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
              Insights into your past Overthinkr sessions. All data is stored locally in your browser.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-6">
            {totalEntries === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <p>No analytics data yet. Start chatting with Overthinkr to see your patterns!</p>
                <Button
                  onClick={() => (window.location.href = "/chat")}
                  className="bg-overthinkr-600 hover:bg-overthinkr-700 mt-4"
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
                      <CardTitle className="text-4xl">{totalEntries}</CardTitle>
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
