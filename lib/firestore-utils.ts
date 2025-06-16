import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore"
import type { Message } from "ai"

const CONVERSATIONS_COLLECTION = "conversations" // Top-level collection for all conversations

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
