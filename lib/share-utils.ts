import type { Message } from "ai"

/**
 * Encodes an array of messages into a URL-safe string.
 * Uses JSON.stringify + Base64 encoding to handle special characters and structure.
 * @param messages The array of messages to encode.
 * @returns A Base64 encoded string.
 */
export function encodeSharedMessages(messages: Message[]): string {
  try {
    const jsonString = JSON.stringify(messages)
    return btoa(encodeURIComponent(jsonString)) // Base64 encode after URI encoding
  } catch (error) {
    console.error("Failed to encode messages:", error)
    return ""
  }
}

/**
 * Decodes a URL-safe string back into an array of messages.
 * @param encodedString The Base64 encoded string.
 * @returns An array of Message objects, or null if decoding fails.
 */
export function decodeSharedMessages(encodedString: string): Message[] | null {
  try {
    const jsonString = decodeURIComponent(atob(encodedString)) // Base64 decode before URI decoding
    const messages = JSON.parse(jsonString)
    // Basic validation to ensure it's an array of objects with 'id', 'role', 'content'
    if (
      Array.isArray(messages) &&
      messages.every((m) => typeof m.id === "string" && typeof m.role === "string" && typeof m.content === "string")
    ) {
      return messages
    }
    return null
  } catch (error) {
    console.error("Failed to decode messages:", error)
    return null
  }
}

/**
 * Generates a shareable URL for specific messages.
 * @param messages The messages to include in the shareable link.
 * @returns The full shareable URL.
 */
export function generateShareLink(messages: Message[]): string {
  const encoded = encodeSharedMessages(messages)
  if (!encoded) return ""

  // In a real deployment, you'd use your actual domain.
  // For local development, this will use localhost.
  // For Vercel deployments, VERCEL_URL environment variable can be used on the server.
  // For client-side, window.location.origin is appropriate.
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://overthinkr.vercel.app" // Fallback for SSR

  return `${baseUrl}/chat?shared=${encoded}`
}
