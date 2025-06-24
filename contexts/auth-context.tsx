"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { onAuthStateChanged, isSignInWithEmailLink, signInWithEmailLink, type User } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { toast } from "@/components/ui/use-toast"

interface AuthContextType {
  user: User | null
  loading: boolean
  isPremium: boolean
  refreshUserData: () => Promise<void>
  connectionStatus: "connecting" | "connected" | "error"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPremium, setIsPremium] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "error">("connecting")

  const refreshUserData = useCallback(async () => {
    if (!user?.uid) return

    setConnectionStatus("connecting")

    try {
      const userRef = doc(db, "users", user.uid)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        const userData = userSnap.data()
        setIsPremium(userData.isPremium || false)

        // Update last login
        await setDoc(
          userRef,
          {
            ...userData,
            lastLoginAt: new Date(),
          },
          { merge: true },
        )
      } else {
        // Create user document if it doesn't exist
        const newUserData = {
          email: user.email,
          displayName: user.displayName,
          isPremium: false,
          createdAt: new Date(),
          lastLoginAt: new Date(),
        }

        await setDoc(userRef, newUserData)
        setIsPremium(false)
      }

      setConnectionStatus("connected")
    } catch (error) {
      console.error("Error fetching/creating user data:", error)
      setIsPremium(false)
      setConnectionStatus("error")

      // Retry after a delay
      setTimeout(() => {
        refreshUserData()
      }, 3000)
    }
  }, [user?.uid])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      setLoading(false)

      if (currentUser) {
        await refreshUserData()
      } else {
        setIsPremium(false)
        setConnectionStatus("connecting")
      }
    })

    // Handle sign-in with email link
    if (typeof window !== "undefined" && isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem("emailForSignIn")
      if (!email) {
        email = window.prompt("Please provide your email for confirmation")
      }

      if (email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then(async (result) => {
            window.localStorage.removeItem("emailForSignIn")
            toast({
              title: "Login Successful!",
              description: "You have been logged in via email link.",
            })
            // Clean up URL
            window.history.replaceState({}, document.title, "/chat")
          })
          .catch((error) => {
            console.error("Error signing in with email link:", error)
            toast({
              title: "Login Failed",
              description: error.message || "Invalid or expired email link. Please try again.",
              variant: "destructive",
            })
            window.localStorage.removeItem("emailForSignIn")
          })
      } else {
        toast({
          title: "Login Canceled",
          description: "Email not provided for sign-in link.",
          variant: "destructive",
        })
      }
    }

    return () => unsubscribe()
  }, [refreshUserData])

  return (
    <AuthContext.Provider value={{ user, loading, isPremium, refreshUserData, connectionStatus }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
