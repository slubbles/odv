"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Button } from "@/components/ui/button"
import { Loader2, Heart, CheckCircle2, Clock, XCircle } from "lucide-react"
import { useBackProject } from "@/lib/hooks/use-back-project"
import { TransactionProgressModal } from "@/components/transaction-progress-modal"
import { useToast } from "@/components/ui/use-toast"

interface BackProjectButtonProps {
  projectId: string
  creatorWallet: string
  projectStatus?: string
  amount?: number
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
  onSuccess?: () => void
}

export function BackProjectButton({
  projectId,
  creatorWallet,
  projectStatus = "active",
  amount = 1,
  variant = "default",
  size = "default",
  className,
  onSuccess
}: BackProjectButtonProps) {
  const { publicKey, connected } = useWallet()
  const { backProject, checkBackingStatus, isSubmitting, status } = useBackProject()
  const { toast } = useToast()
  const [hasBacked, setHasBacked] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [isModalLocked, setIsModalLocked] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showProgressModal, setShowProgressModal] = useState(false)
  const [txSignature, setTxSignature] = useState<string>("")
  const [explorerUrl, setExplorerUrl] = useState<string>("")
  const [txError, setTxError] = useState<string>("")

  // Check if project can be backed
  const canBeBacked = projectStatus === "active"
  const isInQueue = projectStatus === "queue" || projectStatus === "pending"
  const isEnded = projectStatus === "completed" || projectStatus === "funded" || projectStatus === "withdrawn"

  useEffect(() => {
    let mounted = true

    if (connected && publicKey && canBeBacked) {
      const timer = setTimeout(() => {
        if (mounted) setIsChecking(true)
      }, 0)
      
      checkBackingStatus(projectId, publicKey.toString())
        .then(result => {
          if (mounted) setHasBacked(result.hasBacked)
        })
        .finally(() => {
          if (mounted) setIsChecking(false)
        })
        
      return () => clearTimeout(timer)
    }

    return () => {
      mounted = false
    }
  }, [connected, publicKey, projectId, canBeBacked])

  const handleBack = async () => {
    if (!canBeBacked) {
      // Don't show toast - just prevent action
      return
    }

    // Prevent duplicate submissions if modal is locked
    if (isModalLocked || showProgressModal) {
      console.log('[BackProjectButton] Transaction already in progress, ignoring click')
      return
    }

    console.log('[BackProjectButton] Starting backing flow...')
    setIsModalLocked(true)
    setShowProgressModal(true)
    setTxError("")
    setTxSignature("")
    setExplorerUrl("")
    
    const result = await backProject(projectId, creatorWallet, amount)
    
    if (result.success) {
      console.log('[BackProjectButton] Transaction successful!', result.signature?.slice(0, 8))
      if (result.signature) {
        setTxSignature(result.signature)
      }
      if (result.explorerUrl) {
        setExplorerUrl(result.explorerUrl)
      }
      // Modal stays on success step - user closes it manually
      // Modal lock will be released on close
    } else {
      console.error('[BackProjectButton] Transaction failed:', result.error)
      // Set detailed error message
      let errorMessage = result.error || "That didn't work. Try again."
      
      // Add context based on error type
      if (result.errorType === 'WALLET_NOT_CONNECTED') {
        errorMessage = 'Wallet connection lost. Reconnect and try again.'
      } else if (result.errorType === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Not enough funds in your wallet. Add more and try again.'
      } else if (errorMessage.includes('Failed to record')) {
        errorMessage = 'Transaction succeeded on blockchain but failed to record. Check explorer to verify, then refresh the page.'
        
        // Show critical error toast for recording failures
        toast({
          variant: "destructive",
          title: "Recording Error",
          description: "Your transaction succeeded but we couldn't record it. Check the blockchain explorer and refresh the page.",
          duration: 10000, // 10 seconds for critical errors
        })
      }
      
      setTxError(errorMessage)
      // Error modal stays open until user closes it
      
      // If blockchain succeeded but recording failed, auto-refresh after 10s
      if (result.signature && errorMessage.includes('Failed to record')) {
        console.log('[BackProjectButton] Setting up auto-refresh fallback for recording failure')
        setTimeout(() => {
          console.log('[BackProjectButton] Auto-refreshing page due to recording failure')
          window.location.reload()
        }, 10000) // 10 seconds
      }
    }
  }

  // Project in queue - show waiting status
  if (isInQueue) {
    return (
      <Button
        variant="outline"
        size={size}
        className={className}
        disabled
      >
        <Clock className="mr-2 h-4 w-4 text-yellow-500" />
        In Review Queue
      </Button>
    )
  }

  // Project ended
  if (isEnded) {
    return (
      <Button
        variant="outline"
        size={size}
        className={className}
        disabled
      >
        <XCircle className="mr-2 h-4 w-4" />
        Campaign Ended
      </Button>
    )
  }

  if (!connected) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        disabled
      >
        <Heart className="mr-2 h-4 w-4" />
        Connect Wallet to Fund
      </Button>
    )
  }

  if (isChecking) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        disabled
      >
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Checking...
      </Button>
    )
  }

  if (hasBacked) {
    return (
      <Button
        variant="outline"
        size={size}
        className={className}
        disabled
      >
        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
        Already Funded
      </Button>
    )
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleBack}
        disabled={isSubmitting || !connected}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Heart className="mr-2 h-4 w-4 fill-current" />
            Back this Project
          </>
        )}
      </Button>

      <TransactionProgressModal
        open={showProgressModal}
        step={status === 'error' ? 'error' : status === 'success' ? 'success' : status === 'signing' ? 'approving' : status === 'confirming' ? 'confirming' : status === 'recording' ? 'recording' : 'approving'}
        signature={txSignature}
        explorerUrl={explorerUrl}
        error={txError}
        onClose={() => {
          console.log('[BackProjectButton] Modal closing, status:', status)
          setShowProgressModal(false)
          setIsModalLocked(false) // Release the lock
          
          // When modal closes, update button state and refetch project data
          if (status === 'success' && txSignature) {
            console.log('[BackProjectButton] Success modal closed, updating UI state')
            setHasBacked(true)
            
            // Trigger parent component refetch (updates project stats)
            console.log('[BackProjectButton] Triggering parent refetch')
            onSuccess?.()
            
            // Double-check backing status from database to ensure accuracy
            if (publicKey) {
              setTimeout(() => {
                checkBackingStatus(projectId, publicKey.toString()).then(result => {
                  console.log('[BackProjectButton] Backing status verified:', result.hasBacked)
                  setHasBacked(result.hasBacked)
                  if (!result.hasBacked) {
                    console.warn('[BackProjectButton] Backing not found in DB, may need manual refresh')
                  }
                }).catch(err => {
                  console.error('[BackProjectButton] Failed to verify backing status:', err)
                  // Keep hasBacked=true since we know transaction succeeded
                })
              }, 1000) // Wait 1s for DB to sync
            }
          } else if (status === 'error') {
            console.log('[BackProjectButton] Error modal closed, resetting state')
            // On error close, reset states for retry
            setTxError('')
            setTxSignature('')
            setExplorerUrl('')
          }
        }}
      />
    </>
  )
}
