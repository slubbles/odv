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
      console.log('[useBackProject] Verifying transaction...', data.signature.slice(0, 8))
      const response = await fetch('/api/verify-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('[useBackProject] Verification failed:', errorData)
        throw new Error(errorData.error || errorData.message || 'Verification failed')
      }
      
      const result = await response.json()
      console.log('[useBackProject] Verification successful:', result)
      return result
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000) // Exponential backoff: 1s, 2s, 4s
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
    console.log('[useBackProject] Step 1: Creating transaction...')

    try {
      // Step 1: Create transaction
      const transaction = await createFundCampaignTransaction(
        connection,
        publicKey,
        creatorPublicKey,
        amount
      )
      console.log('[useBackProject] Transaction created successfully')

      // Step 2: Simulate transaction
      console.log('[useBackProject] Step 2: Simulating transaction...')
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
        console.warn('[useBackProject] Simulation warning (continuing):', formatErrorForLogging(simError))
      }

      // Step 3: Sign and send transaction (SOON-compatible approach)
      console.log('[useBackProject] Step 3: Waiting for wallet signature...')
      // Status stays 'signing' until user approves in wallet
      
      // Use sendTransaction which handles signing + broadcasting to SOON RPC
      const signature = await sendTransaction(transaction, connection, {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
        maxRetries: 3,
      })
      console.log('[useBackProject] Transaction signed! Signature:', signature.slice(0, 8) + '...')
      
      // Step 4: Confirm transaction on blockchain
      console.log('[useBackProject] Step 4: Confirming on blockchain...')
      setStatus('confirming')
      const confirmation = await connection.confirmTransaction(signature, 'confirmed')
      if (confirmation.value.err) {
        throw new Error(`Transaction failed on blockchain: ${JSON.stringify(confirmation.value.err)}`)
      }
      console.log('[useBackProject] ✅ Blockchain confirmation successful!')

      // Step 5: Record in database (ONLY after blockchain success)
      console.log('[useBackProject] Step 5: Recording in database...')
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
        console.log('[useBackProject] ✅ Database recording successful!')
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
      console.error('[useBackProject] ❌ Error at status:', status, formatErrorForLogging(error))
      
      // Provide context about where the error occurred
      let contextualError = parsed.userMessage
      if (status === 'creating') {
        contextualError = 'Failed to create transaction. Check your wallet connection.'
      } else if (status === 'signing') {
        contextualError = parsed.userMessage.includes('User rejected') 
          ? 'Transaction cancelled by user' 
          : 'Failed to sign transaction. ' + parsed.userMessage
      }
      
      return { 
        success: false, 
        error: contextualError, 
        errorType: parsed.type,
        recoverable: parsed.recoverable
      }
    } finally {
      setIsSubmitting(false)
      // Don't auto-reset status - let component control lifecycle
      // setTimeout(() => setStatus('idle'), 2000) // REMOVED to prevent modal loop
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
