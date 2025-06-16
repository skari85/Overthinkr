"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { onAuthStateChanged, isSignInWithEmailLink, signInWithEmailLink, type User } from "firebase/auth" // Added email link imports
import { auth } from "@/lib/firebase" // Import Firebase auth instance
import { toast } from "@/components/ui/use-toast" // Import toast for notifications

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    // Handle sign-in with email link
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem("emailForSignIn")
      if (!email) {
        // User opened the link on a different device or cleared local storage.
        // Prompt for email to prevent session fixation attacks.
        email = window.prompt("Please provide your email for confirmation")
      }

      if (email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then((result) => {
            window.localStorage.removeItem("emailForSignIn")
            toast({
              title: "Login Successful!",
              description: "You have been logged in via email link.",
            })
            // Optionally redirect, e.g., to /chat
            window.history.replaceState({}, document.title, "/chat")
          })
          .catch((error) => {
            console.error("Error signing in with email link:", error)
            toast({
              title: "Login Failed",
              description: error.message || "Invalid or expired email link. Please try again.",
              variant: "destructive",
            })
            window.localStorage.removeItem("emailForSignIn") // Clear even on error
          })
      } else {
        toast({
          title: "Login Canceled",
          description: "Email not provided for sign-in link.",
          variant: "destructive",
        })
      }
    }

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, []) // Empty dependency array ensures this runs once on mount

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
