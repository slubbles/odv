import { NextRequest, NextResponse } from 'next/server'
import { Connection, PublicKey, Transaction, Keypair } from '@solana/web3.js'
import { getAssociatedTokenAddress } from '@solana/spl-token'
import { supabaseAdmin } from '@/lib/supabase/admin'

const RPC_URL = 'https://rpc.testnet.soo.network/rpc'
const USDC_MINT_ADDRESS = new PublicKey(
  process.env.NEXT_PUBLIC_USDC_MINT || "3PNhmxDckddYL24zEfrsHLFLXXvrdzBBoZgfRW8rruDs"
)

// Rate limiting: Simple in-memory store (use Redis in production)
const rateLimitStore = new Map<string, { count: number, resetTime: number }>()
const RATE_LIMIT_MAX = 10 // Max 10 backings per hour per wallet
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour

function checkRateLimit(walletAddress: string): { allowed: boolean, remaining: number } {
  const now = Date.now()
  const record = rateLimitStore.get(walletAddress)

  if (!record || now > record.resetTime) {
    // Reset or initialize
    rateLimitStore.set(walletAddress, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 }
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count }
}

export async function POST(req: NextRequest) {
  console.log('[Relay] Creating transaction for gas sponsorship...')

  try {
    const body = await req.json()
    const { projectId, creatorWallet, campaignId, backerWallet, amount = 1 } = body

    console.log('[Relay] Request:', {
      projectId,
      creatorWallet: creatorWallet?.slice(0, 8),
      campaignId,
      backerWallet: backerWallet?.slice(0, 8),
      amount
    })

    // Validation
    if (!projectId || !creatorWallet || campaignId === undefined || !backerWallet) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (typeof campaignId !== 'number' || campaignId < 0) {
      return NextResponse.json(
        { error: 'Invalid campaign ID' },
        { status: 400 }
      )
    }

    // Rate limiting
    const rateLimit = checkRateLimit(backerWallet)
    if (!rateLimit.allowed) {
      console.warn('[Relay] Rate limit exceeded for', backerWallet.slice(0, 8))
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    // Verify project exists and is active
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('id, status, campaign_id')
      .eq('id', projectId)
      .single()

    if (projectError || !project) {
      console.error('[Relay] Project not found:', projectId)
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    if (project.status !== 'active') {
      console.error('[Relay] Project not active:', project.status)
      return NextResponse.json(
        { error: 'Project is not active for backing' },
        { status: 400 }
      )
    }

    if (project.campaign_id !== campaignId) {
      console.error('[Relay] Campaign ID mismatch:', { expected: project.campaign_id, received: campaignId })
      return NextResponse.json(
        { error: 'Campaign ID mismatch' },
        { status: 400 }
      )
    }

    // Load relayer wallet
    const relayerPrivateKeyBase64 = process.env.RELAYER_PRIVATE_KEY_BASE64
    if (!relayerPrivateKeyBase64) {
      console.error('[Relay] ❌ RELAYER_PRIVATE_KEY_BASE64 not configured')
      return NextResponse.json(
        { error: 'Gas sponsorship not available' },
        { status: 503 }
      )
    }

    const relayerKeypair = Keypair.fromSecretKey(
      Buffer.from(relayerPrivateKeyBase64, 'base64')
    )
    console.log('[Relay] Relayer wallet:', relayerKeypair.publicKey.toString().slice(0, 8))

    // Check relayer balance
    const connection = new Connection(RPC_URL, 'confirmed')
    const relayerBalance = await connection.getBalance(relayerKeypair.publicKey)
    const relayerBalanceSOL = relayerBalance / 1e9

    console.log('[Relay] Relayer balance:', relayerBalanceSOL, 'SOL')

    if (relayerBalanceSOL < 0.1) {
      console.error('[Relay] ⚠️ CRITICAL: Relayer balance low!', relayerBalanceSOL, 'SOL')
      // Still continue but log for monitoring
    }

    // Validate backer wallet
    let backerPublicKey: PublicKey
    let creatorPublicKey: PublicKey
    try {
      backerPublicKey = new PublicKey(backerWallet)
      creatorPublicKey = new PublicKey(creatorWallet)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      )
    }

    // Check if backer has USDC token account
    try {
      const backerUsdcAccount = await getAssociatedTokenAddress(
        USDC_MINT_ADDRESS,
        backerPublicKey
      )
      const accountInfo = await connection.getAccountInfo(backerUsdcAccount)
      
      if (!accountInfo) {
        console.error('[Relay] Backer has no USDC token account')
        return NextResponse.json(
          { error: 'You need to have USDC in your wallet first. Get test USDC at /faucet' },
          { status: 400 }
        )
      }
    } catch (error) {
      console.error('[Relay] Error checking backer USDC account:', error)
      return NextResponse.json(
        { error: 'Unable to verify USDC balance' },
        { status: 500 }
      )
    }

    // Import transaction creation function (we'll update this file next)
    const { createFundCampaignTransaction } = await import('@/lib/solana/transaction')

    // Create transaction with RELAYER as fee payer
    console.log('[Relay] Building transaction with relayer as fee payer...')
    const transaction = await createFundCampaignTransaction(
      connection,
      backerPublicKey,
      creatorPublicKey,
      campaignId,
      amount,
      relayerKeypair.publicKey // Fee payer override
    )

    // Set longer expiration (5 minutes instead of ~1 minute default)
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized')
    transaction.recentBlockhash = blockhash
    transaction.lastValidBlockHeight = lastValidBlockHeight
    transaction.feePayer = relayerKeypair.publicKey

    // Serialize transaction for frontend to sign
    const serializedTx = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false
    }).toString('base64')

    console.log('[Relay] ✅ Transaction created, awaiting backer signature')
    console.log('[Relay] Blockhash:', blockhash.slice(0, 8), 'Valid until block:', lastValidBlockHeight)

    return NextResponse.json({
      success: true,
      transaction: serializedTx,
      message: 'Transaction created. Please sign with your wallet.',
      relayerAddress: relayerKeypair.publicKey.toString(),
      blockhash,
      lastValidBlockHeight,
      rateLimit: {
        remaining: rateLimit.remaining,
        resetIn: RATE_LIMIT_WINDOW / 1000 / 60 // minutes
      }
    })

  } catch (error: any) {
    console.error('[Relay] Error creating transaction:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create transaction',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
