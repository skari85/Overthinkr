import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore"
import type { Message } from "ai"
import type { AnalyticsEntry } from "./analytics-utils"
import type { Achievement } from "./achievements-utils"

const CONVERSATIONS_COLLECTION = "conversations"
const ANALYTICS_COLLECTION = "analytics"
const ACHIEVEMENTS_COLLECTION = "achievements"

// Add connection retry logic
const MAX_RETRIES = 3
const RETRY_DELAY = 1000

async function withRetry<T>(operation: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (retries > 0 && isRetryableError(error)) {
      console.log(`Retrying operation, ${retries} attempts left...`)
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
      return withRetry(operation, retries - 1)
    }
    throw error
  }
}

function isRetryableError(error: any): boolean {
  const retryableCodes = ["unavailable", "deadline-exceeded", "resource-exhausted"]
  return retryableCodes.includes(error?.code)
}

/**
 * Saves a user's conversation to Firestore with retry logic.
 */
export async function saveConversation(userId: string, messages: Message[]) {
  if (!userId) {
    console.warn("Cannot save conversation: userId is null or undefined.")
    return
  }

  return withRetry(async () => {
    const conversationRef = doc(db, CONVERSATIONS_COLLECTION, userId)
    await setDoc(conversationRef, { messages, updatedAt: new Date() }, { merge: false })
    console.log("Conversation saved for user:", userId)
  })
}

/**
 * Loads a user's conversation from Firestore with retry logic.
 */
export async function loadConversation(userId: string): Promise<Message[]> {
  if (!userId) {
    console.warn("Cannot load conversation: userId is null or undefined.")
    return []
  }

  return withRetry(async () => {
    const conversationRef = doc(db, CONVERSATIONS_COLLECTION, userId)
    const docSnap = await getDoc(conversationRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      return (data?.messages || []) as Message[]
    } else {
      console.log("No conversation found for user:", userId)
      return []
    }
  })
}

/**
 * Clears a user's conversation from Firestore with retry logic.
 */
export async function clearConversation(userId: string) {
  if (!userId) {
    console.warn("Cannot clear conversation: userId is null or undefined.")
    return
  }

  return withRetry(async () => {
    const conversationRef = doc(db, CONVERSATIONS_COLLECTION, userId)
    await deleteDoc(conversationRef)
    console.log("Conversation cleared for user:", userId)
  })
}

/**
 * Saves analytics data with retry logic and batching.
 */
export async function saveAnalytics(userId: string, analyticsData: AnalyticsEntry[]) {
  if (!userId) {
    console.warn("Cannot save analytics: userId is null or undefined.")
    return
  }

  return withRetry(async () => {
    const analyticsRef = doc(db, ANALYTICS_COLLECTION, userId)
    await setDoc(
      analyticsRef,
      {
        entries: analyticsData,
        updatedAt: new Date(),
        count: analyticsData.length,
      },
      { merge: false },
    )
    console.log("Analytics saved for user:", userId)
  })
}

/**
 * Loads analytics data with retry logic.
 */
export async function loadAnalytics(userId: string): Promise<AnalyticsEntry[]> {
  if (!userId) {
    console.warn("Cannot load analytics: userId is null or undefined.")
    return []
  }

  return withRetry(async () => {
    const analyticsRef = doc(db, ANALYTICS_COLLECTION, userId)
    const docSnap = await getDoc(analyticsRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      return (data?.entries || []) as AnalyticsEntry[]
    } else {
      console.log("No analytics found for user:", userId)
      return []
    }
  })
}

/**
 * Clears analytics data with retry logic.
 */
export async function clearAnalytics(userId: string) {
  if (!userId) {
    console.warn("Cannot clear analytics: userId is null or undefined.")
    return
  }

  return withRetry(async () => {
    const analyticsRef = doc(db, ANALYTICS_COLLECTION, userId)
    await deleteDoc(analyticsRef)
    console.log("Analytics cleared for user:", userId)
  })
}

/**
 * Saves achievements with retry logic.
 */
export async function saveUserAchievements(userId: string, achievements: Achievement[]) {
  if (!userId) {
    console.warn("Cannot save achievements: userId is null or undefined.")
    return
  }

  return withRetry(async () => {
    const achievementsRef = doc(db, ACHIEVEMENTS_COLLECTION, userId)
    await setDoc(
      achievementsRef,
      {
        achievements,
        updatedAt: new Date(),
        count: achievements.length,
      },
      { merge: false },
    )
    console.log("Achievements saved for user:", userId)
  })
}

/**
 * Loads achievements with retry logic.
 */
export async function loadUserAchievements(userId: string): Promise<Achievement[]> {
  if (!userId) {
    console.warn("Cannot load achievements: userId is null or undefined.")
    return []
  }

  return withRetry(async () => {
    const achievementsRef = doc(db, ACHIEVEMENTS_COLLECTION, userId)
    const docSnap = await getDoc(achievementsRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      return (data?.achievements || []) as Achievement[]
    } else {
      console.log("No achievements found for user:", userId)
      return []
    }
  })
}

/**
 * Clears achievements with retry logic.
 */
export async function clearUserAchievements(userId: string) {
  if (!userId) {
    console.warn("Cannot clear achievements: userId is null or undefined.")
    return
  }

  return withRetry(async () => {
    const achievementsRef = doc(db, ACHIEVEMENTS_COLLECTION, userId)
    await deleteDoc(achievementsRef)
    console.log("Achievements cleared for user:", userId)
  })
}
