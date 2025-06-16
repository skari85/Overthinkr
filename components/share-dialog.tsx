"use client"

import { useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  formatConversation,
  copyToClipboard,
  downloadConversation,
  downloadImage,
  type ExportFormat,
} from "@/utils/export-utils"
import { Check, Copy, Download, Share2, X, ImageIcon } from "lucide-react" // Import ImageIcon
import type { Message } from "ai"
import { toast } from "@/components/ui/use-toast"
import { ShareableImageContent } from "./shareable-image-content" // Import the new component

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  messages: Message[]
}

export function ShareDialog({ open, onOpenChange, messages }: ShareDialogProps) {
  const [activeTab, setActiveTab] = useState<ExportFormat>("text")
  const [copied, setCopied] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const imageContentRef = useRef<HTMLDivElement>(null) // Ref for the content to be screenshotted

  const formattedContent = formatConversation(messages, activeTab)

  const handleCopy = async () => {
    const success = await copyToClipboard(formattedContent)
    if (success) {
      setCopied(true)
      toast({
        title: "Copied to clipboard",
        description: "The conversation has been copied to your clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } else {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDownloadText = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const filename = `overthinkr-conversation-${timestamp}`
    const extension = activeTab === "json" ? "json" : activeTab === "markdown" ? "md" : "txt"
    const mimeType =
      activeTab === "json" ? "application/json" : activeTab === "markdown" ? "text/markdown" : "text/plain"

    downloadConversation(formattedContent, `${filename}.${extension}`, mimeType)

    toast({
      title: "Download started",
      description: `Your conversation is being downloaded as ${filename}.${extension}`,
    })
  }

  const handleDownloadImage = async () => {
    if (!imageContentRef.current) {
      toast({
        title: "Error",
        description: "Could not find content to generate image.",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingImage(true)
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      const filename = `overthinkr-conversation-${timestamp}.png`
      await downloadImage(imageContentRef.current, filename)
      toast({
        title: "Image Downloaded!",
        description: "Your conversation image has been downloaded.",
      })
    } catch (error) {
      toast({
        title: "Image Generation Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingImage(false)
    }
  }

  if (messages.length === 0) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Conversation
          </DialogTitle>
          <DialogDescription>
            Export your conversation in different formats or copy to share with others.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ExportFormat)} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            {" "}
            {/* Increased grid columns for new tab */}
            <TabsTrigger value="text">Plain Text</TabsTrigger>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger> {/* New Image tab */}
          </TabsList>

          <TabsContent value="text" className="mt-0">
            <Textarea value={formattedContent} readOnly className="min-h-[200px] font-mono text-sm" />
          </TabsContent>
          <TabsContent value="markdown" className="mt-0">
            <Textarea value={formattedContent} readOnly className="min-h-[200px] font-mono text-sm" />
          </TabsContent>
          <TabsContent value="json" className="mt-0">
            <Textarea value={formattedContent} readOnly className="min-h-[200px] font-mono text-sm" />
          </TabsContent>

          {/* New Image Tab Content */}
          <TabsContent value="image" className="mt-0">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div
                ref={imageContentRef}
                className="p-4 bg-background rounded-lg shadow-inner overflow-auto max-h-[300px] w-full"
              >
                <ShareableImageContent messages={messages} />
              </div>
              <Button
                onClick={handleDownloadImage}
                disabled={isGeneratingImage}
                className="w-full bg-overthinkr-600 hover:bg-overthinkr-700"
              >
                {isGeneratingImage ? "Generating..." : "Download Image"}
                {isGeneratingImage ? null : <ImageIcon className="h-4 w-4 ml-2" />}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                This will generate a PNG image of your conversation snippet.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
          {activeTab !== "image" && ( // Only show copy/download for text/markdown/json
            <div className="flex gap-2">
              <Button onClick={handleCopy} variant="secondary">
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button onClick={handleDownloadText} className="bg-overthinkr-600 hover:bg-overthinkr-700">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
