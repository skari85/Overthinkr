import { initializeApp, getApps, cert, type App } from "firebase-admin/app"
import { getFirestore, type Firestore } from "firebase-admin/firestore"

let adminApp: App | null = null
let adminDb: Firestore | null = null

export function getFirebaseAdmin() {
  if (!adminApp) {
    try {
      // Check if we already have an initialized app
      const existingApps = getApps()
      if (existingApps.length > 0) {
        adminApp = existingApps[0]
      } else {
        // Validate environment variables
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
        const privateKey = process.env.FIREBASE_PRIVATE_KEY
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

        if (!clientEmail || !privateKey || !projectId) {
          throw new Error("Missing Firebase Admin credentials")
        }

        // Initialize Firebase Admin
        adminApp = initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey: privateKey.replace(/\\n/g, "\n"),
          }),
        })
      }

      // Initialize Firestore with connection pooling
      if (!adminDb) {
        adminDb = getFirestore(adminApp)
        // Configure Firestore settings for better performance
        adminDb.settings({
          ignoreUndefinedProperties: true,
        })
      }

      return { app: adminApp, db: adminDb }
    } catch (error) {
      console.error("Firebase Admin initialization error:", error)
      throw error
    }
  }

  return { app: adminApp, db: adminDb! }
}

// Export a singleton instance
export const { app: firebaseAdmin, db: adminFirestore } = (() => {
  try {
    return getFirebaseAdmin()
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error)
    return { app: null, db: null }
  }
})()
