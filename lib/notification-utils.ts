import { toast } from "@/components/ui/use-toast"

export interface Reminder {
  id: string
  messageContent: string
  timestamp: number // When the reminder should trigger
  originalMessageId: string // ID of the message it's attached to
  setAt: number // When the reminder was set
  timeoutId?: ReturnType<typeof setTimeout> // Store timeout ID for clearing
}

export interface DailyPromptSettings {
  enabled: boolean
  time: string // "HH:MM" format
  lastTriggered?: number // Timestamp of last successful daily prompt
}

const REMINDERS_STORAGE_KEY = "overthinkr-reminders"
const DAILY_PROMPT_STORAGE_KEY = "overthinkr-daily-prompt-settings"

/**
 * Requests notification permission from the user.
 * @returns Promise<NotificationPermission>
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    toast({
      title: "Notifications Not Supported",
      description: "Your browser does not support desktop notifications.",
      variant: "destructive",
    })
    return "denied"
  }

  if (Notification.permission === "granted") {
    return "granted"
  } else if (Notification.permission === "denied") {
    return "denied"
  } else {
    const permission = await Notification.requestPermission()
    return permission
  }
}

/**
 * Shows a browser notification.
 * @param title The title of the notification.
 * @param body The body text of the notification.
 */
export function showNotification(title: string, body: string) {
  if (typeof window === "undefined" || Notification.permission !== "granted") {
    return // Cannot show notification if not in browser or permission not granted
  }
  new Notification(title, {
    body: body,
    icon: "/overthinkr-logo.png", // Path to your app icon
    tag: "overthinkr-notification", // Group notifications
    renotify: true, // Allow re-showing if tag is same
  })
}

/**
 * Schedules a single reminder notification.
 * This relies on the browser tab being open. For persistent reminders, a Service Worker is needed.
 * @param reminder The reminder object to schedule.
 */
export function scheduleReminder(reminder: Reminder) {
  const now = Date.now()
  const delay = reminder.timestamp - now

  if (delay <= 0) {
    console.warn("Reminder time is in the past or immediate. Triggering now.")
    showNotification("Overthinkr Reminder", reminder.messageContent)
    removeReminder(reminder.id) // Remove after showing
    return
  }

  const timeoutId = setTimeout(() => {
    showNotification("Overthinkr Reminder", reminder.messageContent)
    removeReminder(reminder.id) // Remove after showing
  }, delay)

  // Store timeout ID to clear if needed (e.g., if user clears reminder)
  const storedReminders = getReminders()
  const updatedReminders = storedReminders.map((r) => (r.id === reminder.id ? { ...r, timeoutId: timeoutId } : r))
  localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(updatedReminders))
}

/**
 * Saves a reminder to local storage.
 * @param reminder The reminder object to save.
 */
export function saveReminder(reminder: Reminder) {
  const reminders = getReminders()
  reminders.push(reminder)
  localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders))
  scheduleReminder(reminder) // Schedule immediately after saving
}

/**
 * Retrieves all reminders from local storage.
 * @returns An array of Reminder objects.
 */
export function getReminders(): Reminder[] {
  if (typeof window === "undefined") return [] // Ensure this runs only in the browser

  const data = localStorage.getItem(REMINDERS_STORAGE_KEY)
  try {
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Failed to parse reminders from local storage:", error)
    localStorage.removeItem(REMINDERS_STORAGE_KEY) // Clear corrupted data
    return []
  }
}

/**
 * Removes a reminder from local storage and clears its scheduled timeout.
 * @param id The ID of the reminder to remove.
 */
export function removeReminder(id: string) {
  const reminders = getReminders()
  const reminderToRemove = reminders.find((r) => r.id === id)
  if (reminderToRemove && reminderToRemove.timeoutId) {
    clearTimeout(reminderToRemove.timeoutId)
  }
  const updatedReminders = reminders.filter((r) => r.id !== id)
  localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(updatedReminders))
}

/**
 * Clears all reminders from local storage and any scheduled timeouts.
 */
export function clearAllReminders() {
  const reminders = getReminders()
  reminders.forEach((r) => {
    if (r.timeoutId) clearTimeout(r.timeoutId)
  })
  localStorage.removeItem(REMINDERS_STORAGE_KEY)
}

/**
 * Retrieves daily prompt settings from local storage.
 * @returns DailyPromptSettings object.
 */
export function getDailyPromptSettings(): DailyPromptSettings {
  if (typeof window === "undefined") return { enabled: false, time: "09:00" } // Ensure this runs only in the browser

  const data = localStorage.getItem(DAILY_PROMPT_STORAGE_KEY)
  try {
    return data ? JSON.parse(data) : { enabled: false, time: "09:00" }
  } catch (error) {
    console.error("Failed to parse daily prompt settings:", error)
    localStorage.removeItem(DAILY_PROMPT_STORAGE_KEY) // Clear corrupted data
    return { enabled: false, time: "09:00" }
  }
}

/**
 * Saves daily prompt settings to local storage.
 * @param settings DailyPromptSettings object to save.
 */
export function saveDailyPromptSettings(settings: DailyPromptSettings) {
  if (typeof window === "undefined") return // Ensure this runs only in the browser
  localStorage.setItem(DAILY_PROMPT_STORAGE_KEY, JSON.stringify(settings))
}

// Daily prompt logic (simplified for client-side, requires tab open)
const dailyPromptTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

export function startDailyPromptScheduler(settings: DailyPromptSettings) {
  if (typeof window === "undefined") return // Ensure this runs only in the browser

  // Clear any existing scheduler
  dailyPromptTimeouts.forEach((timeoutId) => clearTimeout(timeoutId))
  dailyPromptTimeouts.clear()

  if (!settings.enabled) return

  const scheduleNextPrompt = () => {
    const now = new Date()
    const [hour, minute] = settings.time.split(":").map(Number)

    const nextPrompt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0)

    // If the scheduled time for today has passed, schedule for tomorrow
    if (now.getTime() > nextPrompt.getTime()) {
      nextPrompt.setDate(nextPrompt.getDate() + 1)
    }

    const delay = nextPrompt.getTime() - now.getTime()

    console.log(`Scheduling next daily prompt for ${nextPrompt.toLocaleString()} (in ${delay / 1000} seconds)`)

    const timeoutId = setTimeout(() => {
      const currentSettings = getDailyPromptSettings()
      // Only show if enabled and not triggered recently (e.g., within the last 5 minutes to avoid rapid re-triggers)
      if (
        currentSettings.enabled &&
        (!currentSettings.lastTriggered || Date.now() - currentSettings.lastTriggered > 5 * 60 * 1000)
      ) {
        const prompts = [
          "What's one thing you're overthinking today?",
          "Is there a concern you can take action on today?",
          "Reflect on a past 'overthinking' moment. What did you learn?",
          "What's one small step you can take to clarify a current worry?",
          "Are you focusing on what you can control or what you can't?",
        ]
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)]
        showNotification("Overthinkr Daily Prompt", randomPrompt)
        saveDailyPromptSettings({ ...currentSettings, lastTriggered: Date.now() })
      }
      // Reschedule for the next day
      startDailyPromptScheduler(getDailyPromptSettings())
    }, delay)

    dailyPromptTimeouts.set("daily-prompt", timeoutId)
  }

  scheduleNextPrompt()
}

export function stopDailyPromptScheduler() {
  if (typeof window === "undefined") return // Ensure this runs only in the browser
  dailyPromptTimeouts.forEach((timeoutId) => clearTimeout(timeoutId))
  dailyPromptTimeouts.clear()
}

// Call this function on app load to schedule any pending reminders
export function initializeReminders() {
  const reminders = getReminders()
  const now = Date.now()
  reminders.forEach((reminder) => {
    if (reminder.timestamp > now) {
      scheduleReminder(reminder) // Use the correct function name here
    } else {
      // Clean up old reminders that were missed or are in the past
      removeReminder(reminder.id) // Use removeReminder to also clear timeout
    }
  })
}
