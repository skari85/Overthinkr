"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client" // This still uses the client.ts which gets from process.env
import type { Session, SupabaseClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

interface SupabaseContextType {
  supabase: SupabaseClient
  session: Session | null
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

interface SupabaseProviderProps {
  children: ReactNode
  supabaseUrl: string
  supabaseAnonKey: string
}

export function SupabaseProvider({ children, supabaseUrl, supabaseAnonKey }: SupabaseProviderProps) {
  // Create the client here using the passed props
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      // Optional: Refresh page on auth state change to re-fetch server data
      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  return <SupabaseContext.Provider value={{ supabase, session }}>{children}</SupabaseContext.Provider>
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider")
  }
  return context
}
