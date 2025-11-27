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
import { XCircle } from "lucide-react"
import { FormTextarea } from "@/components/form-textarea"

interface RejectProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (reason: string) => void
  projectName: string
}

export function RejectProjectDialog({ open, onOpenChange, onConfirm, projectName }: RejectProjectDialogProps) {
  const [reason, setReason] = useState("")

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="h-6 w-6 text-destructive" />
            <AlertDialogTitle>Reject Project</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            You're about to reject "{projectName}". The creator will be notified. Provide a reason so they can improve
            and resubmit.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <FormTextarea
            id="reject-reason"
            label="Rejection reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Be specific. Help them do better."
            rows={4}
            required
            helperText="This will be sent to the creator."
            showCount
            maxLength={500}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setReason("")}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm(reason)
              setReason("")
            }}
            disabled={!reason.trim()}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
          >
            Reject Project
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
