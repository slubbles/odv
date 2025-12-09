"use client"

import { useState, useCallback } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { useMutation } from "@tanstack/react-query"
import { createFundCampaignTransaction } from "@/lib/solana/transaction"
import { getExplorerTransactionUrl } from "@/lib/solana/network-utils"
import { parseBlockchainError, formatErrorForLogging } from "@/lib/solana/error-handling"

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
  const { publicKey, sendTransaction, connected } = useWallet()
  const { connection } = useConnection()

  const verifyMutation = useMutation({
    mutationFn: async (data: { signature: string, projectId: string, amount: number, backerWallet: string }) => {
      const response = await fetch('/api/verify-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Verification failed')
      }
      return response.json()
    },
    retry: 2,
    retryDelay: 1000
  })

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
      return { success: false, error: "Wallet not connected", errorType: 'WALLET_NOT_CONNECTED', recoverable: true }
    }

    if (!sendTransaction) {
      return { success: false, error: "Wallet cannot send transactions", errorType: 'WALLET_NOT_CONNECTED', recoverable: true }
    }

    // Validate creator wallet
    let creatorPublicKey: PublicKey
    try {
      creatorPublicKey = new PublicKey(creatorWallet)
    } catch {
      return { success: false, error: "Invalid creator wallet address", recoverable: false }
    }

    setIsSubmitting(true)
    setStatus('creating')

    try {
      // Step 1: Create transaction
      const transaction = await createFundCampaignTransaction(
        connection,
        publicKey,
        creatorPublicKey,
        amount
      )

      // Step 2: Simulate transaction
      setStatus('signing')
      
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

      // Step 3: Sign and send transaction (SOON-compatible approach)
      setStatus('confirming')
      
      // Use sendTransaction which handles signing + broadcasting to SOON RPC
      const signature = await sendTransaction(transaction, connection, {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
        maxRetries: 3,
      })
      
      // Step 5: Confirm transaction
      const confirmation = await connection.confirmTransaction(signature, 'confirmed')
      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`)
      }

      // Step 6: Record in database
      setStatus('recording')
      
      let backingData = null;

      try {
        // Use the new secure verification API
        await verifyMutation.mutateAsync({
          signature,
          projectId,
          amount,
          backerWallet: publicKey.toString()
        })
        // If successful, we don't strictly need the backing object for the UI right now
      } catch (dbError: any) {
        console.error('Verification/Recording error:', dbError)
        
        // If verification fails, try fallback to old endpoint
        // This ensures we don't lose successful blockchain transactions
        try {
          const fallbackResponse = await fetch(`/api/backing/${projectId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              walletAddress: publicKey.toString(),
              transactionSignature: signature,
              amount
            })
          })
          if (fallbackResponse.ok) {
            const data = await fallbackResponse.json()
            backingData = data.backing
          }
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError)
          // Still show success since blockchain tx succeeded
        }
      }

      // Success!
      setStatus('success')
      const explorerUrl = getExplorerTransactionUrl(signature)
      
      // Success modal will be shown by the component
      
      return { 
        success: true, 
        signature, 
        backing: backingData, 
        explorerUrl 
      }

    } catch (error) {
      setStatus('error')
      
      // Parse error for user-friendly handling
      const parsed = parseBlockchainError(error)
      console.error('Back project error:', formatErrorForLogging(error))
      
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
  }, [connected, publicKey, sendTransaction, connection])

  const checkBackingStatus = useCallback(async (
    projectId: string, 
    walletAddress: string
  ) => {
    try {
      const response = await fetch(
        `/api/backing/${projectId}?wallet=${walletAddress}`,
        { cache: 'no-store' }
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
