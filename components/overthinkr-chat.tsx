"use client"

import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useRef, useState } from "react"
import { Message } from "@/components/message"
import { TypingIndicator } from "@/components/typing-indicator"
import { RefreshCw, Send, Trash2, Share2, ArrowLeft, Coins, BookOpen } from "lucide-react"
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
import { useAuth } from "@/contexts/auth-context"
import { loadConversation, saveConversation, clearConversation } from "@/lib/firestore-utils"

interface OverthinkrChatProps {
  sharedMessages?: AIMessage[] | null
}

const META_COMMENTARY_PHRASES = [
  "My circuits are buzzing with all these possibilities!",
  "Even I need a moment to process that one.",
  "Is it just me, or are we going in circles? Just kidding... mostly.",
  "Thinking about thinking... a very human endeavor.",
  "That's a deep one! My processors are working overtime.",
  "Sometimes, even an AI needs a moment to compute.",
]

export default function OverthinkrChat({ sharedMessages }: OverthinkrChatProps) {
  const { selectedService, getActiveApiKey, isConfigured } = useAPI()
  const { user, loading: authLoading } = useAuth()

  const { messages, input, handleInputChange, handleSubmit, setMessages, reload, isLoading, setInput, append } =
    useChat({
      api: "/api/chat",
      body: {
        service: selectedService,
        apiKey: getActiveApiKey(),
        mode: "chat", // Default mode for main chat
      },
      initialMessages: [],
      onFinish: async (message) => {
        if (user?.uid) {
          const content = message.content.toLowerCase()
          if (content.startsWith("yep, you're overthinking")) {
            await saveClassification(user.uid, "overthinking")
          } else if (content.startsWith("nah, this might be valid")) {
            await saveClassification(user.uid, "valid")
          }
          const newlyUnlocked = await checkAndUnlockAchievements(user.uid)
          newlyUnlocked.forEach((ach) => {
            toast({
              title: `Achievement Unlocked: ${ach.name}!`,
              description: ach.description,
              duration: 5000,
            })
          })
        }

        // Randomly add a meta-commentary after an AI response
        if (Math.random() < 0.2) {
          // 20% chance for a meta-commentary
          const randomPhrase = META_COMMENTARY_PHRASES[Math.floor(Math.random() * META_COMMENTARY_PHRASES.length)]
          append({
            id: `meta-${Date.now()}`,
            role: "assistant",
            content: randomPhrase,
            // You might add a custom type here if you want different styling for meta-commentary
            // type: "meta-commentary"
          })
        }
      },
      onMessagesChange: (currentMessages) => {
        if (user?.uid) {
          const debounceSave = setTimeout(() => {
            saveConversation(user.uid, currentMessages)
          }, 500)
          return () => clearTimeout(debounceSave)
        }
      },
    })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [newMessageId, setNewMessageId] = useState<string | null>(null)
  const [shareAllDialogOpen, setShareAllDialogOpen] = useState(false)
  const [isChatLoaded, setIsChatLoaded] = useState(false)
  const [isHaikuLoading, setIsHaikuLoading] = useState(false)

  useEffect(() => {
    const loadChat = async () => {
      if (user?.uid && !isChatLoaded) {
        const savedChat = await loadConversation(user.uid)
        setMessages(savedChat)
        setIsChatLoaded(true)
      } else if (!user?.uid && isChatLoaded) {
        setMessages([])
        setIsChatLoaded(false)
      }
    }
    if (!authLoading) {
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
    setMessages([])
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

  const handleCoinFlip = () => {
    const result = Math.random() < 0.5 ? "Heads" : "Tails"
    const commentary =
      result === "Heads"
        ? "It's heads! The universe has spoken... or has it just given you more to think about?"
        : "Tails! A clear sign... or just another variable to consider?"

    append({
      id: `coin-flip-${Date.now()}`,
      role: "assistant",
      content: `Coin Flip Result: **${result}**\n\n${commentary}`,
    })
  }

  const handleHaikuSummary = async () => {
    if (messages.length === 0) {
      toast({
        title: "No conversation to summarize",
        description: "Start a conversation first!",
        variant: "destructive",
      })
      return
    }

    setIsHaikuLoading(true)
    try {
      const conversationText = messages
        .map((m) => `${m.role === "user" ? "You" : "Overthinkr"}: ${m.content}`)
        .join("\n")
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Summarize the following conversation into a single haiku (5-7-5 syllables). Focus on the core dilemma and the Overthinkr's final verdict (overthinking or valid).\n\nConversation:\n${conversationText}`,
            },
          ],
          service: selectedService,
          apiKey: getActiveApiKey(),
          mode: "haiku-summary", // New mode for haiku generation
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let haikuContent = ""

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break
        haikuContent += decoder.decode(value, { stream: true })
      }

      append({
        id: `haiku-${Date.now()}`,
        role: "assistant",
        content: `Here's your conversation haiku:\n\n${haikuContent}`,
      })
    } catch (error) {
      console.error("Error generating haiku:", error)
      toast({
        title: "Haiku Generation Failed",
        description: "Could not generate haiku. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsHaikuLoading(false)
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
                <p>Login to save your chat history, analytics, and achievements to the cloud!</p>
                <Link href="/login" passHref>
                  <Button variant="link" className="p-0 h-auto text-blue-800 dark:text-blue-200 underline">
                    Click here to log in or sign up.
                  </Button>
                </Link>
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
              {/* Coin Flip Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCoinFlip}
                      disabled={isLoading || !isConfigured()}
                      className="h-9 w-9"
                      aria-label="Flip a Coin"
                    >
                      <Coins className="h-4 w-4" />
                      <span className="sr-only">Flip a Coin</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Flip a coin for a quick decision</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Haiku Summary Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleHaikuSummary}
                      disabled={isLoading || isHaikuLoading || messages.length === 0 || !isConfigured()}
                      className="h-9 w-9"
                      aria-label="Summarize as Haiku"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span className="sr-only">Summarize as Haiku</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Summarize conversation as a haiku</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

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
