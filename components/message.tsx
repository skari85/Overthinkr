"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Share2, Lightbulb } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useUserProfile } from "@/contexts/user-profile-context" // Import user profile context

interface MessageProps {
  content: string
  role: "user" | "assistant"
  isNew?: boolean
  // New prop for sharing specific messages
  onShare?: () => void
  showShareButton?: boolean
  // New prop for setting reminders
  onSetReminder?: () => void
  showSetReminderButton?: boolean
}

export function Message({
  content,
  role,
  isNew = false,
  onShare,
  showShareButton = false,
  onSetReminder,
  showSetReminderButton = false,
}: MessageProps) {
  const { nickname, getAvatarSrc } = useUserProfile() // Use user profile context

  return (
    <div
      className={cn(
        "flex items-start gap-3 transition-opacity",
        role === "user" ? "justify-end" : "justify-start",
        isNew && "animate-bounce-in",
      )}
    >
      {role === "assistant" && (
        <Avatar className="h-8 w-8 border bg-white dark:bg-gray-800 shadow-sm">
          <AvatarFallback className="bg-overthinkr-100 dark:bg-overthinkr-900 text-overthinkr-600 dark:text-overthinkr-400 font-bold">
            O
          </AvatarFallback>
        </Avatar>
      )}
      <div className={cn("max-w-[80%] p-3", role === "user" ? "chat-bubble-user" : "chat-bubble-ai")}>
        <p className="text-sm leading-relaxed">{content}</p>
        {(showShareButton || showSetReminderButton) && (
          <div className="mt-2 flex justify-end gap-1">
            {showSetReminderButton && onSetReminder && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-foreground"
                      onClick={onSetReminder}
                    >
                      <Lightbulb className="h-3 w-3" />
                      <span className="sr-only">Set Reminder</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Set a reminder for this insight</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {showShareButton && onShare && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-foreground"
                      onClick={onShare}
                    >
                      <Share2 className="h-3 w-3" />
                      <span className="sr-only">Share this message</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share this message</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
      </div>
      {role === "user" && (
        <Avatar className="h-8 w-8 border bg-white dark:bg-gray-800 shadow-sm">
          <AvatarImage src={getAvatarSrc() || "/placeholder.svg"} alt={nickname} /> {/* Use dynamic avatar src */}
          <AvatarFallback className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            {nickname.charAt(0).toUpperCase()} {/* Use first letter of nickname */}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
