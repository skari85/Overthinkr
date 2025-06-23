"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X, File, ImageIcon, FileText } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { uploadFile, validateFile, type UploadResult } from "@/lib/storage-utils"
import { useAuth } from "@/contexts/auth-context"

interface FileUploadProps {
  onUploadComplete?: (result: UploadResult) => void
  onUploadStart?: () => void
  allowedTypes?: string[]
  maxSizeInMB?: number
  folder?: string
  disabled?: boolean
}

export function FileUpload({
  onUploadComplete,
  onUploadStart,
  allowedTypes = ["image/*", "text/*", "application/pdf"],
  maxSizeInMB = 10,
  folder = "uploads",
  disabled = false,
}: FileUploadProps) {
  const { user } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validation = validateFile(file, allowedTypes, maxSizeInMB)
    if (!validation.isValid) {
      toast({
        title: "Invalid File",
        description: validation.error,
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile || !user?.uid) {
      toast({
        title: "Upload Error",
        description: "Please select a file and ensure you're logged in.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    onUploadStart?.()

    try {
      const result = await uploadFile(selectedFile, user.uid, folder)

      toast({
        title: "Upload Successful",
        description: `${selectedFile.name} has been uploaded successfully.`,
      })

      onUploadComplete?.(result)
      setSelectedFile(null)

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload file.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const clearSelection = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4" />
    } else if (file.type === "application/pdf") {
      return <FileText className="h-4 w-4" />
    } else {
      return <File className="h-4 w-4" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (!user) {
    return (
      <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <Upload className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Please log in to upload files</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Upload className="h-5 w-5" />
          File Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file-upload">Choose File</Label>
          <Input
            id="file-upload"
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            disabled={disabled || isUploading}
            accept={allowedTypes.join(",")}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Max size: {maxSizeInMB}MB. Allowed types: {allowedTypes.join(", ")}
          </p>
        </div>

        {selectedFile && (
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              {getFileIcon(selectedFile)}
              <div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={clearSelection} disabled={isUploading}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleUpload} disabled={!selectedFile || isUploading || disabled} className="flex-1">
            {isUploading ? "Uploading..." : "Upload File"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
