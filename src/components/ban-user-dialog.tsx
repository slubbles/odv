"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ShieldOff } from "lucide-react"
import { FormTextarea } from "@/components/form-textarea"
import { FormSelect } from "@/components/form-select"

interface BanUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (reason: string, duration: string) => void
  username: string
}

export function BanUserDialog({ open, onOpenChange, onConfirm, username }: BanUserDialogProps) {
  const [reason, setReason] = useState("")
  const [duration, setDuration] = useState("permanent")

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <ShieldOff className="h-6 w-6 text-destructive" />
            <AlertDialogTitle>Ban User</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            You're about to ban @{username}. They'll lose access to the platform. Use this power wisely.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-4">
          <FormSelect
            id="ban-duration"
            label="Duration"
            value={duration}
            onValueChange={setDuration}
            required
            options={[
              { value: "7days", label: "7 days" },
              { value: "30days", label: "30 days" },
              { value: "90days", label: "90 days" },
              { value: "permanent", label: "Permanent" },
            ]}
          />
          <FormTextarea
            id="ban-reason"
            label="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="What did they do?"
            rows={4}
            required
            helperText="This will be shown to the user and logged."
            showCount
            maxLength={500}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setReason("")
              setDuration("permanent")
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm(reason, duration)
              setReason("")
              setDuration("permanent")
            }}
            disabled={!reason.trim()}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
          >
            Ban User
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
