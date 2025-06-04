"use client"

import { useEffect } from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { useAPI, type AIService } from "@/contexts/api-context"
import { Settings, ChevronDown, ChevronUp, Key, ExternalLink, Eye, EyeOff, Cpu } from "lucide-react" // Import Cpu icon
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Define available models for each service
const availableModels: Record<AIService, { id: string; name: string }[]> = {
  groq: [
    { id: "llama3-8b-8192", name: "Llama 3 8B" },
    { id: "llama3-70b-8192", name: "Llama 3 70B" },
    { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B" },
  ],
  openrouter: [
    { id: "meta-llama/llama-3.1-8b-instruct:free", name: "Llama 3.1 8B (Free)" },
    { id: "openai/gpt-4o", name: "GPT-4o" },
    { id: "anthropic/claude-3-opus", name: "Claude 3 Opus" },
    { id: "google/gemini-pro", name: "Gemini Pro" },
  ],
}

export function APIConfig() {
  const {
    selectedService,
    setSelectedService,
    groqApiKey,
    setGroqApiKey,
    openRouterApiKey,
    setOpenRouterApiKey,
    isConfigured,
  } = useAPI()

  const [isOpen, setIsOpen] = useState(false)
  const [showGroqKey, setShowGroqKey] = useState(false)
  const [showOpenRouterKey, setShowOpenRouterKey] = useState(false)
  const [selectedModel, setSelectedModel] = useState<string>(
    localStorage.getItem(`overthinkr-model-${selectedService}`) || availableModels[selectedService][0].id,
  )

  // Update selected model when service changes
  useEffect(() => {
    const savedModel = localStorage.getItem(`overthinkr-model-${selectedService}`)
    setSelectedModel(savedModel || availableModels[selectedService][0].id)
  }, [selectedService])

  // Save selected model to local storage
  useEffect(() => {
    localStorage.setItem(`overthinkr-model-${selectedService}`, selectedModel)
  }, [selectedModel, selectedService])

  const handleServiceChange = (service: AIService) => {
    setSelectedService(service)
    // Reset model to default for the new service if no saved model exists
    const savedModel = localStorage.getItem(`overthinkr-model-${service}`)
    setSelectedModel(savedModel || availableModels[service][0].id)
  }

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId)
  }

  const getServiceStatus = (service: AIService) => {
    const key = service === "groq" ? groqApiKey : openRouterApiKey
    return key.length > 0 ? "configured" : "not-configured"
  }

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key
    return key.slice(0, 4) + "•".repeat(key.length - 8) + key.slice(-4)
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>AI Service Configuration</span>
            <Badge variant={isConfigured() ? "default" : "destructive"} className="text-xs">
              {isConfigured() ? "Configured" : "Setup Required"}
            </Badge>
          </div>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Configuration
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Configure your AI service and API keys. Your keys are stored locally and never sent to our servers.
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Service Selection */}
            <div className="space-y-2">
              <Label htmlFor="service-select">AI Service</Label>
              <Select value={selectedService} onValueChange={handleServiceChange}>
                <SelectTrigger id="service-select">
                  <SelectValue placeholder="Select AI service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="groq">
                    <div className="flex items-center justify-between w-full">
                      <span>Groq</span>
                      <Badge
                        variant={getServiceStatus("groq") === "configured" ? "default" : "secondary"}
                        className="ml-2"
                      >
                        {getServiceStatus("groq") === "configured" ? "✓" : "○"}
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="openrouter">
                    <div className="flex items-center justify-between w-full">
                      <span>OpenRouter</span>
                      <Badge
                        variant={getServiceStatus("openrouter") === "configured" ? "default" : "secondary"}
                        className="ml-2"
                      >
                        {getServiceStatus("openrouter") === "configured" ? "✓" : "○"}
                      </Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Model Selection */}
            <div className="space-y-2">
              <Label htmlFor="model-select" className="flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                AI Model
              </Label>
              <Select value={selectedModel} onValueChange={handleModelChange} disabled={!isConfigured()}>
                <SelectTrigger id="model-select">
                  <SelectValue placeholder="Select AI model" />
                </SelectTrigger>
                <SelectContent>
                  {availableModels[selectedService].map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Choose the specific AI model to power your conversations.</p>
            </div>

            {/* Groq API Key */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="groq-key">Groq API Key</Label>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open("https://console.groq.com/keys", "_blank")}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Get Groq API Key</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button variant="ghost" size="sm" onClick={() => setShowGroqKey(!showGroqKey)}>
                    {showGroqKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
              <Input
                id="groq-key"
                type={showGroqKey ? "text" : "password"}
                placeholder="gsk_..."
                value={groqApiKey}
                onChange={(e) => setGroqApiKey(e.target.value)}
                className={selectedService === "groq" ? "ring-2 ring-overthinkr-200" : ""}
              />
              {groqApiKey && !showGroqKey && (
                <p className="text-xs text-muted-foreground">Key: {maskApiKey(groqApiKey)}</p>
              )}
            </div>

            {/* OpenRouter API Key */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="openrouter-key">OpenRouter API Key</Label>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open("https://openrouter.ai/keys", "_blank")}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Get OpenRouter API Key</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button variant="ghost" size="sm" onClick={() => setShowOpenRouterKey(!showOpenRouterKey)}>
                    {showOpenRouterKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
              <Input
                id="openrouter-key"
                type={showOpenRouterKey ? "text" : "password"}
                placeholder="sk-or-v1-..."
                value={openRouterApiKey}
                onChange={(e) => setOpenRouterApiKey(e.target.value)}
                className={selectedService === "openrouter" ? "ring-2 ring-overthinkr-200" : ""}
              />
              {openRouterApiKey && !showOpenRouterKey && (
                <p className="text-xs text-muted-foreground">Key: {maskApiKey(openRouterApiKey)}</p>
              )}
            </div>

            {/* Service Info */}
            <div className="bg-muted/50 rounded-lg p-3 text-sm">
              {selectedService === "groq" && (
                <div>
                  <p className="font-medium">Groq</p>
                  <p className="text-muted-foreground">Fast inference with Llama models. Free tier available.</p>
                </div>
              )}
              {selectedService === "openrouter" && (
                <div>
                  <p className="font-medium">OpenRouter</p>
                  <p className="text-muted-foreground">
                    Access to multiple AI models including GPT-4, Claude, and more.
                  </p>
                </div>
              )}
            </div>

            {!isConfigured() && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Please configure an API key for the selected service to start chatting.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  )
}
