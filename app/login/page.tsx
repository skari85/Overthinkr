"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  signInWithEmailAndPassword,
  sendSignInLinkToEmail,
  GithubAuthProvider,
  signInWithPopup,
  signInAnonymously,
} from "firebase/auth" // Added sendSignInLinkToEmail
import { auth } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { LogIn, Mail, Github } from "lucide-react" // Added Mail icon

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailLinkSent, setEmailLinkSent] = useState(false) // New state for email link status
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast({
        title: "Login Successful!",
        description: "You have been logged in.",
      })
      router.push("/chat") // Redirect to chat page after successful login
    } catch (error: any) {
      console.error("Error logging in:", error)
      toast({
        title: "Login Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubLogin = async () => {
    setIsLoading(true)
    try {
      const provider = new GithubAuthProvider()
      await signInWithPopup(auth, provider)
      toast({
        title: "Login Successful!",
        description: "You have been logged in with GitHub.",
      })
      router.push("/chat")
    } catch (error: any) {
      console.error("Error logging in with GitHub:", error)
      toast({
        title: "GitHub Login Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendEmailLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setEmailLinkSent(false) // Reset status
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/login`, // This URL must be whitelisted in Firebase Console
        handleCodeInApp: true,
      }
      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      window.localStorage.setItem("emailForSignIn", email) // Save email for verification
      setEmailLinkSent(true)
      toast({
        title: "Email Sent!",
        description: "A sign-in link has been sent to your email. Please check your inbox.",
      })
    } catch (error: any) {
      console.error("Error sending email link:", error)
      toast({
        title: "Failed to Send Email",
        description: error.message || "Could not send sign-in link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnonymousLogin = async () => {
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
            <LogIn className="h-6 w-6" />
            Login to Overthinkr
          </CardTitle>
          <CardDescription>Access your saved chats, analytics, and achievements.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
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
              {isLoading ? "Logging In..." : "Login"}
            </Button>
          </form>

          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700" />
            <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700" />
          </div>

          <Button
            type="button"
            onClick={handleGithubLogin}
            className="w-full flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            disabled={isLoading}
          >
            <Github className="h-5 w-5" />
            {isLoading ? "Signing In..." : "Sign in with GitHub"}
          </Button>

          <Button
            type="button"
            onClick={handleAnonymousLogin}
            className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            disabled={isLoading}
          >
            <LogIn className="h-5 w-5" />
            {isLoading ? "Entering..." : "Continue as Guest"}
          </Button>

          <form onSubmit={handleSendEmailLink} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-link">Sign in with Email Link</Label>
              <Input
                id="email-link"
                type="email"
                placeholder="your-email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || emailLinkSent}
              />
            </div>
            <Button type="submit" variant="outline" className="w-full" disabled={isLoading || emailLinkSent}>
              {isLoading ? "Sending Link..." : emailLinkSent ? "Link Sent!" : "Send Sign-in Link"}
              {!isLoading && !emailLinkSent && <Mail className="h-4 w-4 ml-2" />}
            </Button>
            {emailLinkSent && (
              <p className="text-sm text-green-600 dark:text-green-400 text-center">
                Check your email for the sign-in link.
              </p>
            )}
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-overthinkr-600 hover:underline">
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
