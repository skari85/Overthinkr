import { createBrowserClient } from "@supabase/ssr"

export function createClient(supabaseUrl: string, supabaseAnonKey: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase URL and Anon Key are required to create a browser client. " +
        "Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set and passed correctly.",
    )
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
