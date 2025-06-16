import {
  loadUserAchievements,
  saveUserAchievements,
  clearUserAchievements as clearAchievementsFirestore,
} from "./firestore-utils" // Import Firestore utils
import { getAnalyticsMetrics } from "./analytics-utils" // Still need analytics metrics

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

// Removed LOCAL_STORAGE_KEY

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
 * Retrieves all achievements from Firestore for a given user, merging with default achievements.
 * @param userId The Firebase User ID.
 * @returns An array of Achievement objects.
 */
export async function getAchievements(userId: string): Promise<Achievement[]> {
  if (!userId) {
    console.warn("Cannot get achievements: userId is null or undefined.")
    return defaultAchievements // Return defaults if no user
  }

  const savedAchievements = await loadUserAchievements(userId) // Load from Firestore

  // Merge saved achievements with default ones to ensure new achievements are added
  const mergedAchievements = defaultAchievements.map((defaultAch) => {
    const savedAch = savedAchievements.find((s) => s.id === defaultAch.id)
    return savedAch ? { ...defaultAch, ...savedAch } : defaultAch
  })

  return mergedAchievements
}

/**
 * Saves the current state of achievements to Firestore for a given user.
 * @param userId The Firebase User ID.
 * @param achievements The array of Achievement objects to save.
 */
export async function saveAchievements(userId: string, achievements: Achievement[]) {
  if (!userId) {
    console.warn("Cannot save achievements: userId is null or undefined.")
    return
  }
  await saveUserAchievements(userId, achievements) // Save to Firestore
}

/**
 * Checks if any achievements have been unlocked based on current analytics metrics for a given user.
 * @param userId The Firebase User ID.
 * @returns An array of newly unlocked Achievement objects.
 */
export async function checkAndUnlockAchievements(userId: string): Promise<Achievement[]> {
  if (!userId) {
    console.warn("Cannot check achievements: userId is null or undefined.")
    return []
  }

  const currentAchievements = await getAchievements(userId) // Load from Firestore
  const metrics = await getAnalyticsMetrics(userId) // Load analytics from Firestore
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
    await saveAchievements(userId, updatedAchievements) // Save to Firestore
  }

  return newlyUnlocked
}

/**
 * Clears all achievement data from Firestore for a given user.
 * @param userId The Firebase User ID.
 */
export async function clearAchievements(userId: string) {
  if (!userId) {
    console.warn("Cannot clear achievements: userId is null or undefined.")
    return
  }
  await clearAchievementsFirestore(userId) // Clear from Firestore
}
