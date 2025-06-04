import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface MessageProps {
  content: string
  role: "user" | "assistant"
  isNew?: boolean
}

export function Message({ content, role, isNew = false }: MessageProps) {
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
