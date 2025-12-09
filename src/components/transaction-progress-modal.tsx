"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Loader2, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface TransactionProgressModalProps {
  open: boolean
  step: 'approving' | 'confirming' | 'recording' | 'success' | 'error'
  signature?: string
  explorerUrl?: string
  error?: string
  onClose?: () => void
}

export function TransactionProgressModal({
  open,
  step,
  signature,
  explorerUrl,
  error,
  onClose
}: TransactionProgressModalProps) {
  const stepIndex = ['approving', 'confirming', 'recording', 'success'].indexOf(step)
  const progress = stepIndex >= 0 ? ((stepIndex + 1) / 4) * 100 : 0

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      // Allow closing only on success/error steps
      if (!isOpen && (step === 'success' || step === 'error') && onClose) {
        onClose()
      }
    }}>
      <DialogContent className="sm:max-w-md" showCloseButton={step === 'success' || step === 'error'}>
        <DialogHeader className="flex flex-col items-center text-center gap-4">
          {step === 'error' ? (
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
          ) : step === 'success' ? (
            <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
          ) : (
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
          )}
          
          <DialogTitle className="text-xl font-bold">
            {step === 'approving' && 'Approve Transaction'}
            {step === 'confirming' && 'Confirming on Blockchain'}
            {step === 'recording' && 'Recording Backing'}
            {step === 'success' && 'Success!'}
            {step === 'error' && 'Transaction Error'}
          </DialogTitle>
          
          <DialogDescription className="text-center text-sm">
            {step === 'approving' && 'Approve the transaction in your wallet to continue'}
            {step === 'confirming' && 'Confirming on blockchain... This usually takes a few seconds.'}
            {step === 'recording' && 'Recording your backing... Almost done.'}
            {step === 'success' && (
              <span className="text-green-400">Backing successful! You can close this modal anytime.</span>
            )}
            {step === 'error' && (
              <div className="space-y-2">
                <p className="text-destructive font-medium">
                  {error || 'That didn\'t work. Try again.'}
                </p>
                <p className="text-xs text-muted-foreground">
                  If this keeps happening, your transaction may have succeeded on the blockchain but failed to record. Check the explorer link below.
                </p>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        
        {step !== 'error' && step !== 'success' && (
          <div className="py-4">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Step {stepIndex + 1} of 4</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        )}
        
        {signature && explorerUrl && (step === 'confirming' || step === 'recording' || step === 'success' || step === 'error') && (
          <div className="space-y-2">
            <div className="bg-muted/50 p-3 rounded-lg text-xs font-mono break-all text-center">
              TX: {signature.slice(0, 8)}...{signature.slice(-8)}
            </div>
            <Button 
              variant="outline" 
              className="w-full gap-2 hover:bg-accent/10 hover:text-accent hover:border-accent/50 transition-all" 
              size="sm"
              onClick={() => window.open(explorerUrl, '_blank')}
            >
              View on Explorer <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 'error' && !signature && (
          <div className="bg-destructive/10 border border-destructive/30 p-4 rounded-lg">
            <p className="text-sm text-destructive-foreground text-center">
              Transaction failed before reaching the blockchain. No funds were transferred.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
