"use client"

import { useState } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { createFundCampaignTransaction } from "@/lib/solana/transaction"
import { toast } from "sonner"

export function useBackProject() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { publicKey, signTransaction } = useWallet()
  const { connection } = useConnection()

  const backProject = async (projectId: string, creatorWallet: string, amount: number = 1) => {
    if (!publicKey || !signTransaction) {
      toast.error("Please connect your wallet first")
      return { success: false, error: "Wallet not connected" }
    }

    setIsSubmitting(true)

    try {
      // Step 1: Create Solana transaction
      const creatorPublicKey = new PublicKey(creatorWallet)
      const transaction = await createFundCampaignTransaction(
        connection,
        publicKey,
        creatorPublicKey,
        amount
      )

      // Step 2: Sign and send transaction
      const signedTx = await signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signedTx.serialize())
      
      // Step 3: Confirm transaction
      toast.loading("Confirming transaction...", { id: "backing" })
      await connection.confirmTransaction(signature, 'confirmed')

      // Step 4: Record backing in database
      const response = await fetch(`/api/backing/${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: publicKey.toString(),
          transactionSignature: signature,
          amount
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to record backing')
      }

      toast.success("Successfully backed project! 🎉", { id: "backing" })
      
      return { success: true, signature, backing: data.backing }

    } catch (error: any) {
      console.error('Failed to back project:', error)
      const errorMessage = error.message || 'Failed to complete transaction'
      toast.error(errorMessage, { id: "backing" })
      return { success: false, error: errorMessage }
    } finally {
      setIsSubmitting(false)
    }
  }

  const checkBackingStatus = async (projectId: string, walletAddress: string) => {
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
  }

  return {
    backProject,
    checkBackingStatus,
    isSubmitting
  }
}
