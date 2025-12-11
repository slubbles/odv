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
    campaignId: number,
    amount: number = 1
  ): Promise<BackProjectResult> => {
    console.log('[useBackProject] ⚡ STARTING BACK PROJECT', {
      projectId,
      creatorWallet: creatorWallet.slice(0, 8) + '...',
      campaignId,
      amount,
      campaignIdType: typeof campaignId
    });

    // Pre-flight checks
    if (!connected || !publicKey) {
      return { success: false, error: "Wallet not connected", errorType: 'WALLET_NOT_CONNECTED', recoverable: true }
    }

    if (!sendTransaction) {
      return { success: false, error: "Wallet cannot send transactions", errorType: 'WALLET_NOT_CONNECTED', recoverable: true }
    }

    // Validate campaign ID
    if (campaignId === null || campaignId === undefined || campaignId < 0) {
      console.error('[useBackProject] ❌ INVALID CAMPAIGN ID:', campaignId);
      return { 
        success: false, 
        error: "Campaign not initialized on blockchain. Please contact the creator.", 
        errorType: 'INVALID_CAMPAIGN_ID',
        recoverable: false 
      }
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
    console.log('[useBackProject] Step 1: Requesting gas-sponsored transaction...')

    try {
      // NEW: Use relay endpoint for gas sponsorship
      console.log('[useBackProject] 🚀 Using gas sponsorship relay')
      
      // Step 1: Request unsigned transaction from relay
      const relayResponse = await fetch('/api/relay/back-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          creatorWallet,
          campaignId,
          backerWallet: publicKey.toString(),
          amount
        })
      })

      if (!relayResponse.ok) {
        const errorData = await relayResponse.json().catch(() => ({ error: 'Unknown error' }))
        
        console.error('[useBackProject] ❌ Relay endpoint failed:', relayResponse.status, errorData)
        
        // If relay fails due to service unavailable or rate limit, fall back to direct method
        if (relayResponse.status === 503 || relayResponse.status === 429) {
          console.warn('[useBackProject] ⚠️ Relay unavailable, falling back to direct method')
          return await backProjectDirect(projectId, creatorWallet, campaignId, amount)
        }
        
        // For other errors (400, etc), throw to show user the specific error
        throw new Error(errorData.error || 'Failed to create gas-sponsored transaction')
      }

      const relayData = await relayResponse.json()
      console.log('[useBackProject] ✅ Relay transaction created')
      console.log('[useBackProject] Rate limit remaining:', relayData.rateLimit?.remaining)

      // Step 2: Deserialize transaction
      const { Transaction: TransactionClass } = await import('@solana/web3.js')
      const transaction = TransactionClass.from(
        Buffer.from(relayData.transaction, 'base64')
      )
      console.log('[useBackProject] Transaction deserialized')

      // Step 3: Sign transaction with user's wallet
      console.log('[useBackProject] Step 2: Waiting for wallet signature...')
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

      // Step 4: User signs transaction (wallet popup)
      if (!publicKey.equals(transaction.feePayer!)) {
        console.log('[useBackProject] 🎉 Gas will be sponsored by platform!')
      }
      
      // Use wallet adapter's signTransaction method
      const wallet = (window as any).solana || (window as any).okxwallet?.solana
      if (!wallet?.signTransaction) {
        throw new Error('Wallet does not support transaction signing')
      }
      
      const signedTx = await wallet.signTransaction(transaction)
      if (!signedTx) {
        throw new Error('Failed to sign transaction')
      }
      console.log('[useBackProject] ✅ Transaction signed by user')
      
      // Step 5: Submit to relay for final signature + submission
      console.log('[useBackProject] Step 3: Submitting to relay...')
      setStatus('confirming')
      
      const submitResponse = await fetch('/api/relay/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signedTransaction: signedTx.serialize().toString('base64')
        })
      })

      if (!submitResponse.ok) {
        const errorData = await submitResponse.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || 'Failed to submit transaction')
      }

      const submitData = await submitResponse.json()
      const signature = submitData.signature
      
      console.log('[useBackProject] ✅ Transaction submitted! Signature:', signature.slice(0, 8))
      console.log('[useBackProject] 💰 Gas cost: $' + submitData.gasCostUSD?.toFixed(4), '(sponsored by platform)')
      console.log('[useBackProject] 🔋 Relayer balance:', submitData.relayerBalance, 'SOL')

      // Step 5: Record in database (ONLY after blockchain success)
      console.log('[useBackProject] Step 5: Recording in database...')
      setStatus('recording')
      
      let backingData = null;

      try {
        // Use the new secure verification API
        console.log('[useBackProject] 🔵 CALLING /api/verify-transaction', {
          signature: signature.slice(0, 10) + '...',
          projectId,
          amount,
          backerWallet: publicKey.toString().slice(0, 10) + '...'
        })
        
        const result = await verifyMutation.mutateAsync({
          signature,
          projectId,
          amount,
          backerWallet: publicKey.toString()
        })
        console.log('[useBackProject] ✅ Database recording successful!', result)
        // If successful, we don't strictly need the backing object for the UI right now
      } catch (dbError: any) {
        console.error('[useBackProject] ❌ DATABASE RECORDING FAILED:', {
          name: dbError.name,
          message: dbError.message,
          cause: dbError.cause
        })
        
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
          console.error('[useBackProject] ❌ Fallback also failed:', fallbackError)
          // Still show success since blockchain tx succeeded
        }
        
        console.warn('[useBackProject] ⚠️ WARNING: Blockchain transaction succeeded but database recording failed!')
        console.warn('[useBackProject] ⚠️ Transaction signature:', signature)
        console.warn('[useBackProject] ⚠️ You may need to manually record this backing in the database')
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

  // Fallback: Direct transaction (user pays gas) - for when relay is unavailable
  const backProjectDirect = useCallback(async (
    projectId: string,
    creatorWallet: string,
    campaignId: number,
    amount: number = 1
  ): Promise<BackProjectResult> => {
    console.log('[useBackProject] 🔄 FALLBACK: Using direct method (user pays gas)')
    
    if (!connected || !publicKey || !sendTransaction) {
      return { success: false, error: "Wallet not connected", errorType: 'WALLET_NOT_CONNECTED', recoverable: true }
    }

    let creatorPublicKey: PublicKey
    try {
      creatorPublicKey = new PublicKey(creatorWallet)
    } catch {
      return { success: false, error: "Invalid creator wallet address", recoverable: false }
    }

    try {
      // Create transaction (user as fee payer)
      const transaction = await createFundCampaignTransaction(
        connection,
        publicKey,
        creatorPublicKey,
        campaignId,
        amount
      )
      
      // Sign and send
      const signature = await sendTransaction(transaction, connection, {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
        maxRetries: 3,
      })
      
      // Confirm
      const confirmation = await connection.confirmTransaction(signature, 'confirmed')
      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`)
      }
      
      // Record in database
      await verifyMutation.mutateAsync({
        signature,
        projectId,
        amount,
        backerWallet: publicKey.toString()
      })
      
      const explorerUrl = getExplorerTransactionUrl(signature)
      
      return {
        success: true,
        signature,
        explorerUrl
      }
    } catch (error) {
      const parsed = parseBlockchainError(error)
      return {
        success: false,
        error: parsed.userMessage,
        errorType: parsed.type,
        recoverable: parsed.recoverable
      }
    }
  }, [connected, publicKey, sendTransaction, connection, verifyMutation])

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
