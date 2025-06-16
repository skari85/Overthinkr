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
  isPremium: boolean // New: Premium status
  setIsPremium: (value: boolean) => void // New: Setter for premium status
}

const APIContext = createContext<APIContextType | undefined>(undefined)

interface APIProviderProps {
  children: ReactNode
  initialGroqApiKey?: string // New prop for server-provided key
}

export function APIProvider({ children, initialGroqApiKey }: APIProviderProps) {
  const [selectedService, setSelectedService] = useState<AIService>("groq")
  // Initialize groqApiKey with the server-provided key, or from local storage
  const [groqApiKey, setGroqApiKey] = useState(initialGroqApiKey || "")
  const [openRouterApiKey, setOpenRouterApiKey] = useState("")
  const [isPremium, setIsPremium] = useState(false) // New: Premium state

  // Load from localStorage on mount, but prioritize initialGroqApiKey
  useEffect(() => {
    const savedService = localStorage.getItem("overthinkr-service") as AIService
    const savedGroqKey = localStorage.getItem("overthinkr-groq-key")
    const savedOpenRouterKey = localStorage.getItem("overthinkr-openrouter-key")
    const savedIsPremium = localStorage.getItem("overthinkr-is-premium")

    // If initialGroqApiKey is provided, it takes precedence and sets Groq as selected
    if (initialGroqApiKey) {
      setGroqApiKey(initialGroqApiKey)
      setSelectedService("groq")
    } else if (savedGroqKey) {
      // Otherwise, load from local storage
      setGroqApiKey(savedGroqKey)
    }

    if (savedOpenRouterKey) setOpenRouterApiKey(savedOpenRouterKey)
    if (savedIsPremium !== null) setIsPremium(JSON.parse(savedIsPremium)) // Load premium status

    // If no initialGroqApiKey and no saved service, use saved service
    if (!initialGroqApiKey && savedService) setSelectedService(savedService)
  }, [initialGroqApiKey]) // Re-run if initialGroqApiKey changes (though it typically won't after first render)

  // Save to localStorage when values change
  useEffect(() => {
    localStorage.setItem("overthinkr-service", selectedService)
  }, [selectedService])

  useEffect(() => {
    // Only save to local storage if the key is not the one provided by the server
    // This prevents overwriting a server-provided key with an empty string from local storage
    if (groqApiKey && groqApiKey !== initialGroqApiKey) {
      localStorage.setItem("overthinkr-groq-key", groqApiKey)
    } else if (!groqApiKey && localStorage.getItem("overthinkr-groq-key")) {
      // Clear local storage if key is removed and not from initial prop
      localStorage.removeItem("overthinkr-groq-key")
    }
  }, [groqApiKey, initialGroqApiKey])

  useEffect(() => {
    if (openRouterApiKey) {
      localStorage.setItem("overthinkr-openrouter-key", openRouterApiKey)
    } else if (!openRouterApiKey && localStorage.getItem("overthinkr-openrouter-key")) {
      localStorage.removeItem("overthinkr-openrouter-key")
    }
  }, [openRouterApiKey])

  // New: Save premium status to local storage
  useEffect(() => {
    localStorage.setItem("overthinkr-is-premium", JSON.stringify(isPremium))
  }, [isPremium])

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
        isPremium, // New: Provide premium status
        setIsPremium, // New: Provide premium setter
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
