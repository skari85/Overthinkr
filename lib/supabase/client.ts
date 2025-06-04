import { createBrowserClient } from "@supabase/ssr"

// Modify createClient to accept URL and key as arguments
export function createClient(supabaseUrl: string, supabaseAnonKey: string) {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
