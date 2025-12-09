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
  onConfirm: (reason: string) => void | Promise<void>
  projectName?: string
  projectId?: string | null
  projectIds?: string[]
}

export function RejectProjectDialog({
  open,
  onOpenChange,
  onConfirm,
  projectName,
  projectId,
  projectIds,
}: RejectProjectDialogProps) {
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isBulk = projectIds && projectIds.length > 0
  const count = isBulk ? projectIds.length : 1

  const handleConfirm = async () => {
    if (!reason.trim()) return
    
    setIsSubmitting(true)
    try {
      if (isBulk && projectIds) {
        // Bulk reject
        const res = await fetch("/api/admin/projects/bulk-reject", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectIds, reason }),
        })
        if (!res.ok) throw new Error("Failed to reject projects")
      } else if (projectId) {
        // Single reject
        const res = await fetch(`/api/admin/projects/${projectId}/reject`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason }),
        })
        if (!res.ok) throw new Error("Failed to reject project")
      }
      
      await onConfirm(reason)
      setReason("")
      onOpenChange(false)
    } catch (error) {
      console.error("Reject failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="h-6 w-6 text-destructive" />
            <AlertDialogTitle>
              Reject {isBulk ? `${count} Projects` : "Project"}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            {isBulk ? (
              <>
                You're about to reject {count} projects. The creators will be notified. Provide a reason so they can
                improve and resubmit.
              </>
            ) : (
              <>
                You're about to reject "{projectName}". The creator will be notified. Provide a reason so they can
                improve and resubmit.
              </>
            )}
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
          <AlertDialogCancel onClick={() => setReason("")} disabled={isSubmitting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!reason.trim() || isSubmitting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
          >
            {isSubmitting ? "Rejecting..." : isBulk ? `Reject ${count} Projects` : "Reject Project"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
