"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch" // Import Switch component
import { useUICustomization, type CustomFont } from "@/contexts/ui-customization-context"
import { useUserProfile, type AvatarOption } from "@/contexts/user-profile-context"
import { Palette, Text, LineChart, User, ImageIcon, BellRing } from "lucide-react" // Import BellRing icon
import {
  getDailyPromptSettings,
  saveDailyPromptSettings,
  startDailyPromptScheduler,
  stopDailyPromptScheduler,
  requestNotificationPermission,
} from "@/lib/notification-utils"
import { useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"

export default function CustomizePageClient() {
  const { primaryColor, setPrimaryColor, fontFamily, setFontFamily, fontSize, setFontSize, lineHeight, setLineHeight } =
    useUICustomization()
  const { nickname, setNickname, avatar, setAvatar, getAvatarSrc } = useUserProfile()

  const [dailyPromptEnabled, setDailyPromptEnabled] = useState(false)
  const [dailyPromptTime, setDailyPromptTime] = useState("09:00")

  useEffect(() => {
    const settings = getDailyPromptSettings()
    setDailyPromptEnabled(settings.enabled)
    setDailyPromptTime(settings.time)
  }, [])

  useEffect(() => {
    const settings = { enabled: dailyPromptEnabled, time: dailyPromptTime }
    saveDailyPromptSettings(settings)
    if (dailyPromptEnabled) {
      startDailyPromptScheduler(settings)
    } else {
      stopDailyPromptScheduler()
    }
  }, [dailyPromptEnabled, dailyPromptTime])

  const handleDailyPromptToggle = async (checked: boolean) => {
    if (checked) {
      const permission = await requestNotificationPermission()
      if (permission !== "granted") {
        toast({
          title: "Notification Permission Required",
          description: "Please grant notification permission to receive daily prompts.",
          variant: "destructive",
        })
        setDailyPromptEnabled(false) // Revert toggle if permission not granted
        return
      }
    }
    setDailyPromptEnabled(checked)
    toast({
      title: checked ? "Daily Prompts Enabled" : "Daily Prompts Disabled",
      description: checked
        ? `You'll receive a daily prompt at ${dailyPromptTime}.`
        : "Daily prompts have been turned off.",
    })
  }

  const availableFonts: CustomFont[] = [
    "Inter",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Merriweather",
    "Roboto Mono",
  ]

  const availableAvatars: AvatarOption[] = ["default", "robot", "person", "abstract", "cat", "dog"]

  return (
    <div className="container mx-auto py-6 px-4 md:py-10">
      <div className="mx-auto max-w-3xl">
        <Card className="border-2 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Customize Your UI
            </CardTitle>
            <CardDescription>Personalize the look and feel of Overthinkr to your preference.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-6">
            {/* User Profile Customization */}
            <div className="space-y-2">
              <Label htmlFor="nickname" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Your Nickname
              </Label>
              <Input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g., Thinker, Explorer"
                maxLength={20}
              />
              <p className="text-sm text-muted-foreground">This name will appear next to your messages.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Your Avatar
              </Label>
              <div className="flex items-center gap-3">
                <Select value={avatar} onValueChange={(value: AvatarOption) => setAvatar(value)}>
                  <SelectTrigger id="avatar" className="flex-1">
                    <SelectValue placeholder="Select an avatar" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAvatars.map((option) => (
                      <SelectItem key={option} value={option}>
                        <div className="flex items-center gap-2">
                          <img
                            src={getAvatarSrc() || "/placeholder.svg"}
                            alt={option}
                            className="h-5 w-5 rounded-full"
                          />
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <img
                  src={getAvatarSrc() || "/placeholder.svg"}
                  alt="Current Avatar"
                  className="h-10 w-10 rounded-full border"
                />
              </div>
              <p className="text-sm text-muted-foreground">Choose an icon to represent yourself in the chat.</p>
            </div>

            {/* Primary Color Customization */}
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Accent Color</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="primary-color"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-10 w-10 p-0 border-none cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                />
                <Input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1"
                  placeholder="#RRGGBB"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                This color will be used for user chat bubbles, primary buttons, and accents.
              </p>
            </div>

            {/* Font Family Customization */}
            <div className="space-y-2">
              <Label htmlFor="font-family">Font Family</Label>
              <Select value={fontFamily} onValueChange={(value: CustomFont) => setFontFamily(value)}>
                <SelectTrigger id="font-family">
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent>
                  {availableFonts.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Choose a font that suits your reading preference.</p>
            </div>

            {/* Font Size Customization */}
            <div className="space-y-2">
              <Label htmlFor="font-size" className="flex items-center gap-2">
                <Text className="h-4 w-4" />
                Font Size ({fontSize}px)
              </Label>
              <Input
                id="font-size"
                type="range"
                min="12"
                max="20"
                step="1"
                value={fontSize}
                onChange={(e) => setFontSize(Number.parseInt(e.target.value, 10))}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">Adjust the base font size for readability.</p>
            </div>

            {/* Line Height Customization */}
            <div className="space-y-2">
              <Label htmlFor="line-height" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                Line Spacing ({lineHeight.toFixed(1)}x)
              </Label>
              <Input
                id="line-height"
                type="range"
                min="1.2"
                max="2.0"
                step="0.1"
                value={lineHeight}
                onChange={(e) => setLineHeight(Number.parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">Control the spacing between lines of text.</p>
            </div>

            {/* Daily Prompt Notifications */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="daily-prompt-toggle" className="flex items-center gap-2">
                  <BellRing className="h-4 w-4" />
                  Daily Reflection Prompts
                </Label>
                <Switch
                  id="daily-prompt-toggle"
                  checked={dailyPromptEnabled}
                  onCheckedChange={handleDailyPromptToggle}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Receive a daily notification with a reflection prompt to help with overthinking.
              </p>
              {dailyPromptEnabled && (
                <div className="space-y-2 mt-2">
                  <Label htmlFor="daily-prompt-time">Preferred Time</Label>
                  <Input
                    id="daily-prompt-time"
                    type="time"
                    value={dailyPromptTime}
                    onChange={(e) => setDailyPromptTime(e.target.value)}
                    className="w-full sm:w-auto"
                  />
                  <p className="text-xs text-muted-foreground">
                    (Note: Notifications rely on your browser being open. For persistent notifications, a Service Worker
                    would be needed.)
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
