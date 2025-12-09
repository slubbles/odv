"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Button } from "@/components/ui/button"
import { Loader2, Heart, CheckCircle2, Clock, XCircle } from "lucide-react"
import { useBackProject } from "@/lib/hooks/use-back-project"
import { toast } from "sonner"
import { SuccessModal } from "@/components/success-modal"
import { TransactionProgressModal } from "@/components/transaction-progress-modal"

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
  const [hasBacked, setHasBacked] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
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
      if (isInQueue) {
        toast.error("This project is still in review and cannot be backed yet")
      } else if (isEnded) {
        toast.error("This campaign has ended")
      } else {
        toast.error("This project cannot be backed")
      }
      return
    }

    setShowProgressModal(true)
    setTxError("")
    
    const result = await backProject(projectId, creatorWallet, amount)
    
    if (result.success) {
      if (result.signature) {
        setTxSignature(result.signature)
      }
      if (result.explorerUrl) {
        setExplorerUrl(result.explorerUrl)
      }
      // Progress modal stays open on success step - user closes it manually
      // No auto-close, no auto-redirect
    } else {
      setTxError(result.error || "Transaction failed")
      // Error modal also stays open until user closes it
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
          setShowProgressModal(false)
          // When modal closes, update button state and refetch project data
          if (status === 'success' && txSignature) {
            setHasBacked(true)
            onSuccess?.()
            // Verify backing status from database
            if (publicKey) {
              checkBackingStatus(projectId, publicKey.toString()).then(result => {
                setHasBacked(result.hasBacked)
              })
            }
          }
        }}
      />
    </>
  )
}
