"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  createUserWithEmailAndPassword,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { UserPlus, LogIn, Chrome, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showDomainError, setShowDomainError] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password || !confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Update display name if provided
      if (displayName.trim()) {
        await updateProfile(userCredential.user, {
          displayName: displayName.trim(),
        })
      }

      console.log("Signup successful:", userCredential.user)
      toast({
        title: "Registration Successful!",
        description: "Your account has been created. Welcome to Overthinkr!",
      })
      router.push("/chat")
    } catch (error: any) {
      console.error("Error signing up:", error)
      let errorMessage = "An unexpected error occurred. Please try again."

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "An account with this email already exists."
          break
        case "auth/invalid-email":
          errorMessage = "Invalid email address format."
          break
        case "auth/weak-password":
          errorMessage = "Password is too weak. Please choose a stronger password."
          break
        case "auth/operation-not-allowed":
          errorMessage = "Email/password accounts are not enabled."
          break
      }

      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
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

      provider.addScope("email")
      provider.addScope("profile")

      const result = await signInWithPopup(auth, provider)
      console.log("Google signup successful:", result.user)
      toast({
        title: "Registration Successful!",
        description: "Your account has been created with Google. Welcome to Overthinkr!",
      })
      router.push("/chat")
    } catch (error: any) {
      console.error("Error signing up with Google:", error)

      let errorMessage = "An unexpected error occurred. Please try again."

      if (error.code === "auth/configuration-not-found") {
        setShowDomainError(true)
        errorMessage = "Google sign-up is not properly configured. Please use email/password signup or contact support."
      } else if (error.code === "auth/unauthorized-domain") {
        setShowDomainError(true)
        errorMessage =
          "This domain is not authorized for Google sign-in. Please use email/password signup or contact support."
      } else if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign-up was cancelled. Please try again."
      } else if (error.code === "auth/popup-blocked") {
        errorMessage = "Pop-up was blocked by your browser. Please allow pop-ups and try again."
      } else if (error.code === "auth/account-exists-with-different-credential") {
        errorMessage = "An account already exists with the same email address but different sign-in credentials."
      } else if (error.code === "auth/invalid-oauth-client-id") {
        errorMessage = "OAuth client configuration error. Please contact support."
      }

      toast({
        title: "Google Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnonymousSignup = async () => {
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
            <UserPlus className="h-6 w-6" />
            Create Your Overthinkr Account
          </CardTitle>
          <CardDescription>Sign up to save your progress and personalize your experience.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-6">
          {/* Domain Authorization Warning */}
          {showDomainError && (
            <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800 dark:text-orange-200">
                <strong>Domain Not Authorized:</strong> Social sign-up is not available on this domain.
                <br />
                <span className="text-sm mt-1 block">
                  Please use email/password signup or contact support. The domain{" "}
                  <code className="bg-orange-100 dark:bg-orange-800 px-1 rounded text-xs">
                    {typeof window !== "undefined" ? window.location.hostname : ""}
                  </code>{" "}
                  needs to be authorized.
                </span>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name (Optional)</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="Your Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={isLoading}
              />
            </div>
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
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Sign Up"}
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
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              disabled={isLoading}
            >
              <Chrome className="h-5 w-5" />
              {isLoading ? "Signing Up..." : "Sign up with Google"}
            </Button>

            <Button
              type="button"
              onClick={handleAnonymousSignup}
              className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
              disabled={isLoading}
            >
              <LogIn className="h-5 w-5" />
              {isLoading ? "Entering..." : "Continue as Guest"}
            </Button>
          </div>

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
