"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign } from "lucide-react"

interface QuickBackModalProps {
  isOpen: boolean
  onClose: () => void
  projectTitle: string
}

export function QuickBackModal({ isOpen, onClose, projectTitle }: QuickBackModalProps) {
  const [amount, setAmount] = useState("1")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleBack = async () => {
    setIsProcessing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsProcessing(false)
    onClose()
    // Show success toast would go here
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Back This Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Project</p>
            <p className="font-semibold">{projectTitle}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {[1, 5, 10, 25].map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(preset.toString())}
                  className="flex-1"
                >
                  ${preset}
                </Button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
            <p className="text-sm">
              <span className="font-semibold">You'll receive:</span> Backer NFT badge, project updates, and voting
              rights on milestones
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent" disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleBack} className="flex-1 bg-accent hover:bg-accent/90" disabled={isProcessing}>
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                `Back with $${amount}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
