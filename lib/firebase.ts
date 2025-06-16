// Import Firebase SDK modules
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASioCZ7-tEynXFVQA5DB8XqkHqKq9OaV0",
  authDomain: "overthinkr-ae885.firebaseapp.com",
  projectId: "overthinkr-ae885",
  storageBucket: "overthinkr-ae885.appspot.com",
  messagingSenderId: "976828352294",
  appId: "1:976828352294:web:4175693776ad102d6523e7",
  measurementId: "G-ZEWWW1KK6D",
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
