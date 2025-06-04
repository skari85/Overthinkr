export type ExportFormat = "text" | "json" | "markdown"

export interface AnalyticsEntry {
  timestamp: number // Unix timestamp
  classification: "overthinking" | "valid"
}

const LOCAL_STORAGE_KEY = "overthinkr-analytics"

/**
 * Saves a new classification entry to local storage.
 * @param classification The AI's classification: 'overthinking' or 'valid'.
 */
export function saveClassification(classification: "overthinking" | "valid") {
  if (typeof window === "undefined") return // Ensure this runs only in the browser

  const currentData = getAnalyticsData()
  const newEntry: AnalyticsEntry = {
    timestamp: Date.now(),
    classification,
  }
  currentData.push(newEntry)
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentData))
}

/**
 * Retrieves all analytics data from local storage.
 * @returns An array of AnalyticsEntry objects.
 */
export function getAnalyticsData(): AnalyticsEntry[] {
  if (typeof window === "undefined") return [] // Ensure this runs only in the browser

  const data = localStorage.getItem(LOCAL_STORAGE_KEY)
  try {
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Failed to parse analytics data from local storage:", error)
    return []
  }
}

/**
 * Clears all analytics data from local storage.
 */
export function clearAnalyticsData() {
  if (typeof window === "undefined") return // Ensure this runs only in the browser
  localStorage.removeItem(LOCAL_STORAGE_KEY)
}

/**
 * Retrieves summarized analytics metrics.
 * @returns An object containing total conversations, overthinking count, and valid concern count.
 */
export function getAnalyticsMetrics() {
  const data = getAnalyticsData()
  const totalConversations = data.length
  const overthinkingCount = data.filter((entry) => entry.classification === "overthinking").length
  const validCount = data.filter((entry) => entry.classification === "valid").length

  return {
    totalConversations,
    overthinkingCount,
    validCount,
  }
}
