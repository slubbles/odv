import { NextRequest, NextResponse } from 'next/server'
import { Connection, PublicKey, Keypair, Transaction } from '@solana/web3.js'
import {
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  getAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
} from '@solana/spl-token'
import { RPC_ENDPOINT } from '@/lib/solana/config'

// Test USDC configuration
const USDC_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_USDC_MINT || '3PNhmxDckddYL24zEfrsHLFLXXvrdzBBoZgfRW8rruDs'
)
const FAUCET_AMOUNT = 100_000_000 // 100 USDC (in smallest units, 6 decimals)
const COOLDOWN_MS = 4 * 60 * 60 * 1000 // 4 hour cooldown between requests

// In-memory rate limiting (would use Redis in production)
const requestLog = new Map<string, number>()

// Parse admin private key from environment
function getAdminKeypair(): Keypair | null {
  const privateKey = process.env.ADMIN_PRIVATE_KEY
  if (!privateKey) {
    console.error('ADMIN_PRIVATE_KEY not set')
    return null
  }

  try {
    // Try parsing as JSON array first
    if (privateKey.startsWith('[')) {
      const array = JSON.parse(privateKey)
      return Keypair.fromSecretKey(Uint8Array.from(array))
    }

    // Try as base58
    const bs58 = require('bs58')
    const decoded = bs58.default ? bs58.default.decode(privateKey) : bs58.decode(privateKey)
    return Keypair.fromSecretKey(Uint8Array.from(decoded))
  } catch (e) {
    console.error('Failed to parse admin private key:', e)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress } = body

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    // Validate wallet address
    let recipientPubkey: PublicKey
    try {
      recipientPubkey = new PublicKey(walletAddress)
    } catch {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      )
    }

    // Rate limiting check
    const lastRequest = requestLog.get(walletAddress)
    const now = Date.now()
    if (lastRequest && now - lastRequest < COOLDOWN_MS) {
      const remainingMs = COOLDOWN_MS - (now - lastRequest)
      const remainingMin = Math.ceil(remainingMs / 60000)
      return NextResponse.json(
        { 
          error: `Rate limited. Try again in ${remainingMin} minute${remainingMin > 1 ? 's' : ''}.`,
          cooldownRemaining: remainingMs 
        },
        { status: 429 }
      )
    }

    // Get admin keypair (mint authority)
    const adminKeypair = getAdminKeypair()
    if (!adminKeypair) {
      return NextResponse.json(
        { error: 'Faucet is not configured. Contact admin.' },
        { status: 503 }
      )
    }

    // Connect to SOON Testnet
    const connection = new Connection(RPC_ENDPOINT, 'confirmed')

    // Check admin balance for gas fees
    const adminBalance = await connection.getBalance(adminKeypair.publicKey)
    if (adminBalance < 0.001 * 1e9) {
      return NextResponse.json(
        { error: 'Faucet is temporarily empty. Try again later.' },
        { status: 503 }
      )
    }

    // Get or create recipient's associated token account
    const recipientAta = await getAssociatedTokenAddress(
      USDC_MINT,
      recipientPubkey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    )

    const transaction = new Transaction()

    // Check if ATA exists, create if needed
    try {
      await getAccount(connection, recipientAta)
    } catch (error: unknown) {
      if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
        // Add instruction to create ATA
        transaction.add(
          createAssociatedTokenAccountInstruction(
            adminKeypair.publicKey, // payer
            recipientAta,
            recipientPubkey, // owner
            USDC_MINT,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
          )
        )
      } else {
        throw error
      }
    }

    // Add mint instruction
    transaction.add(
      createMintToInstruction(
        USDC_MINT,
        recipientAta,
        adminKeypair.publicKey, // mint authority
        FAUCET_AMOUNT,
        [],
        TOKEN_PROGRAM_ID
      )
    )

    // Get recent blockhash and send transaction
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = adminKeypair.publicKey

    // Sign and send
    transaction.sign(adminKeypair)
    const signature = await connection.sendRawTransaction(transaction.serialize(), {
      skipPreflight: false,
      preflightCommitment: 'confirmed',
    })

    // Confirm transaction
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    }, 'confirmed')

    // Update rate limit
    requestLog.set(walletAddress, now)

    // Build explorer URL
    const explorerUrl = `https://explorer.testnet.soo.network/tx/${signature}`

    return NextResponse.json({
      success: true,
      amount: FAUCET_AMOUNT / 1e6, // Return in USDC units
      signature,
      explorerUrl,
      message: `Successfully sent ${FAUCET_AMOUNT / 1e6} Test USDC!`
    })

  } catch (error) {
    console.error('Faucet error:', error)
    return NextResponse.json(
      { error: 'Failed to send tokens. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Return faucet info
  return NextResponse.json({
    mint: USDC_MINT.toString(),
    amountPerRequest: FAUCET_AMOUNT / 1e6,
    cooldownHours: COOLDOWN_MS / (60 * 60 * 1000),
    network: 'SOON Testnet',
    explorerUrl: `https://explorer.testnet.soo.network/address/${USDC_MINT.toString()}`
  })
}
