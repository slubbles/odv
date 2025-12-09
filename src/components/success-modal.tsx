"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ExternalLink, Wallet } from "lucide-react"
import Link from "next/link"
import { ConfettiCelebration } from "@/components/confetti-celebration"

interface SuccessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  txSignature?: string
  explorerUrl?: string
  actionLabel?: string
  onAction?: () => void
}

export function SuccessModal({
  open,
  onOpenChange,
  title,
  description,
  txSignature,
  explorerUrl,
  actionLabel = "View in Wallet",
  onAction
}: SuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <ConfettiCelebration trigger={open} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center gap-4">
          <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-center text-base">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          {txSignature && (
            <div className="bg-muted/50 p-3 rounded-lg text-xs font-mono break-all text-center">
              TX: {txSignature}
            </div>
          )}
          
          {explorerUrl && (
            <Button variant="outline" className="w-full gap-2" onClick={() => window.open(explorerUrl, '_blank')}>
              View on Explorer <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button className="w-full sm:w-auto flex-1" onClick={() => {
            onOpenChange(false)
            if (onAction) onAction()
          }}>
            {actionLabel}
          </Button>
          <Button variant="ghost" className="w-full sm:w-auto" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
