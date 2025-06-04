"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MessageProps {
  content: string
  role: "user" | "assistant"
  isNew?: boolean
  // New prop for sharing specific messages
  onShare?: () => void
  showShareButton?: boolean
}

export function Message({ content, role, isNew = false, onShare, showShareButton = false }: MessageProps) {
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
        {showShareButton && onShare && (
          <div className="mt-2 flex justify-end">
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
          </div>
        )}
      </div>
      {role === "user" && (
        <Avatar className="h-8 w-8 border bg-white dark:bg-gray-800 shadow-sm">
          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="You" />
          <AvatarFallback className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">You</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
