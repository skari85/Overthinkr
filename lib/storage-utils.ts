import { storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"

export interface UploadResult {
  url: string
  path: string
  name: string
  size: number
  type: string
}

/**
 * Uploads a file to Firebase Storage
 * @param file The file to upload
 * @param userId The user's ID for organizing files
 * @param folder Optional folder name (default: 'uploads')
 * @returns Promise with upload result
 */
export async function uploadFile(file: File, userId: string, folder = "uploads"): Promise<UploadResult> {
  if (!file) {
    throw new Error("No file provided")
  }

  if (!userId) {
    throw new Error("User ID is required")
  }

  // Create a unique filename
  const timestamp = Date.now()
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
  const fileName = `${timestamp}_${sanitizedFileName}`
  const filePath = `${folder}/${userId}/${fileName}`

  try {
    // Create a reference to the file location
    const storageRef = ref(storage, filePath)

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file)

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref)

    return {
      url: downloadURL,
      path: filePath,
      name: file.name,
      size: file.size,
      type: file.type,
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Deletes a file from Firebase Storage
 * @param filePath The path to the file in storage
 */
export async function deleteFile(filePath: string): Promise<void> {
  if (!filePath) {
    throw new Error("File path is required")
  }

  try {
    const storageRef = ref(storage, filePath)
    await deleteObject(storageRef)
  } catch (error) {
    console.error("Error deleting file:", error)
    throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Validates file type and size
 * @param file The file to validate
 * @param allowedTypes Array of allowed MIME types
 * @param maxSizeInMB Maximum file size in MB
 */
export function validateFile(
  file: File,
  allowedTypes: string[] = ["image/*", "text/*", "application/pdf"],
  maxSizeInMB = 10,
): { isValid: boolean; error?: string } {
  // Check file size
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024
  if (file.size > maxSizeInBytes) {
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeInMB}MB`,
    }
  }

  // Check file type
  const isAllowedType = allowedTypes.some((allowedType) => {
    if (allowedType.endsWith("/*")) {
      const baseType = allowedType.replace("/*", "")
      return file.type.startsWith(baseType)
    }
    return file.type === allowedType
  })

  if (!isAllowedType) {
    return {
      isValid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`,
    }
  }

  return { isValid: true }
}
