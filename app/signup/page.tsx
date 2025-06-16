"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, signInAnonymously } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { UserPlus, LogIn } from "lucide-react"
import { GithubAuthProvider, signInWithPopup } from "firebase/auth"
import { Github } from "lucide-react" // Import Github icon

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      toast({
        title: "Registration Successful!",
        description: "Your account has been created. You are now logged in.",
      })
      router.push("/chat") // Redirect to chat page after successful signup
    } catch (error: any) {
      console.error("Error signing up:", error)
      toast({
        title: "Registration Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubSignup = async () => {
    setIsLoading(true)
    try {
      const provider = new GithubAuthProvider()
      await signInWithPopup(auth, provider)
      toast({
        title: "Registration Successful!",
        description: "Your account has been created with GitHub. You are now logged in.",
      })
      router.push("/chat")
    } catch (error: any) {
      console.error("Error signing up with GitHub:", error)
      toast({
        title: "GitHub Sign Up Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnonymousSignup = async () => {
    setIsLoading(true)
    try {
      await signInAnonymously(auth)
      toast({
        title: "Anonymous Login Successful!",
        description: "You are now logged in anonymously.",
      })
      router.push("/chat")
    } catch (error: any) {
      console.error("Error logging in anonymously:", error)
      toast({
        title: "Anonymous Login Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6 px-4 md:py-10 flex justify-center items-center min-h-[calc(100vh-120px)]">
      <Card className="w-full max-w-md border-2 shadow-lg rounded-xl">
        <CardHeader className="pb-3 text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <UserPlus className="h-6 w-6" />
            Create Your Overthinkr Account
          </CardTitle>
          <CardDescription>Sign up to save your progress and personalize your experience.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-6">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing Up..." : "Sign Up"}
            </Button>
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-300 dark:border-gray-700" />
              <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300 dark:border-gray-700" />
            </div>
            <Button
              type="button"
              onClick={handleGithubSignup}
              className="w-full flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              disabled={isLoading}
            >
              <Github className="h-5 w-5" />
              {isLoading ? "Signing Up..." : "Sign up with GitHub"}
            </Button>
            <Button
              type="button"
              onClick={handleAnonymousSignup}
              className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              disabled={isLoading}
            >
              <LogIn className="h-5 w-5" />
              {isLoading ? "Entering..." : "Continue as Guest"}
            </Button>
          </form>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-overthinkr-600 hover:underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
