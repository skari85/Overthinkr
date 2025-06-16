"use client"

import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useRef, useState } from "react"
import { Message } from "@/components/message"
import { TypingIndicator } from "@/components/typing-indicator"
import { RefreshCw, Send, Trash2, Share2, ArrowLeft } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAPI } from "@/contexts/api-context"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShareDialog } from "@/components/share-dialog"
import { toast } from "@/components/ui/use-toast"
import { saveClassification } from "@/lib/analytics-utils"
import { checkAndUnlockAchievements } from "@/lib/achievements-utils"
import { generateShareLink } from "@/lib/share-utils"
import { copyToClipboard } from "@/utils/export-utils"
import type { Message as AIMessage } from "ai"
import Link from "next/link"
import { APIConfig } from "@/components/api-config"
import { useAuth } from "@/contexts/auth-context" // Import useAuth
import { loadConversation, saveConversation, clearConversation } from "@/lib/firestore-utils" // Import Firestore utils

interface OverthinkrChatProps {
  sharedMessages?: AIMessage[] | null
}

// Removed LOCAL_STORAGE_CHAT_KEY

export default function OverthinkrChat({ sharedMessages }: OverthinkrChatProps) {
  const { selectedService, getActiveApiKey, isConfigured } = useAPI()
  const { user, loading: authLoading } = useAuth() // Get user and authLoading from AuthContext

  const { messages, input, handleInputChange, handleSubmit, setMessages, reload, isLoading, setInput } = useChat({
    api: "/api/chat",
    body: {
      service: selectedService,
      apiKey: getActiveApiKey(),
    },
    initialMessages: [], // Initial messages are loaded in useEffect
    onFinish: (message) => {
      const content = message.content.toLowerCase()
      if (content.startsWith("yep, you're overthinking")) {
        saveClassification("overthinking")
      } else if (content.startsWith("nah, this might be valid")) {
        saveClassification("valid")
      }
      const newlyUnlocked = checkAndUnlockAchievements()
      newlyUnlocked.forEach((ach) => {
        toast({
          title: `Achievement Unlocked: ${ach.name}!`,
          description: ach.description,
          duration: 5000,
        })
      })
    },
    // Use onMessagesChange to save to Firestore
    onMessagesChange: (currentMessages) => {
      if (user?.uid) {
        // Debounce saving to avoid too many writes
        const debounceSave = setTimeout(() => {
          saveConversation(user.uid, currentMessages)
        }, 500) // Save 500ms after messages stop changing
        return () => clearTimeout(debounceSave)
      }
    },
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [newMessageId, setNewMessageId] = useState<string | null>(null)
  const [shareAllDialogOpen, setShareAllDialogOpen] = useState(false)
  const [isChatLoaded, setIsChatLoaded] = useState(false) // To prevent saving empty array on initial load

  // Load messages from Firestore on component mount or user change
  useEffect(() => {
    const loadChat = async () => {
      if (user?.uid && !isChatLoaded) {
        const savedChat = await loadConversation(user.uid)
        setMessages(savedChat)
        setIsChatLoaded(true)
      } else if (!user?.uid && isChatLoaded) {
        // If user logs out, clear messages from UI
        setMessages([])
        setIsChatLoaded(false)
      }
    }
    if (!authLoading) {
      // Only try to load if auth state is known
      loadChat()
    }
  }, [user, authLoading, setMessages, isChatLoaded])

  const handleClearChat = async () => {
    if (user?.uid) {
      await clearConversation(user.uid)
      toast({
        title: "Chat Cleared",
        description: "Your conversation has been removed from the cloud.",
      })
    } else {
      toast({
        title: "Chat Cleared Locally",
        description: "Your conversation has been cleared from this browser.",
      })
    }
    setMessages([]) // Clear messages from UI
  }

  const handleRerun = () => {
    if (messages.length > 0) {
      const lastUserMessage = messages.filter((m) => m.role === "user").pop()
      if (lastUserMessage) {
        reload()
      }
    }
  }

  const handleShareAll = () => {
    if (messages.length === 0) {
      toast({
        title: "Nothing to share",
        description: "Start a conversation first before sharing.",
        variant: "destructive",
      })
      return
    }
    setShareAllDialogOpen(true)
  }

  const handleShareSpecificMessage = async (messageId: string) => {
    const messageIndex = messages.findIndex((m) => m.id === messageId)
    if (messageIndex === -1) return

    let startIndex = messageIndex
    while (startIndex >= 0 && messages[startIndex].role !== "user") {
      startIndex--
    }
    if (startIndex < 0) startIndex = messageIndex

    const messagesToShare = messages.slice(startIndex, messageIndex + 1)
    const shareLink = generateShareLink(messagesToShare)

    if (shareLink) {
      const success = await copyToClipboard(shareLink)
      if (success) {
        toast({
          title: "Share link copied!",
          description: "The link to this conversation snippet has been copied to your clipboard.",
        })
      } else {
        toast({
          title: "Failed to copy link",
          description: "Could not copy the share link. Please try again.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Failed to generate link",
        description: "Could not generate a shareable link for this message.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

    if (messages.length > 0) {
      const newestMessage = messages[messages.length - 1]
      setNewMessageId(newestMessage.id)

      const timer = setTimeout(() => {
        setNewMessageId(null)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [messages])

  if (sharedMessages) {
    return (
      <div className="container mx-auto py-6 px-4 md:py-10">
        <div className="mx-auto max-w-3xl">
          <Card className="border-2 shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Shared Conversation Snippet
              </CardTitle>
              <CardDescription>This is a shared portion of an Overthinkr conversation.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {sharedMessages.map((m) => (
                <Message key={m.id} content={m.content} role={m.role as "user" | "assistant"} />
              ))}
            </CardContent>
            <div className="border-t p-4 flex justify-center">
              <Link href="/chat" passHref>
                <Button variant="customPrimary">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go to Full Chat
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 md:py-10">
      <div className="mx-auto max-w-3xl">
        <Card className="border-2 shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <ScrollArea className="h-[500px] md:h-[600px]">
              <div className="p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-96 text-center py-10 px-4">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Welcome to Overthinkr!</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                      Describe your problem, and I'll help you figure out if you're overthinking it.
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 max-w-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                        Try asking something like: "Should I text them again?" or "I'm worried about my presentation
                        tomorrow."
                      </p>
                    </div>
                  </div>
                )}

                {messages.map((m, index) => (
                  <Message
                    key={m.id}
                    content={m.content}
                    role={m.role as "user" | "assistant"}
                    isNew={m.id === newMessageId}
                    showShareButton={m.role === "assistant" && !isLoading && index > 0}
                    onShare={() => handleShareSpecificMessage(m.id)}
                    // Removed showReframingButton and onReframingRequest for now
                  />
                ))}

                {isLoading && (
                  <div className="flex items-start gap-3">
                    <TypingIndicator />
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="border-t p-4 flex flex-col gap-3">
            {!user && !authLoading && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm text-blue-800 dark:text-blue-200 text-center">
                <p>Login to save your chat history to the cloud!</p>
                <Button
                  variant="link"
                  onClick={() => window.location.reload()}
                  className="p-0 h-auto text-blue-800 dark:text-blue-200 underline"
                >
                  Click here to log in anonymously.
                </Button>
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                className="flex-1"
                value={input}
                placeholder={isConfigured() ? "What's on your mind?" : "Configure API key first..."}
                onChange={handleInputChange}
                disabled={isLoading || !isConfigured()}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      disabled={isLoading || !input.trim() || !isConfigured()}
                      variant="customPrimary"
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isConfigured() ? "Send message" : "Configure API key first"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </form>

            <div className="flex w-full justify-end gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleShareAll}
                      disabled={messages.length === 0}
                      className="h-9 w-9"
                    >
                      <Share2 className="h-4 w-4" />
                      <span className="sr-only">Share Conversation</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share entire conversation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleRerun}
                      disabled={isLoading || messages.length === 0}
                      className="h-9 w-9"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span className="sr-only">Rerun Last Query</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Rerun last query</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleClearChat}
                      disabled={isLoading || messages.length === 0}
                      className="h-9 w-9"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Clear Chat</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear chat</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardFooter>

          {!isConfigured() && (
            <div className="border-t p-4 bg-yellow-50 dark:bg-yellow-900/20">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please configure your API key below to start chatting with Overthinkr.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </Card>

        <div className="mt-4">
          <APIConfig />
        </div>
      </div>
      <ShareDialog open={shareAllDialogOpen} onOpenChange={setShareAllDialogOpen} messages={messages} />
    </div>
  )
}
