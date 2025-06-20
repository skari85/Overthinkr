"use client"

import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useRef, useState } from "react"
import { Message } from "@/components/message"
import { TypingIndicator } from "@/components/typing-indicator"
import { Send, Lightbulb, RefreshCw, Trash2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAPI } from "@/contexts/api-context"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { WhatIfMessage } from "./what-if-message"
import type { Message as AIMessage } from "ai"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Import Select components
import { Label } from "@/components/ui/label" // Import Label
import { aiPersonas, type AIPersonaId } from "@/lib/ai-personas" // Import personas
import { guidedSessions } from "@/lib/guided-sessions" // Import guided sessions

const WHAT_IF_MESSAGES_STORAGE_KEY = "overthinkr-what-if-messages"
const WHAT_IF_PERSONA_STORAGE_KEY = "overthinkr-what-if-persona"

export default function WhatIfExplorer() {
  const { selectedService, getActiveApiKey, isConfigured } = useAPI()
  const [initialMessages, setInitialMessages] = useState<AIMessage[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedPersonaId, setSelectedPersonaId] = useState<AIPersonaId>("default") // State for selected persona
  const { messages, input, handleInputChange, handleSubmit, setMessages, reload, isLoading, setInput } = useChat({
    api: "/api/chat",
    body: {
      service: selectedService,
      apiKey: getActiveApiKey(),
      mode: "what-if", // Still signal "what-if" mode
      personaId: selectedPersonaId, // Send the selected persona ID
    },
    initialMessages: initialMessages,
  })

  // Load messages and persona from local storage on initial mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedMessages = localStorage.getItem(WHAT_IF_MESSAGES_STORAGE_KEY)
      if (storedMessages) {
        try {
          setInitialMessages(JSON.parse(storedMessages))
        } catch (error) {
          console.error("Failed to parse stored What If messages:", error)
          setInitialMessages([])
        }
      }

      const storedPersona = localStorage.getItem(WHAT_IF_PERSONA_STORAGE_KEY) as AIPersonaId
      if (storedPersona && aiPersonas.some((p) => p.id === storedPersona)) {
        setSelectedPersonaId(storedPersona)
      } else {
        setSelectedPersonaId("default") // Fallback to default if not found or invalid
      }

      setIsLoaded(true)
    }
  }, [])

  // Save messages to local storage whenever messages state changes
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem(WHAT_IF_MESSAGES_STORAGE_KEY, JSON.stringify(messages))
    }
  }, [messages, isLoaded])

  // Save selected persona to local storage whenever it changes
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem(WHAT_IF_PERSONA_STORAGE_KEY, selectedPersonaId)
    }
  }, [selectedPersonaId, isLoaded])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [newMessageId, setNewMessageId] = useState<string | null>(null)

  const handleClear = () => {
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

  const handleGuidedSessionClick = (prompt: string) => {
    setInput(prompt)
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

  if (!isLoaded) {
    return null
  }

  return (
    <div className="container mx-auto py-6 px-4 md:py-10">
      <div className="mx-auto max-w-3xl">
        <Card className="border-2 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              "What If" Scenario Explorer
            </CardTitle>
            <CardDescription>
              Input a hypothetical scenario, and the AI will help you explore potential outcomes, probabilities, and
              coping strategies.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px] md:h-[600px]">
              <div className="p-4 space-y-4" aria-live="polite">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-10 px-4">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                      Explore Your "What Ifs"
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                      Type out a hypothetical situation you're overthinking, or choose a guided session below.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
                      {guidedSessions.map((session) => (
                        <Card
                          key={session.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handleGuidedSessionClick(session.prompt)}
                        >
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">{session.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="text-sm">{session.description}</CardDescription>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((m) =>
                  m.role === "user" ? (
                    <Message
                      key={m.id}
                      content={m.content}
                      role={m.role as "user" | "assistant"}
                      isNew={m.id === newMessageId}
                    />
                  ) : (
                    <WhatIfMessage
                      key={m.id}
                      content={m.content}
                      isNew={m.id === newMessageId}
                      // You can pass onShare and showShareButton if needed for assistant messages
                    />
                  ),
                )}

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
            {/* Persona Selection */}
            <div className="w-full space-y-2">
              <Label htmlFor="ai-persona-select">AI Persona</Label>
              <Select value={selectedPersonaId} onValueChange={(value: AIPersonaId) => setSelectedPersonaId(value)}>
                <SelectTrigger id="ai-persona-select" className="w-full">
                  <SelectValue placeholder="Select an AI persona" />
                </SelectTrigger>
                <SelectContent>
                  {aiPersonas.map((persona) => (
                    <SelectItem key={persona.id} value={persona.id}>
                      {persona.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Textarea
                className="flex-1 min-h-[40px] max-h-[150px]"
                value={input}
                placeholder={isConfigured() ? "Describe your 'what if' scenario..." : "Configure API key first..."}
                onChange={handleInputChange}
                disabled={isLoading || !isConfigured()}
                rows={1}
                aria-label="Describe your 'what if' scenario"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      disabled={isLoading || !input.trim() || !isConfigured()}
                      variant="customPrimary"
                      aria-label="Analyze scenario"
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isConfigured() ? "Analyze scenario" : "Configure API key first"}</p>
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
                      onClick={handleRerun}
                      disabled={isLoading || messages.length === 0}
                      className="h-9 w-9"
                      aria-label="Rerun Last Query"
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
                      onClick={handleClear}
                      disabled={isLoading || messages.length === 0}
                      className="h-9 w-9"
                      aria-label="Clear Scenario"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Clear Scenario</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear scenario</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardFooter>

          {!isConfigured() && (
            <div className="border-t p-4 bg-yellow-50 dark:bg-yellow-900/20">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Please configure your API key to use the "What If" explorer.</AlertDescription>
              </Alert>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
