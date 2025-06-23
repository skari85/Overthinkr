"use client"

import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useRef, useState } from "react"
import { Message } from "@/components/message"
import { TypingIndicator } from "@/components/typing-indicator"
import { Send, Lightbulb, RefreshCw, Trash2, Upload } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAPI } from "@/contexts/api-context"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { WhatIfMessage } from "./what-if-message"
import { FileUpload } from "./file-upload"
import type { Message as AIMessage } from "ai"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { aiPersonas, type AIPersonaId } from "@/lib/ai-personas"
import { guidedSessions } from "@/lib/guided-sessions"
import { useAuth } from "@/contexts/auth-context"
import type { UploadResult } from "@/lib/storage-utils"
import Link from "next/link"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const WHAT_IF_MESSAGES_STORAGE_KEY = "overthinkr-what-if-messages"
const WHAT_IF_PERSONA_STORAGE_KEY = "overthinkr-what-if-persona"

export default function WhatIfExplorer() {
  const { selectedService, getActiveApiKey, isConfigured } = useAPI()
  const { user, loading: authLoading, isPremium } = useAuth()
  const [initialMessages, setInitialMessages] = useState<AIMessage[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedPersonaId, setSelectedPersonaId] = useState<AIPersonaId>("default")
  const [uploadedFiles, setUploadedFiles] = useState<UploadResult[]>([])
  const [showFileUpload, setShowFileUpload] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, setMessages, reload, isLoading, setInput } = useChat({
    api: "/api/chat",
    body: {
      service: selectedService,
      apiKey: getActiveApiKey(),
      mode: "what-if",
      personaId: selectedPersonaId,
      uploadedFiles: uploadedFiles, // Include uploaded files in the request
    },
    initialMessages: initialMessages,
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [newMessageId, setNewMessageId] = useState<string | null>(null)

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
        setSelectedPersonaId("default")
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

  const handleClear = () => {
    setMessages([])
    setUploadedFiles([])
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

  const handleFileUpload = (result: UploadResult) => {
    setUploadedFiles((prev) => [...prev, result])
    setInput((prev) => prev + `\n\n[Uploaded file: ${result.name}]`)
  }

  const removeUploadedFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
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

  if (!isLoaded || authLoading) {
    return null
  }

  const isFeatureEnabled = isConfigured() && isPremium

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
              Input a hypothetical scenario, upload files for analysis, and the AI will help you explore potential
              outcomes, probabilities, and coping strategies.
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
                      Type out a hypothetical situation you're overthinking, upload files for analysis, or choose a
                      guided session below.
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
                    <WhatIfMessage key={m.id} content={m.content} isNew={m.id === newMessageId} />
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
            {/* File Upload Section */}
            <Collapsible open={showFileUpload} onOpenChange={setShowFileUpload}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between" disabled={!isFeatureEnabled}>
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    <span>Upload Files for Analysis</span>
                  </div>
                  {uploadedFiles.length > 0 && (
                    <span className="text-xs bg-overthinkr-100 text-overthinkr-700 px-2 py-1 rounded">
                      {uploadedFiles.length} file{uploadedFiles.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <FileUpload
                  onUploadComplete={handleFileUpload}
                  disabled={!isFeatureEnabled}
                  folder="what-if-analysis"
                  allowedTypes={[
                    "image/*",
                    "text/*",
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  ]}
                  maxSizeInMB={25}
                />
                {uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <Label>Uploaded Files:</Label>
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                      >
                        <span className="text-sm">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeUploadedFile(index)}
                          disabled={!isFeatureEnabled}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>

            {/* Persona Selection */}
            <div className="w-full space-y-2">
              <Label htmlFor="ai-persona-select">AI Persona</Label>
              <Select
                value={selectedPersonaId}
                onValueChange={(value: AIPersonaId) => setSelectedPersonaId(value)}
                disabled={!isFeatureEnabled}
              >
                <SelectTrigger id="ai-persona-select" className="w-full">
                  <SelectValue placeholder="Select an AI persona" />
                </SelectTrigger>
                <SelectContent>
                  {aiPersonas.map((persona) => (
                    <SelectItem key={persona.id} value={persona.id} disabled={persona.isPremium && !isPremium}>
                      {persona.name} {persona.isPremium && !isPremium && "(Premium)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Textarea
                className="flex-1 min-h-[40px] max-h-[150px]"
                value={input}
                placeholder={
                  isFeatureEnabled ? "Describe your 'what if' scenario..." : "Upgrade to Premium to use this feature."
                }
                onChange={handleInputChange}
                disabled={isLoading || !isFeatureEnabled}
                rows={1}
                aria-label="Describe your 'what if' scenario"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      disabled={isLoading || !input.trim() || !isFeatureEnabled}
                      variant="customPrimary"
                      aria-label="Analyze scenario"
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isFeatureEnabled ? "Analyze scenario" : "Upgrade to Premium"}</p>
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
                      disabled={isLoading || messages.length === 0 || !isFeatureEnabled}
                      className="h-9 w-9"
                      aria-label="Rerun Last Query"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span className="sr-only">Rerun Last Query</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isFeatureEnabled ? "Rerun last query" : "Upgrade to Premium"}</p>
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
                      disabled={isLoading || messages.length === 0 || !isFeatureEnabled}
                      className="h-9 w-9"
                      aria-label="Clear Scenario"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Clear Scenario</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isFeatureEnabled ? "Clear scenario" : "Upgrade to Premium"}</p>
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
          {!isPremium && isConfigured() && (
            <div className="border-t p-4 bg-blue-50 dark:bg-blue-900/20">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  The "What If" Scenario Explorer and file upload are premium features.{" "}
                  <Link href="/subscribe" className="underline font-medium">
                    Upgrade to Premium
                  </Link>{" "}
                  to unlock them!
                </AlertDescription>
              </Alert>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
