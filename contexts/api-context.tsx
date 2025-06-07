"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type AIService = "groq" | "openrouter"

interface APIContextType {
  selectedService: AIService
  setSelectedService: (service: AIService) => void
  groqApiKey: string
  setGroqApiKey: (key: string) => void
  openRouterApiKey: string
  setOpenRouterApiKey: (key: string) => void
  getActiveApiKey: () => string
  isConfigured: () => boolean
}

const APIContext = createContext<APIContextType | undefined>(undefined)

export function APIProvider({ children }: { children: ReactNode }) {
  const [selectedService, setSelectedService] = useState<AIService>("groq")
  const [groqApiKey, setGroqApiKey] = useState("")
  const [openRouterApiKey, setOpenRouterApiKey] = useState("")

  // Load from localStorage or environment variable on mount
  useEffect(() => {
    const savedService = localStorage.getItem("overthinkr-service") as AIService
    const savedGroqKey = localStorage.getItem("overthinkr-groq-key")
    const savedOpenRouterKey = localStorage.getItem("overthinkr-openrouter-key")

    // Prioritize NEXT_PUBLIC_GROQ_API_KEY from environment if available
    const envGroqKey = process.env.NEXT_PUBLIC_GROQ_API_KEY
    if (envGroqKey) {
      setGroqApiKey(envGroqKey)
      // If an env key is present, default to Groq service
      setSelectedService("groq")
    } else if (savedGroqKey) {
      setGroqApiKey(savedGroqKey)
    }

    // OpenRouter key still relies on local storage or manual input
    if (savedOpenRouterKey) setOpenRouterApiKey(savedOpenRouterKey)

    // If no env key for Groq, and no saved service, use saved service
    if (!envGroqKey && savedService) setSelectedService(savedService)
  }, [])

  // Save to localStorage when values change, but only if not from env
  useEffect(() => {
    localStorage.setItem("overthinkr-service", selectedService)
  }, [selectedService])

  useEffect(() => {
    // Only save to local storage if the key is not from the environment variable
    if (groqApiKey && groqApiKey !== process.env.NEXT_PUBLIC_GROQ_API_KEY) {
      localStorage.setItem("overthinkr-groq-key", groqApiKey)
    } else if (!groqApiKey && localStorage.getItem("overthinkr-groq-key")) {
      // Clear local storage if key is removed and not from env
      localStorage.removeItem("overthinkr-groq-key")
    }
  }, [groqApiKey])

  useEffect(() => {
    if (openRouterApiKey) {
      localStorage.setItem("overthinkr-openrouter-key", openRouterApiKey)
    } else if (!openRouterApiKey && localStorage.getItem("overthinkr-openrouter-key")) {
      localStorage.removeItem("overthinkr-openrouter-key")
    }
  }, [openRouterApiKey])

  const getActiveApiKey = () => {
    return selectedService === "groq" ? groqApiKey : openRouterApiKey
  }

  const isConfigured = () => {
    const activeKey = getActiveApiKey()
    return activeKey.length > 0
  }

  return (
    <APIContext.Provider
      value={{
        selectedService,
        setSelectedService,
        groqApiKey,
        setGroqApiKey,
        openRouterApiKey,
        setOpenRouterApiKey,
        getActiveApiKey,
        isConfigured,
      }}
    >
      {children}
    </APIContext.Provider>
  )
}

export function useAPI() {
  const context = useContext(APIContext)
  if (context === undefined) {
    throw new Error("useAPI must be used within an APIProvider")
  }
  return context
}
