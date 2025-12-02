"use client"

import { useState, useCallback } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { createFundCampaignTransaction } from "@/lib/solana/transaction"
import { getExplorerTransactionUrl } from "@/lib/solana/network-utils"
import { parseBlockchainError, formatErrorForLogging } from "@/lib/solana/error-handling"
import { toast } from "sonner"

export type BackingStatus = 'idle' | 'creating' | 'signing' | 'confirming' | 'recording' | 'success' | 'error'

export interface BackProjectResult {
  success: boolean
  signature?: string
  explorerUrl?: string
  backing?: any
  error?: string
  errorType?: string
  recoverable?: boolean
}

export function useBackProject() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<BackingStatus>('idle')
  const { publicKey, signTransaction, connected } = useWallet()
  const { connection } = useConnection()

  const resetStatus = useCallback(() => {
    setStatus('idle')
    setIsSubmitting(false)
  }, [])

  const backProject = useCallback(async (
    projectId: string, 
    creatorWallet: string, 
    amount: number = 1
  ): Promise<BackProjectResult> => {
    // Pre-flight checks
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet first")
      return { success: false, error: "Wallet not connected", errorType: 'WALLET_NOT_CONNECTED', recoverable: true }
    }

    if (!signTransaction) {
      toast.error("Wallet does not support transaction signing")
      return { success: false, error: "Wallet cannot sign transactions", errorType: 'WALLET_NOT_CONNECTED', recoverable: true }
    }

    // Validate creator wallet
    let creatorPublicKey: PublicKey
    try {
      creatorPublicKey = new PublicKey(creatorWallet)
    } catch {
      toast.error("Invalid project configuration")
      return { success: false, error: "Invalid creator wallet address", recoverable: false }
    }

    setIsSubmitting(true)
    setStatus('creating')

    try {
      // Step 1: Create transaction
      toast.loading("Preparing transaction...", { id: "backing" })
      const transaction = await createFundCampaignTransaction(
        connection,
        publicKey,
        creatorPublicKey,
        amount
      )

      // Step 2: Simulate transaction
      setStatus('signing')
      toast.loading("Validating transaction...", { id: "backing" })
      
      try {
        const simulation = await connection.simulateTransaction(transaction)
        if (simulation.value.err) {
          const errorMsg = typeof simulation.value.err === 'string' 
            ? simulation.value.err 
            : JSON.stringify(simulation.value.err)
          throw new Error(`Transaction validation failed: ${errorMsg}`)
        }
      } catch (simError) {
        // Parse simulation error for user-friendly message
        const parsed = parseBlockchainError(simError)
        if (!parsed.recoverable) {
          throw simError
        }
        // Log but continue for recoverable errors
        console.warn('Simulation warning:', formatErrorForLogging(simError))
      }

      // Step 3: Sign transaction
      toast.loading("Please approve in your wallet...", { id: "backing" })
      const signedTx = await signTransaction(transaction)

      // Step 4: Send transaction
      setStatus('confirming')
      toast.loading("Sending to SOON Network...", { id: "backing" })
      
      const signature = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
        maxRetries: 3,
      })
      
      // Step 5: Confirm transaction
      toast.loading("Confirming on blockchain...", { id: "backing" })
      
      const confirmation = await connection.confirmTransaction(signature, 'confirmed')
      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`)
      }

      // Step 6: Record in database
      setStatus('recording')
      toast.loading("Recording your backing...", { id: "backing" })
      
      const response = await fetch(`/api/backing/${projectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: publicKey.toString(),
          transactionSignature: signature,
          amount
        })
      })

      const data = await response.json()

      if (!response.ok) {
        // Transaction succeeded but DB recording failed
        console.error('Failed to record backing in DB:', data.error)
        // Still return success since blockchain transaction went through
      }

      // Success!
      setStatus('success')
      const explorerUrl = getExplorerTransactionUrl(signature)
      
      toast.success("Successfully backed project! 🎉", { 
        id: "backing",
        description: "Your support has been recorded on the blockchain",
        duration: 5000,
        action: {
          label: "View TX",
          onClick: () => window.open(explorerUrl, '_blank')
        }
      })
      
      return { 
        success: true, 
        signature, 
        backing: data.backing, 
        explorerUrl 
      }

    } catch (error) {
      setStatus('error')
      
      // Parse error for user-friendly handling
      const parsed = parseBlockchainError(error)
      console.error('Back project error:', formatErrorForLogging(error))
      
      toast.error(parsed.userMessage, { 
        id: "backing",
        description: parsed.suggestion,
        duration: 6000
      })
      
      return { 
        success: false, 
        error: parsed.userMessage, 
        errorType: parsed.type,
        recoverable: parsed.recoverable
      }
    } finally {
      setIsSubmitting(false)
      // Reset status after a delay
      setTimeout(() => setStatus('idle'), 2000)
    }
  }, [connected, publicKey, signTransaction, connection])

  const checkBackingStatus = useCallback(async (
    projectId: string, 
    walletAddress: string
  ) => {
    try {
      const response = await fetch(
        `/api/backing/${projectId}?wallet=${walletAddress}`
      )
      
      if (!response.ok) return { hasBacked: false }
      
      const data = await response.json()
      return data

    } catch (error) {
      console.error('Failed to check backing status:', error)
      return { hasBacked: false }
    }
  }, [])

  return {
    backProject,
    checkBackingStatus,
    isSubmitting,
    status,
    resetStatus,
  }
}
