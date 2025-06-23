"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  signInWithEmailAndPassword,
  sendSignInLinkToEmail,
  signInWithPopup,
  signInAnonymously,
  GoogleAuthProvider,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { LogIn, Mail, Chrome, AlertTriangle, Copy } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailLinkSent, setEmailLinkSent] = useState(false)
  const [showDomainError, setShowDomainError] = useState(false)
  const [currentDomain, setCurrentDomain] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Get current domain for error display
    if (typeof window !== "undefined") {
      setCurrentDomain(window.location.hostname)
    }
  }, [])

  const copyDomainToClipboard = async () => {
    if (currentDomain) {
      try {
        await navigator.clipboard.writeText(currentDomain)
        toast({
          title: "Domain Copied",
          description: `${currentDomain} copied to clipboard`,
        })
      } catch (error) {
        toast({
          title: "Copy Failed",
          description: "Could not copy domain to clipboard",
          variant: "destructive",
        })
      }
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log("Login successful:", userCredential.user)
      toast({
        title: "Login Successful!",
        description: "Welcome back to Overthinkr.",
      })
      router.push("/chat")
    } catch (error: any) {
      console.error("Error logging in:", error)
      let errorMessage = "An unexpected error occurred. Please try again."

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email address."
          break
        case "auth/wrong-password":
          errorMessage = "Incorrect password. Please try again."
          break
        case "auth/invalid-email":
          errorMessage = "Invalid email address format."
          break
        case "auth/user-disabled":
          errorMessage = "This account has been disabled."
          break
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later."
          break
        case "auth/invalid-credential":
          errorMessage = "Invalid email or password. Please check your credentials."
          break
      }

      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setShowDomainError(false)
    try {
      const provider = new GoogleAuthProvider()

      // Use custom client ID if provided via environment variable
      if (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
        provider.setCustomParameters({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        })
      }

      // Add required scopes
      provider.addScope("email")
      provider.addScope("profile")

      const result = await signInWithPopup(auth, provider)
      console.log("Google login successful:", result.user)
      toast({
        title: "Login Successful!",
        description: "You have been logged in with Google.",
      })
      router.push("/chat")
    } catch (error: any) {
      console.error("Error logging in with Google:", error)

      let errorMessage = "An unexpected error occurred. Please try again."

      if (error.code === "auth/unauthorized-domain") {
        setShowDomainError(true)
        errorMessage = `The domain "${currentDomain}" is not authorized for Google sign-in. Please use email/password login instead.`
      } else if (error.code === "auth/configuration-not-found") {
        setShowDomainError(true)
        errorMessage = "Google sign-in is not properly configured. Please use email/password login."
      } else if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign-in was cancelled. Please try again."
      } else if (error.code === "auth/popup-blocked") {
        errorMessage = "Pop-up was blocked by your browser. Please allow pop-ups and try again."
      } else if (error.code === "auth/cancelled-popup-request") {
        errorMessage = "Sign-in request was cancelled. Please try again."
      } else if (error.code === "auth/invalid-oauth-client-id") {
        errorMessage = "OAuth client configuration error. Please contact support."
      }

      toast({
        title: "Google Login Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendEmailLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setEmailLinkSent(false)
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/login`,
        handleCodeInApp: true,
      }
      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      window.localStorage.setItem("emailForSignIn", email)
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
      const result = await signInAnonymously(auth)
      console.log("Anonymous login successful:", result.user)
      toast({
        title: "Anonymous Login Successful!",
        description: "You are now logged in as a guest.",
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
          {/* Domain Authorization Warning */}
          {showDomainError && (
            <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800 dark:text-orange-200">
                <div className="space-y-3">
                  <div>
                    <strong>Domain Not Authorized for Google Sign-in</strong>
                    <br />
                    <span className="text-sm">
                      The domain{" "}
                      <code className="bg-orange-100 dark:bg-orange-800 px-1 rounded text-xs font-mono">
                        {currentDomain}
                      </code>{" "}
                      needs to be added to Firebase authorized domains.
                    </span>
                  </div>

                  <div className="text-sm space-y-2">
                    <p>
                      <strong>Quick Fix:</strong>
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>
                        Go to{" "}
                        <a
                          href="https://console.firebase.google.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          Firebase Console
                        </a>
                      </li>
                      <li>Select your project → Authentication → Settings</li>
                      <li>Add this domain to "Authorized domains":</li>
                    </ol>
                    <div className="flex items-center gap-2 bg-orange-100 dark:bg-orange-800 p-2 rounded">
                      <code className="text-xs font-mono flex-1">{currentDomain}</code>
                      <Button variant="ghost" size="sm" onClick={copyDomainToClipboard} className="h-6 w-6 p-0">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-sm">
                    <strong>Alternative:</strong> Use email/password login below (works on any domain)
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

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
              {isLoading ? "Logging In..." : "Login with Email"}
            </Button>
          </form>

          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700" />
            <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700" />
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              disabled={isLoading}
            >
              <Chrome className="h-5 w-5" />
              {isLoading ? "Signing In..." : "Sign in with Google"}
            </Button>

            <Button
              type="button"
              onClick={handleAnonymousLogin}
              className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
              disabled={isLoading}
            >
              <LogIn className="h-5 w-5" />
              {isLoading ? "Entering..." : "Continue as Guest"}
            </Button>
          </div>

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
