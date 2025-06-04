"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useSupabase } from "@/providers/supabase-provider" // Import useSupabase
import { toast } from "@/components/ui/use-toast"

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
  isLoadingKeys: boolean // New loading state
}

const APIContext = createContext<APIContextType | undefined>(undefined)

export function APIProvider({ children }: { children: ReactNode }) {
  const { supabase, session } = useSupabase() // Get Supabase client and session
  const [selectedService, setSelectedService] = useState<AIService>("groq")
  const [groqApiKey, setGroqApiKeyState] = useState("")
  const [openRouterApiKey, setOpenRouterApiKeyState] = useState("")
  const [isLoadingKeys, setIsLoadingKeys] = useState(true) // Initial loading state

  // Function to fetch API keys from Supabase
  const fetchApiKeys = useCallback(
    async (userId: string) => {
      setIsLoadingKeys(true)
      const { data, error } = await supabase
        .from("user_settings")
        .select("groq_api_key, openrouter_api_key")
        .eq("user_id", userId)
        .single()

      if (error && error.code !== "PGRST116") {
        // PGRST116 means no rows found (first time user)
        console.error("Error fetching API keys:", error)
        toast({
          title: "Error loading API keys",
          description: error.message,
          variant: "destructive",
        })
      } else if (data) {
        setGroqApiKeyState(data.groq_api_key || "")
        setOpenRouterApiKeyState(data.openrouter_api_key || "")
      } else {
        // No settings found, initialize with empty keys
        setGroqApiKeyState("")
        setOpenRouterApiKeyState("")
      }
      setIsLoadingKeys(false)
    },
    [supabase],
  )

  // Function to upsert API keys to Supabase
  const upsertApiKeys = useCallback(
    async (userId: string, groqKey: string, openRouterKey: string) => {
      const { error } = await supabase.from("user_settings").upsert(
        {
          user_id: userId,
          groq_api_key: groqKey,
          openrouter_api_key: openRouterKey,
        },
        { onConflict: "user_id" }, // Upsert based on user_id
      )

      if (error) {
        console.error("Error saving API keys:", error)
        toast({
          title: "Error saving API keys",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "API keys saved!",
          description: "Your API keys have been securely saved.",
        })
      }
    },
    [supabase],
  )

  // Load initial API keys when session changes
  useEffect(() => {
    if (session?.user?.id) {
      fetchApiKeys(session.user.id)
    } else {
      // Clear keys if no user is logged in
      setGroqApiKeyState("")
      setOpenRouterApiKeyState("")
      setIsLoadingKeys(false)
    }
  }, [session, fetchApiKeys])

  // Load selected service from localStorage (still client-side preference)
  useEffect(() => {
    const savedService = localStorage.getItem("overthinkr-service") as AIService
    if (savedService) setSelectedService(savedService)
  }, [])

  // Save selected service to localStorage
  useEffect(() => {
    localStorage.setItem("overthinkr-service", selectedService)
  }, [selectedService])

  // Wrapped setters to also upsert to Supabase
  const setGroqApiKey = useCallback(
    (key: string) => {
      setGroqApiKeyState(key)
      if (session?.user?.id) {
        upsertApiKeys(session.user.id, key, openRouterApiKey)
      }
    },
    [session, upsertApiKeys, openRouterApiKey],
  )

  const setOpenRouterApiKey = useCallback(
    (key: string) => {
      setOpenRouterApiKeyState(key)
      if (session?.user?.id) {
        upsertApiKeys(session.user.id, groqApiKey, key)
      }
    },
    [session, upsertApiKeys, groqApiKey],
  )

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
        isLoadingKeys,
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
