import { getAnalyticsMetrics } from "./analytics-utils"

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string // Lucide icon name (e.g., "Sparkles", "MessageSquare")
  thresholdType: "conversations" | "overthinking" | "valid"
  thresholdValue: number
  unlocked: boolean
  unlockedAt?: number
}

const LOCAL_STORAGE_KEY = "overthinkr-achievements"

// Define all possible achievements
const defaultAchievements: Achievement[] = [
  {
    id: "first-insight",
    name: "First Insight",
    description: "Complete your first conversation with Overthinkr.",
    icon: "Sparkles",
    thresholdType: "conversations",
    thresholdValue: 1,
    unlocked: false,
  },
  {
    id: "chat-enthusiast",
    name: "Chat Enthusiast",
    description: "Engage in 10 conversations.",
    icon: "MessageSquare",
    thresholdType: "conversations",
    thresholdValue: 10,
    unlocked: false,
  },
  {
    id: "overthinker-apprentice",
    name: "Overthinker Apprentice",
    description: "Receive 5 'Yep, you're overthinking' classifications.",
    icon: "Brain",
    thresholdType: "overthinking",
    thresholdValue: 5,
    unlocked: false,
  },
  {
    id: "valid-visionary",
    name: "Valid Visionary",
    description: "Receive 5 'Nah, this might be valid' classifications.",
    icon: "CheckCircle",
    thresholdType: "valid",
    thresholdValue: 5,
    unlocked: false,
  },
  {
    id: "conversation-master",
    name: "Conversation Master",
    description: "Complete 50 conversations with Overthinkr.",
    icon: "Award",
    thresholdType: "conversations",
    thresholdValue: 50,
    unlocked: false,
  },
  {
    id: "self-aware-pro",
    name: "Self-Aware Pro",
    description: "Receive 20 'Yep, you're overthinking' classifications.",
    icon: "Lightbulb",
    thresholdType: "overthinking",
    thresholdValue: 20,
    unlocked: false,
  },
  {
    id: "action-taker",
    name: "Action Taker",
    description: "Receive 20 'Nah, this might be valid' classifications.",
    icon: "Rocket",
    thresholdType: "valid",
    thresholdValue: 20,
    unlocked: false,
  },
]

/**
 * Retrieves all achievements from local storage, merging with default achievements.
 * @returns An array of Achievement objects.
 */
export function getAchievements(): Achievement[] {
  if (typeof window === "undefined") return defaultAchievements // Ensure this runs only in the browser

  const data = localStorage.getItem(LOCAL_STORAGE_KEY)
  let savedAchievements: Achievement[] = []
  try {
    savedAchievements = data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Failed to parse achievements data from local storage:", error)
    localStorage.removeItem(LOCAL_STORAGE_KEY) // Clear corrupted data
  }

  // Merge saved achievements with default ones to ensure new achievements are added
  const mergedAchievements = defaultAchievements.map((defaultAch) => {
    const savedAch = savedAchievements.find((s) => s.id === defaultAch.id)
    return savedAch ? { ...defaultAch, ...savedAch } : defaultAch
  })

  return mergedAchievements
}

/**
 * Saves the current state of achievements to local storage.
 * @param achievements The array of Achievement objects to save.
 */
export function saveAchievements(achievements: Achievement[]) {
  if (typeof window === "undefined") return // Ensure this runs only in the browser
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(achievements))
}

/**
 * Checks if any achievements have been unlocked based on current analytics metrics.
 * @returns An array of newly unlocked Achievement objects.
 */
export function checkAndUnlockAchievements(): Achievement[] {
  const currentAchievements = getAchievements()
  const metrics = getAnalyticsMetrics()
  const newlyUnlocked: Achievement[] = []

  const updatedAchievements = currentAchievements.map((ach) => {
    if (ach.unlocked) return ach // Already unlocked

    let meetsThreshold = false
    if (ach.thresholdType === "conversations" && metrics.totalConversations >= ach.thresholdValue) {
      meetsThreshold = true
    } else if (ach.thresholdType === "overthinking" && metrics.overthinkingCount >= ach.thresholdValue) {
      meetsThreshold = true
    } else if (ach.thresholdType === "valid" && metrics.validCount >= ach.thresholdValue) {
      meetsThreshold = true
    }

    if (meetsThreshold) {
      newlyUnlocked.push({ ...ach, unlocked: true, unlockedAt: Date.now() })
      return { ...ach, unlocked: true, unlockedAt: Date.now() }
    }
    return ach
  })

  if (newlyUnlocked.length > 0) {
    saveAchievements(updatedAchievements)
  }

  return newlyUnlocked
}

/**
 * Clears all achievement data from local storage.
 */
export function clearAchievements() {
  if (typeof window === "undefined") return // Ensure this runs only in the browser
  localStorage.removeItem(LOCAL_STORAGE_KEY)
}
