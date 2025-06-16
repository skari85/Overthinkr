import { loadAnalytics, saveAnalytics, clearAnalytics as clearAnalyticsFirestore } from "./firestore-utils"

export type ExportFormat = "text" | "json" | "markdown"

export interface AnalyticsEntry {
  timestamp: number // Unix timestamp
  classification: "overthinking" | "valid"
}

/**
 * Saves a new classification entry to Firestore for a given user.
 * @param userId The Firebase User ID.
 * @param classification The AI's classification: 'overthinking' or 'valid'.
 */
export async function saveClassification(userId: string, classification: "overthinking" | "valid") {
  if (!userId) {
    console.warn("Cannot save classification: userId is null or undefined.")
    return
  }
  const currentData = await getAnalyticsData(userId) // Load from Firestore
  const newEntry: AnalyticsEntry = {
    timestamp: Date.now(),
    classification,
  }
  currentData.push(newEntry)
  await saveAnalytics(userId, currentData) // Save to Firestore
}

/**
 * Retrieves all analytics data from Firestore for a given user.
 * @param userId The Firebase User ID.
 * @returns An array of AnalyticsEntry objects.
 */
export async function getAnalyticsData(userId: string): Promise<AnalyticsEntry[]> {
  if (!userId) {
    console.warn("Cannot get analytics data: userId is null or undefined.")
    return []
  }
  return await loadAnalytics(userId) // Load from Firestore
}

/**
 * Clears all analytics data from Firestore for a given user.
 * @param userId The Firebase User ID.
 */
export async function clearAnalyticsData(userId: string) {
  if (!userId) {
    console.warn("Cannot clear analytics data: userId is null or undefined.")
    return
  }
  await clearAnalyticsFirestore(userId) // Clear from Firestore
}

/**
 * Retrieves summarized analytics metrics for a given user.
 * @param userId The Firebase User ID.
 * @returns An object containing total conversations, overthinking count, and valid concern count.
 */
export async function getAnalyticsMetrics(userId: string) {
  const data = await getAnalyticsData(userId) // Load from Firestore
  const totalConversations = data.length
  const overthinkingCount = data.filter((entry) => entry.classification === "overthinking").length
  const validCount = data.filter((entry) => entry.classification === "valid").length

  return {
    totalConversations,
    overthinkingCount,
    validCount,
  }
}

/**
 * Aggregates analytics data by day for a given user.
 * @param userId The Firebase User ID.
 * @returns An array of objects, each representing a day with counts for overthinking and valid concerns.
 */
export async function getDailyAnalyticsTrends(userId: string) {
  const data = await getAnalyticsData(userId) // Load from Firestore
  const dailyTrends: { [key: string]: { date: string; overthinking: number; valid: number } } = {}

  data.forEach((entry) => {
    const date = new Date(entry.timestamp).toISOString().split("T")[0] // YYYY-MM-DD
    if (!dailyTrends[date]) {
      dailyTrends[date] = { date, overthinking: 0, valid: 0 }
    }
    if (entry.classification === "overthinking") {
      dailyTrends[date].overthinking++
    } else {
      dailyTrends[date].valid++
    }
  })

  // Sort by date
  return Object.values(dailyTrends).sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Determines the user's overthinking archetype based on their analytics metrics.
 * @param metrics The analytics metrics object.
 * @returns A string describing the user's overthinking archetype.
 */
export function getOverthinkingArchetype(metrics: {
  totalConversations: number
  overthinkingCount: number
  validCount: number
}): string {
  const { totalConversations, overthinkingCount, validCount } = metrics

  if (totalConversations < 5) {
    return "The 'Newbie Navigator' (Need more data!)"
  }

  const overthinkingRatio = overthinkingCount / totalConversations

  if (overthinkingRatio >= 0.7) {
    return "The 'What-If' Wizard (High overthinking, loves hypotheticals!)"
  } else if (overthinkingRatio >= 0.5) {
    return "The 'Replay' Reviewer (Often re-evaluating past events.)"
  } else if (overthinkingRatio >= 0.2) {
    return "The 'Future-Fretter' (Worries about what's next, but often valid.)"
  } else {
    return "The 'Clarity Champion' (You get to the point quickly!)"
  }
}
