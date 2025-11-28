"use client"

import { useState } from "react"
import { toast } from "sonner"

export interface UploadOptions {
  bucket?: string
  folder?: string
  maxSize?: number // in bytes
  allowedTypes?: string[]
}

export function useFileUpload(options: UploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const uploadFile = async (file: File): Promise<{ url: string; path: string } | null> => {
    const {
      bucket = 'project-images',
      folder = 'uploads',
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    } = options

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only images are allowed.')
      return null
    }

    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024)
      toast.error(`File too large. Maximum size is ${maxSizeMB}MB`)
      return null
    }

    setIsUploading(true)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', bucket)
      formData.append('folder', folder)

      // Simulate progress (since we don't have real upload progress)
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()
      toast.success('File uploaded successfully!')
      
      return {
        url: data.url,
        path: data.path
      }

    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Failed to upload file')
      return null
    } finally {
      setIsUploading(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  const deleteFile = async (path: string, bucket: string = 'project-images'): Promise<boolean> => {
    try {
      const response = await fetch(`/api/upload?path=${encodeURIComponent(path)}&bucket=${bucket}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Delete failed')
      }

      toast.success('File deleted successfully')
      return true

    } catch (error: any) {
      console.error('Delete error:', error)
      toast.error(error.message || 'Failed to delete file')
      return false
    }
  }

  return {
    uploadFile,
    deleteFile,
    isUploading,
    progress
  }
}
