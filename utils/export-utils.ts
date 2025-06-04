import type { Message } from "ai"

export type ExportFormat = "text" | "json" | "markdown"

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
