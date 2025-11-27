"use client"

import type React from "react"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  success?: boolean
  helperText?: string
  showCount?: boolean
}

export function FormTextarea({
  label,
  error,
  success,
  helperText,
  showCount,
  className,
  maxLength,
  value,
  ...props
}: FormTextareaProps) {
  const currentLength = typeof value === "string" ? value.length : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={props.id} className={cn(error && "text-destructive")}>
          {label}
          {props.required && <span className="text-accent ml-1">*</span>}
        </Label>
        {showCount && maxLength && (
          <span className="text-xs text-muted-foreground">
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
      <div className="relative">
        <Textarea
          {...props}
          value={value}
          maxLength={maxLength}
          className={cn(
            className,
            error && "border-destructive focus-visible:ring-destructive",
            success && "border-green-500 focus-visible:ring-green-500",
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
        />
        {error && <AlertCircle className="absolute right-3 top-3 h-5 w-5 text-destructive" />}
        {success && !error && <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-green-500" />}
      </div>
      {error && (
        <p id={`${props.id}-error`} className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${props.id}-helper`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  )
}
