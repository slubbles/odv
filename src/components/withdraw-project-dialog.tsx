"use client"

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
import { AlertTriangle } from "lucide-react"

interface WithdrawProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  backerCount: number
  fundedAmount: number
}

export function WithdrawProjectDialog({
  open,
  onOpenChange,
  onConfirm,
  backerCount,
  fundedAmount,
}: WithdrawProjectDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            <AlertDialogTitle>Withdraw Project</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            You have {backerCount} backers who believed in you and ${fundedAmount} in funding. Are you sure you want to
            withdraw? All funds will be refunded to backers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Going</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-amber-500 text-white hover:bg-amber-600">
            Withdraw Project
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
