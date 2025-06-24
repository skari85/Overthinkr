"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface DiagnosticResults {
  firebaseConfig: boolean
  envVars: boolean
  authState: boolean
  firestoreConnection: boolean
  stripeConfig: boolean
  error?: string
}

export default function DebugPage() {
  const { user, loading, isPremium } = useAuth()
  const [diagnostics, setDiagnostics] = useState<DiagnosticResults>({
    firebaseConfig: false,
    envVars: false,
    authState: false,
    firestoreConnection: false,
    stripeConfig: false,
  })
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    runDiagnostics()
  }, [user])

  const runDiagnostics = async () => {
    setIsRunning(true)
    const results: DiagnosticResults = {
      firebaseConfig: false,
      envVars: false,
      authState: false,
      firestoreConnection: false,
      stripeConfig: false,
    }

    try {
      // Check Firebase config
      try {
        const { auth } = await import("@/lib/firebase")
        results.firebaseConfig = !!auth
      } catch (error) {
        console.error("Firebase config error:", error)
        results.firebaseConfig = false
        results.error = `Firebase: ${error}`
      }

      // Check environment variables
      results.envVars = !!(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_BASE_URL)

      // Check auth state
      results.authState = !loading && !!user

      // Check Firestore connection
      if (user?.uid) {
        try {
          const { getAnalyticsData } = await import("@/lib/analytics-utils")
          await getAnalyticsData(user.uid)
          results.firestoreConnection = true
        } catch (error) {
          console.error("Firestore connection error:", error)
          results.firestoreConnection = false
          results.error = `Firestore: ${error}`
        }
      }

      // Check Stripe config
      results.stripeConfig = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    } catch (error) {
      console.error("Diagnostic error:", error)
      results.error = `General: ${error}`
    }

    setDiagnostics(results)
    setIsRunning(false)
  }

  const DiagnosticItem = ({
    label,
    status,
    details,
  }: {
    label: string
    status: boolean
    details?: string
  }) => (
    <div className="flex items-center justify-between p-3 border rounded">
      <div>
        <span className="font-medium">{label}</span>
        {details && <p className="text-sm text-muted-foreground">{details}</p>}
      </div>
      {status ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
    </div>
  )

  return (
    <div className="container mx-auto py-6 px-4 md:py-10">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Production Diagnostics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DiagnosticItem
              label="Firebase Configuration"
              status={diagnostics.firebaseConfig}
              details="Firebase SDK initialization"
            />

            <DiagnosticItem
              label="Environment Variables"
              status={diagnostics.envVars}
              details={`Project ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "Missing"}`}
            />

            <DiagnosticItem
              label="Authentication State"
              status={diagnostics.authState}
              details={user ? `Logged in as ${user.email}` : "Not logged in"}
            />

            <DiagnosticItem
              label="Firestore Connection"
              status={diagnostics.firestoreConnection}
              details="Database read/write access"
            />

            <DiagnosticItem
              label="Stripe Configuration"
              status={diagnostics.stripeConfig}
              details="Payment system setup"
            />

            {diagnostics.error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <h3 className="font-semibold text-red-800 mb-2">Error Details:</h3>
                <p className="text-sm text-red-700">{diagnostics.error}</p>
              </div>
            )}

            <div className="mt-6 p-4 bg-muted rounded">
              <h3 className="font-semibold mb-2">Environment Info:</h3>
              <ul className="text-sm space-y-1">
                <li>Environment: {process.env.NODE_ENV}</li>
                <li>Base URL: {process.env.NEXT_PUBLIC_BASE_URL || "Not set"}</li>
                <li>Firebase Project: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "Not set"}</li>
                <li>User Premium: {isPremium ? "Yes" : "No"}</li>
                <li>User ID: {user?.uid || "Not logged in"}</li>
                <li>Timestamp: {new Date().toISOString()}</li>
              </ul>
            </div>

            <Button onClick={runDiagnostics} className="w-full" disabled={isRunning}>
              {isRunning ? "Running..." : "Run Diagnostics Again"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
