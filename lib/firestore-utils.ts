import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore"
import type { Message } from "ai"
import type { AnalyticsEntry } from "./analytics-utils" // Import AnalyticsEntry type
import type { Achievement } from "./achievements-utils" // Import Achievement type

const CONVERSATIONS_COLLECTION = "conversations"
const ANALYTICS_COLLECTION = "analytics" // New collection for analytics
const ACHIEVEMENTS_COLLECTION = "achievements" // New collection for achievements

/**
 * Saves a user's conversation to Firestore.
 * Each user will have one document in the 'conversations' collection,
 * where the document ID is the user's UID.
 * @param userId The Firebase User ID.
 * @param messages The array of AI messages to save.
 */
export async function saveConversation(userId: string, messages: Message[]) {
  if (!userId) {
    console.warn("Cannot save conversation: userId is null or undefined.")
    return
  }
  try {
    const conversationRef = doc(db, CONVERSATIONS_COLLECTION, userId)
    await setDoc(conversationRef, { messages }, { merge: false }) // Overwrite existing messages
    console.log("Conversation saved for user:", userId)
  } catch (error) {
    console.error("Error saving conversation:", error)
  }
}

/**
 * Loads a user's conversation from Firestore.
 * @param userId The Firebase User ID.
 * @returns An array of AI messages, or an empty array if not found.
 */
export async function loadConversation(userId: string): Promise<Message[]> {
  if (!userId) {
    console.warn("Cannot load conversation: userId is null or undefined.")
    return []
  }
  try {
    const conversationRef = doc(db, CONVERSATIONS_COLLECTION, userId)
    const docSnap = await getDoc(conversationRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      return (data?.messages || []) as Message[]
    } else {
      console.log("No conversation found for user:", userId)
      return []
    }
  } catch (error) {
    console.error("Error loading conversation:", error)
    return []
  }
}

/**
 * Clears (deletes) a user's conversation from Firestore.
 * @param userId The Firebase User ID.
 */
export async function clearConversation(userId: string) {
  if (!userId) {
    console.warn("Cannot clear conversation: userId is null or undefined.")
    return
  }
  try {
    const conversationRef = doc(db, CONVERSATIONS_COLLECTION, userId)
    await deleteDoc(conversationRef)
    console.log("Conversation cleared for user:", userId)
  } catch (error) {
    console.error("Error clearing conversation:", error)
  }
}

/**
 * Saves a user's analytics data to Firestore.
 * @param userId The Firebase User ID.
 * @param analyticsData The array of AnalyticsEntry objects to save.
 */
export async function saveAnalytics(userId: string, analyticsData: AnalyticsEntry[]) {
  if (!userId) {
    console.warn("Cannot save analytics: userId is null or undefined.")
    return
  }
  try {
    const analyticsRef = doc(db, ANALYTICS_COLLECTION, userId)
    await setDoc(analyticsRef, { entries: analyticsData }, { merge: false })
    console.log("Analytics saved for user:", userId)
  } catch (error) {
    console.error("Error saving analytics:", error)
  }
}

/**
 * Loads a user's analytics data from Firestore.
 * @param userId The Firebase User ID.
 * @returns An array of AnalyticsEntry objects, or an empty array if not found.
 */
export async function loadAnalytics(userId: string): Promise<AnalyticsEntry[]> {
  if (!userId) {
    console.warn("Cannot load analytics: userId is null or undefined.")
    return []
  }
  try {
    const analyticsRef = doc(db, ANALYTICS_COLLECTION, userId)
    const docSnap = await getDoc(analyticsRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      return (data?.entries || []) as AnalyticsEntry[]
    } else {
      console.log("No analytics found for user:", userId)
      return []
    }
  } catch (error) {
    console.error("Error loading analytics:", error)
    return []
  }
}

/**
 * Clears (deletes) a user's analytics data from Firestore.
 * @param userId The Firebase User ID.
 */
export async function clearAnalytics(userId: string) {
  if (!userId) {
    console.warn("Cannot clear analytics: userId is null or undefined.")
    return
  }
  try {
    const analyticsRef = doc(db, ANALYTICS_COLLECTION, userId)
    await deleteDoc(analyticsRef)
    console.log("Analytics cleared for user:", userId)
  } catch (error) {
    console.error("Error clearing analytics:", error)
  }
}

/**
 * Saves a user's achievement data to Firestore.
 * @param userId The Firebase User ID.
 * @param achievements The array of Achievement objects to save.
 */
export async function saveUserAchievements(userId: string, achievements: Achievement[]) {
  if (!userId) {
    console.warn("Cannot save achievements: userId is null or undefined.")
    return
  }
  try {
    const achievementsRef = doc(db, ACHIEVEMENTS_COLLECTION, userId)
    await setDoc(achievementsRef, { achievements }, { merge: false })
    console.log("Achievements saved for user:", userId)
  } catch (error) {
    console.error("Error saving achievements:", error)
  }
}

/**
 * Loads a user's achievement data from Firestore.
 * @param userId The Firebase User ID.
 * @returns An array of Achievement objects, or an empty array if not found.
 */
export async function loadUserAchievements(userId: string): Promise<Achievement[]> {
  if (!userId) {
    console.warn("Cannot load achievements: userId is null or undefined.")
    return []
  }
  try {
    const achievementsRef = doc(db, ACHIEVEMENTS_COLLECTION, userId)
    const docSnap = await getDoc(achievementsRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      return (data?.achievements || []) as Achievement[]
    } else {
      console.log("No achievements found for user:", userId)
      return []
    }
  } catch (error) {
    console.error("Error loading achievements:", error)
    return []
  }
}

/**
 * Clears (deletes) a user's achievement data from Firestore.
 * @param userId The Firebase User ID.
 */
export async function clearUserAchievements(userId: string) {
  if (!userId) {
    console.warn("Cannot clear achievements: userId is null or undefined.")
    return
  }
  try {
    const achievementsRef = doc(db, ACHIEVEMENTS_COLLECTION, userId)
    await deleteDoc(achievementsRef)
    console.log("Achievements cleared for user:", userId)
  } catch (error) {
    console.error("Error clearing achievements:", error)
  }
}
