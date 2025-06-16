"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context" // Import useAuth

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
  isGroqKeyFromEnv: boolean // New: Indicates if Groq key is from environment
}

const APIContext = createContext<APIContextType | undefined>(undefined)

interface APIProviderProps {
  children: ReactNode
  initialGroqApiKey?: string // Prop for server-provided key
}

export function APIProvider({ children, initialGroqApiKey }: APIProviderProps) {
  const { user } = useAuth() // Get user from AuthContext
  const [selectedService, setSelectedService] = useState<AIService>("groq")
  const [groqApiKey, setGroqApiKeyState] = useState(initialGroqApiKey || "")
  const [openRouterApiKey, setOpenRouterApiKey] = useState("")
  const [isGroqKeyFromEnv, setIsGroqKeyFromEnv] = useState(false) // New state

  // Load from localStorage on mount, but prioritize initialGroqApiKey
  useEffect(() => {
    const savedService = localStorage.getItem("overthinkr-service") as AIService
    const savedGroqKey = localStorage.getItem("overthinkr-groq-key")
    const savedOpenRouterKey = localStorage.getItem("overthinkr-openrouter-key")

    if (initialGroqApiKey) {
      setGroqApiKeyState(initialGroqApiKey)
      setSelectedService("groq")
      setIsGroqKeyFromEnv(true) // Mark as from environment
    } else if (savedGroqKey) {
      setGroqApiKeyState(savedGroqKey)
      setIsGroqKeyFromEnv(false) // Not from environment, from local storage
    }

    if (savedOpenRouterKey) setOpenRouterApiKey(savedOpenRouterKey)

    if (!initialGroqApiKey && savedService) setSelectedService(savedService)
  }, [initialGroqApiKey])

  // Custom setter for Groq API key to respect environment variable
  const setGroqApiKey = (key: string) => {
    if (isGroqKeyFromEnv) {
      // If the key is from the environment, prevent it from being changed via UI
      console.warn("Groq API Key is provided by environment and cannot be changed via UI.")
      return
    }
    setGroqApiKeyState(key)
  }

  // Save to localStorage when values change
  useEffect(() => {
    localStorage.setItem("overthinkr-service", selectedService)
  }, [selectedService])

  useEffect(() => {
    // Only save to local storage if the key is not the one provided by the server
    if (!isGroqKeyFromEnv) {
      if (groqApiKey) {
        localStorage.setItem("overthinkr-groq-key", groqApiKey)
      } else {
        localStorage.removeItem("overthinkr-groq-key")
      }
    }
  }, [groqApiKey, isGroqKeyFromEnv])

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
        isGroqKeyFromEnv, // Provide new state
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
