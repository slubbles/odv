"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Button } from "@/components/ui/button"
import { Loader2, Heart, CheckCircle2 } from "lucide-react"
import { useBackProject } from "@/lib/hooks/use-back-project"

interface BackProjectButtonProps {
  projectId: string
  creatorWallet: string
  amount?: number
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
  onSuccess?: () => void
}

export function BackProjectButton({
  projectId,
  creatorWallet,
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

  useEffect(() => {
    if (connected && publicKey) {
      setIsChecking(true)
      checkBackingStatus(projectId, publicKey.toString())
        .then(result => setHasBacked(result.hasBacked))
        .finally(() => setIsChecking(false))
    }
  }, [connected, publicKey, projectId])

  const handleBack = async () => {
    const result = await backProject(projectId, creatorWallet, amount)
    
    if (result.success) {
      setHasBacked(true)
      onSuccess?.()
    }
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
