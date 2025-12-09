"use client"

import type React from "react"

import { Label } from "@/components/ui/label"
import { AlertCircle, Upload, X, FileIcon, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useFileUpload } from "@/lib/hooks/use-file-upload"
import { Progress } from "@/components/ui/progress"

interface FormFileUploadProps {
  label: string
  id: string
  accept?: string
  error?: string
  helperText?: string
  required?: boolean
  maxSize?: number
  multiple?: boolean
  onUploadComplete?: (url: string, path: string) => void
  folder?: string
}

export function FormFileUpload({
  label,
  id,
  accept,
  error,
  helperText,
  required,
  maxSize = 10,
  multiple = false,
  onUploadComplete,
  folder = 'uploads'
}: FormFileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [uploadedUrls, setUploadedUrls] = useState<Array<{ url: string; path: string; file: File }>>([])
  const { uploadFile, isUploading, progress } = useFileUpload({ folder, maxSize: maxSize * 1024 * 1024 })

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files)
      setFiles(fileList)
      
      // Auto-upload first file
      if (fileList.length > 0 && onUploadComplete) {
        const result = await uploadFile(fileList[0])
        if (result) {
          setUploadedUrls([{ ...result, file: fileList[0] }])
          onUploadComplete(result.url, result.path)
        }
      }
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
    setUploadedUrls(uploadedUrls.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={cn(error && "text-destructive")}>
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </Label>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          dragActive && "border-accent bg-accent/5",
          error && "border-destructive",
          !error && !dragActive && "border-border hover:border-accent/50",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        />
        <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm font-medium mb-1">
          Drag and drop or{" "}
          <label htmlFor={id} className="text-accent hover:underline cursor-pointer">
            browse files
          </label>
        </p>
        <p className="text-xs text-muted-foreground">
          {accept ? `Accepted: ${accept}` : "Any file type"}
          {" · "}
          Max {maxSize}MB
        </p>
      </div>

      {isUploading && (
        <div className="space-y-2 p-3 border rounded-lg bg-muted/30">
          <p className="text-sm font-medium">Uploading...</p>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => {
            const uploaded = uploadedUrls.find(u => u.file === file)
            return (
              <div key={index} className={cn(
                "flex items-center gap-3 p-3 border rounded-lg",
                uploaded && "border-green-500/50 bg-green-500/5"
              )}>
                {uploaded ? (
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : (
                  <FileIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                    {uploaded && <span className="text-green-500 ml-2">✓ Uploaded</span>}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="flex-shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )
          })}
        </div>
      )}

      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${id}-helper`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  )
}
