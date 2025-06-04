"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface AuthFormProps {
  supabaseUrl: string
  supabaseAnonKey: string
}

export function AuthForm({ supabaseUrl, supabaseAnonKey }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  // Pass the props to createClient
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let error = null
    if (isLogin) {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      error = signInError
    } else {
      const { error: signUpError } = await supabase.auth.signUp({ email, password })
      error = signUpError
    }

    setLoading(false)

    if (error) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: isLogin ? "Logged In Successfully!" : "Signed Up Successfully!",
        description: isLogin
          ? "Welcome back to Overthinkr."
          : "Please check your email to confirm your account (if email confirmation is enabled).",
      })
      router.push("/chat") // Redirect to chat page after successful auth
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{isLogin ? "Login" : "Sign Up"}</CardTitle>
        <CardDescription>
          {isLogin
            ? "Enter your credentials to access your profile."
            : "Create an account to personalize your experience."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isLogin ? "Logging In..." : "Signing Up..."}
              </>
            ) : isLogin ? (
              "Login"
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <Button variant="link" onClick={() => setIsLogin(false)} className="p-0 h-auto">
                Sign Up
              </Button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Button variant="link" onClick={() => setIsLogin(true)} className="p-0 h-auto">
                Login
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
