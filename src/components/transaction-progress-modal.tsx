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
}

export function TransactionProgressModal({
  open,
  step,
  signature,
  explorerUrl,
  error
}: TransactionProgressModalProps) {
  const stepIndex = ['approving', 'confirming', 'recording', 'success'].indexOf(step)
  const progress = stepIndex >= 0 ? ((stepIndex + 1) / 4) * 100 : 0

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" hideClose={step !== 'success' && step !== 'error'}>
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
            {step === 'approving' && 'Please approve the transaction in your wallet'}
            {step === 'confirming' && 'Waiting for blockchain confirmation...'}
            {step === 'recording' && 'Saving your backing to the database...'}
            {step === 'success' && 'Your backing has been recorded successfully!'}
            {step === 'error' && (error || 'Something went wrong. Please try again.')}
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
        
        {signature && explorerUrl && (step === 'confirming' || step === 'recording' || step === 'success') && (
          <div className="space-y-2">
            <div className="bg-muted/50 p-3 rounded-lg text-xs font-mono break-all text-center">
              TX: {signature.slice(0, 8)}...{signature.slice(-8)}
            </div>
            <Button 
              variant="outline" 
              className="w-full gap-2" 
              size="sm"
              onClick={() => window.open(explorerUrl, '_blank')}
            >
              View on Explorer <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {step === 'success' && (
          <div className="text-xs text-center text-muted-foreground">
            The page will update automatically
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
