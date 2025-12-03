"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Button } from "@/components/ui/button"
import { Loader2, Heart, CheckCircle2, Clock, XCircle } from "lucide-react"
import { useBackProject } from "@/lib/hooks/use-back-project"
import { toast } from "sonner"

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
  const { backProject, checkBackingStatus, isSubmitting } = useBackProject()
  const [hasBacked, setHasBacked] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  // Check if project can be backed
  const canBeBacked = projectStatus === "active"
  const isInQueue = projectStatus === "queue" || projectStatus === "pending"
  const isEnded = projectStatus === "completed" || projectStatus === "funded" || projectStatus === "withdrawn"

  useEffect(() => {
    if (connected && publicKey && canBeBacked) {
      setIsChecking(true)
      checkBackingStatus(projectId, publicKey.toString())
        .then(result => setHasBacked(result.hasBacked))
        .finally(() => setIsChecking(false))
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

    const result = await backProject(projectId, creatorWallet, amount)
    
    if (result.success) {
      setHasBacked(true)
      onSuccess?.()
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
        Connect Wallet to Back
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
        Already Backed
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleBack}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Heart className="mr-2 h-4 w-4" />
          Back for ${amount}
        </>
      )}
    </Button>
  )
}
