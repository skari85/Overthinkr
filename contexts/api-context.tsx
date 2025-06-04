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

  // Load from localStorage on mount
  useEffect(() => {
    const savedService = localStorage.getItem("overthinkr-service") as AIService
    const savedGroqKey = localStorage.getItem("overthinkr-groq-key")
    const savedOpenRouterKey = localStorage.getItem("overthinkr-openrouter-key")

    if (savedService) setSelectedService(savedService)
    if (savedGroqKey) setGroqApiKey(savedGroqKey)
    if (savedOpenRouterKey) setOpenRouterApiKey(savedOpenRouterKey)
  }, [])

  // Save to localStorage when values change
  useEffect(() => {
    localStorage.setItem("overthinkr-service", selectedService)
  }, [selectedService])

  useEffect(() => {
    if (groqApiKey) {
      localStorage.setItem("overthinkr-groq-key", groqApiKey)
    }
  }, [groqApiKey])

  useEffect(() => {
    if (openRouterApiKey) {
      localStorage.setItem("overthinkr-openrouter-key", openRouterApiKey)
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
