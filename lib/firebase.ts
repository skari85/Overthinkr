// Import Firebase SDK modules
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Firebase configuration - Updated with your new project
const firebaseConfig = {
  apiKey: "AIzaSyDElkoHboShTMRtY5w-RTRR4cmmZbdefdM",
  authDomain: "overthinkr-8a79c.firebaseapp.com",
  projectId: "overthinkr-8a79c",
  storageBucket: "overthinkr-8a79c.firebasestorage.app",
  messagingSenderId: "501719963551",
  appId: "1:501719963551:web:55aa75df800461215f8faa",
  measurementId: "G-53EM1RDJL2",
}

// Initialize Firebase app
const app = initializeApp(firebaseConfig)

// Initialize and export services
export const auth = getAuth(app) // 🔐 Authentication
export const db = getFirestore(app) // 🧠 Firestore DB
export const storage = getStorage(app) // 📦 Cloud Storage

// Initialize Analytics only on the client side
export const analytics = (() => {
  if (typeof window !== "undefined") {
    // Only import and initialize analytics in the browser
    import("firebase/analytics").then(({ getAnalytics }) => {
      return getAnalytics(app)
    })
  }
  return null
})()

export default app // Export the main app instance too
