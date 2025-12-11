import { NextRequest, NextResponse } from 'next/server'
import { Connection, Transaction, Keypair, sendAndConfirmTransaction } from '@solana/web3.js'

const RPC_URL = 'https://rpc.testnet.soo.network/rpc'

export async function POST(req: NextRequest) {
  console.log('[Relay Submit] Submitting signed transaction...')

  try {
    const body = await req.json()
    const { signedTransaction } = body

    if (!signedTransaction) {
      return NextResponse.json(
        { error: 'Missing signed transaction' },
        { status: 400 }
      )
    }

    // Load relayer wallet
    const relayerPrivateKeyBase64 = process.env.RELAYER_PRIVATE_KEY_BASE64
    if (!relayerPrivateKeyBase64) {
      console.error('[Relay Submit] ❌ RELAYER_PRIVATE_KEY_BASE64 not configured')
      return NextResponse.json(
        { error: 'Gas sponsorship not available' },
        { status: 503 }
      )
    }

    const relayerKeypair = Keypair.fromSecretKey(
      Buffer.from(relayerPrivateKeyBase64, 'base64')
    )

    console.log('[Relay Submit] Relayer:', relayerKeypair.publicKey.toString().slice(0, 8))

    // Deserialize the transaction
    const transaction = Transaction.from(
      Buffer.from(signedTransaction, 'base64')
    )

    console.log('[Relay Submit] Transaction signatures before relayer sign:', 
      transaction.signatures.map(s => s.publicKey?.toString().slice(0, 8))
    )

    // Verify transaction has backer's signature
    const hasBackerSignature = transaction.signatures.some(
      sig => sig.signature !== null && !sig.publicKey?.equals(relayerKeypair.publicKey)
    )

    if (!hasBackerSignature) {
      console.error('[Relay Submit] Transaction not signed by backer')
      return NextResponse.json(
        { error: 'Transaction must be signed by backer first' },
        { status: 400 }
      )
    }

    // Add relayer signature
    console.log('[Relay Submit] Adding relayer signature...')
    transaction.partialSign(relayerKeypair)

    console.log('[Relay Submit] Transaction signatures after relayer sign:', 
      transaction.signatures.map(s => ({
        pubkey: s.publicKey?.toString().slice(0, 8),
        hasSig: s.signature !== null
      }))
    )

    // Connect and submit
    const connection = new Connection(RPC_URL, 'confirmed')
    
    // Check relayer balance before submission
    const balanceBefore = await connection.getBalance(relayerKeypair.publicKey)
    console.log('[Relay Submit] Relayer balance before:', balanceBefore / 1e9, 'SOL')

    // Submit transaction with retry logic
    console.log('[Relay Submit] Submitting to blockchain...')
    let signature: string
    let attempts = 0
    const maxAttempts = 3

    while (attempts < maxAttempts) {
      try {
        signature = await connection.sendRawTransaction(
          transaction.serialize(),
          {
            skipPreflight: false,
            preflightCommitment: 'confirmed',
            maxRetries: 3
          }
        )
        console.log('[Relay Submit] Transaction sent! Signature:', signature.slice(0, 8))
        break
      } catch (error: any) {
        attempts++
        console.error(`[Relay Submit] Attempt ${attempts}/${maxAttempts} failed:`, error.message)
        
        // Handle specific errors
        if (error.message?.includes('blockhash not found') || error.message?.includes('expired')) {
          return NextResponse.json(
            { 
              error: 'Transaction expired. Please try again.',
              recoverable: true 
            },
            { status: 400 }
          )
        }

        if (attempts >= maxAttempts) {
          throw error
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts))
      }
    }

    // Confirm transaction
    console.log('[Relay Submit] Confirming transaction...')
    const confirmation = await connection.confirmTransaction(signature!, 'confirmed')
    
    if (confirmation.value.err) {
      console.error('[Relay Submit] Transaction failed on-chain:', confirmation.value.err)
      return NextResponse.json(
        { 
          error: 'Transaction failed on blockchain',
          details: JSON.stringify(confirmation.value.err)
        },
        { status: 400 }
      )
    }

    // Check relayer balance after submission
    const balanceAfter = await connection.getBalance(relayerKeypair.publicKey)
    const gasUsed = (balanceBefore - balanceAfter) / 1e9
    
    console.log('[Relay Submit] ✅ Transaction confirmed!')
    console.log('[Relay Submit] Gas used:', gasUsed, 'SOL (~$' + (gasUsed * 75).toFixed(4) + ')')
    console.log('[Relay Submit] Relayer balance after:', balanceAfter / 1e9, 'SOL')

    // Alert if balance low
    if (balanceAfter / 1e9 < 0.1) {
      console.error('[Relay Submit] ⚠️⚠️⚠️ CRITICAL: RELAYER BALANCE LOW!', balanceAfter / 1e9, 'SOL')
      console.error('[Relay Submit] ⚠️⚠️⚠️ PLEASE REFILL IMMEDIATELY!')
    } else if (balanceAfter / 1e9 < 0.3) {
      console.warn('[Relay Submit] ⚠️ WARNING: Relayer balance getting low:', balanceAfter / 1e9, 'SOL')
    }

    return NextResponse.json({
      success: true,
      signature: signature!,
      gasUsed: gasUsed,
      gasCostUSD: gasUsed * 75,
      relayerBalance: balanceAfter / 1e9,
      message: 'Transaction submitted successfully. Gas sponsored by platform.'
    })

  } catch (error: any) {
    console.error('[Relay Submit] Error submitting transaction:', error)
    
    // Parse error for user-friendly message
    let errorMessage = 'Failed to submit transaction'
    let recoverable = false

    if (error.message?.includes('insufficient funds')) {
      errorMessage = 'Insufficient USDC balance'
      recoverable = false
    } else if (error.message?.includes('already processed')) {
      errorMessage = 'Transaction already processed'
      recoverable = false
    } else if (error.message?.includes('timeout') || error.message?.includes('network')) {
      errorMessage = 'Network error. Please try again.'
      recoverable = true
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.message,
        recoverable
      },
      { status: 500 }
    )
  }
}
