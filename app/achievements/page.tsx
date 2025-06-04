"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { getAchievements, clearAchievements, type Achievement } from "@/lib/achievements-utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, RefreshCcw, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Dynamically import Lucide icons
const Icon = ({ name, className }: { name: string; className?: string }) => {
  const [IconComponent, setIconComponent] = useState<React.ElementType | null>(null)

  useEffect(() => {
    const loadIcon = async () => {
      const iconModule = await import("lucide-react")
      const Component = iconModule[name as keyof typeof iconModule]
      if (Component) {
        setIconComponent(() => Component)
      }
    }
    loadIcon()
  }, [name])

  if (!IconComponent) return null // Or a placeholder

  return <IconComponent className={className} />
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])

  useEffect(() => {
    loadAchievements()
  }, [])

  const loadAchievements = () => {
    setAchievements(getAchievements())
  }

  const handleClearAchievements = () => {
    clearAchievements()
    setAchievements(getAchievements()) // Reload to show default (unlocked: false)
    toast({
      title: "Achievements Cleared",
      description: "All your local achievement data has been reset.",
    })
  }

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalCount = achievements.length

  return (
    <div className="container mx-auto py-6 px-4 md:py-10">
      <div className="mx-auto max-w-3xl">
        <Card className="border-2 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Your Achievements
            </CardTitle>
            <CardDescription>
              Unlock badges as you use Overthinkr and gain insights into your overthinking patterns.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-6">
            {totalCount === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <p>No achievements defined yet. Check back later!</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Achievements Unlocked</CardDescription>
                      <CardTitle className="text-4xl">
                        {unlockedCount} / {totalCount}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Next Goal</CardDescription>
                      <CardTitle className="text-4xl">
                        {achievements.find((a) => !a.unlocked)?.name || "All Unlocked!"}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((ach) => (
                    <Card
                      key={ach.id}
                      className={`flex flex-col items-center text-center p-4 ${
                        ach.unlocked ? "border-overthinkr-500 shadow-md" : "border-dashed opacity-70"
                      }`}
                    >
                      <div
                        className={`mb-2 p-3 rounded-full ${
                          ach.unlocked ? "bg-overthinkr-100 text-overthinkr-600" : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <Icon name={ach.icon} className="h-8 w-8" />
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{ach.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{ach.description}</p>
                      {ach.unlocked && ach.unlockedAt && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Unlocked: {new Date(ach.unlockedAt).toLocaleDateString()}
                        </p>
                      )}
                    </Card>
                  ))}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={loadAchievements}>
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button variant="destructive" onClick={handleClearAchievements}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Reset Achievements
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
