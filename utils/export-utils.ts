import type { Message } from "ai"
import html2canvas from "html2canvas" // Assuming html2canvas is available

export type ExportFormat = "text" | "json" | "markdown" | "image" // Added 'image'

export function formatConversation(messages: Message[], format: ExportFormat): string {
  if (format === "json") {
    return JSON.stringify(messages, null, 2)
  } else if (format === "markdown") {
    return messages
      .map((m) => {
        const role = m.role === "user" ? "You" : "Overthinkr"
        return `**${role}**:\n${m.content}\n`
      })
      .join("\n")
  } else {
    // Plain text format
    return messages
      .map((m) => {
        const role = m.role === "user" ? "You" : "Overthinkr"
        return `${role}:\n${m.content}\n`
      })
      .join("\n")
  }
}

export function downloadConversation(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function copyToClipboard(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!navigator.clipboard) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = text
      textArea.style.position = "fixed"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        const successful = document.execCommand("copy")
        document.body.removeChild(textArea)
        resolve(successful)
      } catch (err) {
        document.body.removeChild(textArea)
        resolve(false)
      }
    } else {
      navigator.clipboard.writeText(text).then(
        () => resolve(true),
        () => resolve(false),
      )
    }
  })
}

/**
 * Generates an image from a given HTML element and triggers a download.
 * @param element The HTML element to capture.
 * @param filename The desired filename for the downloaded image.
 */
export async function downloadImage(element: HTMLElement, filename: string) {
  try {
    const canvas = await html2canvas(element, {
      useCORS: true, // Important for images loaded from different origins (like placeholder.svg)
      backgroundColor: null, // Keep background transparent if not explicitly set
    })
    const image = canvas.toDataURL("image/png")
    const link = document.createElement("a")
    link.href = image
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error("Error generating image:", error)
    throw new Error("Failed to generate image.")
  }
}
