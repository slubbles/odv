"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormCheckboxProps {
  label: string
  id: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  error?: string
  helperText?: string
  required?: boolean
}

export function FormCheckbox({ label, id, checked, onCheckedChange, error, helperText, required }: FormCheckboxProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          className={cn(error && "border-destructive data-[state=checked]:border-destructive")}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        />
        <div className="space-y-1 leading-none">
          <Label htmlFor={id} className={cn("cursor-pointer", error && "text-destructive")}>
            {label}
            {required && <span className="text-accent ml-1">*</span>}
          </Label>
          {helperText && !error && (
            <p id={`${id}-helper`} className="text-sm text-muted-foreground">
              {helperText}
            </p>
          )}
        </div>
      </div>
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  )
}
