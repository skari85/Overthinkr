"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { useAPI, type AIService } from "@/contexts/api-context"
import { Settings, ChevronDown, ChevronUp, Key, ExternalLink, Eye, EyeOff } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function APIConfig() {
  const {
    selectedService,
    setSelectedService,
    groqApiKey,
    setGroqApiKey,
    openRouterApiKey,
    setOpenRouterApiKey,
    isConfigured,
    isGroqKeyFromEnv, // Get isGroqKeyFromEnv
  } = useAPI()

  const [isOpen, setIsOpen] = useState(false)
  const [showGroqKey, setShowGroqKey] = useState(false)
  const [showOpenRouterKey, setShowOpenRouterKey] = useState(false)

  const handleServiceChange = (service: AIService) => {
    setSelectedService(service)
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
                          disabled={isGroqKeyFromEnv} // Disable if key is from environment
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
                disabled={isGroqKeyFromEnv} // Disable input if key is from environment
              />
              {isGroqKeyFromEnv && (
                <p className="text-xs text-green-600 dark:text-green-400">
                  This key is provided by the environment and cannot be changed here.
                </p>
              )}
              {groqApiKey && !showGroqKey && !isGroqKeyFromEnv && (
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
