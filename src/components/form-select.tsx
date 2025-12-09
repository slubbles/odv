"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormSelectProps {
  label: string
  id: string
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  error?: string
  success?: boolean
  helperText?: string
  required?: boolean
  options: { value: string; label: string }[]
}

export function FormSelect({
  label,
  id,
  value,
  onValueChange,
  placeholder,
  error,
  success,
  helperText,
  required,
  options,
}: FormSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={cn(error && "text-destructive")}>
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </Label>
      <div className="relative">
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger
            id={id}
            className={cn(
              error && "border-destructive focus-visible:ring-destructive",
              success && "border-green-500 focus-visible:ring-green-500",
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && (
          <AlertCircle className="absolute right-10 top-1/2 -translate-y-1/2 h-5 w-5 text-destructive pointer-events-none" />
        )}
        {success && !error && (
          <CheckCircle2 className="absolute right-10 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500 pointer-events-none" />
        )}
      </div>
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
