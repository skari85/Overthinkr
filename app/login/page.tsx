import { AuthForm } from "@/components/auth-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login / Sign Up",
  description: "Login or create an account to personalize your Overthinkr experience.",
}

export default function LoginPage() {
  // Read environment variables here in the Server Component
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      {/* Pass the environment variables as props to AuthForm */}
      <AuthForm supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} />
    </div>
  )
}
