import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Connection } from '@solana/web3.js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// POST /api/transactions/verify - Verify blockchain transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { txSignature } = body

    if (!txSignature) {
      return NextResponse.json(
        { error: 'Transaction signature required' },
        { status: 400 }
      )
    }

    // Connect to Solana
    const connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com'
    )

    try {
      // Verify transaction on blockchain
      const txInfo = await connection.getTransaction(txSignature, {
        maxSupportedTransactionVersion: 0,
      })

      if (!txInfo) {
        return NextResponse.json(
          { error: 'Transaction not found on blockchain' },
          { status: 404 }
        )
      }

      // Update transaction status in database
      const { error: updateError } = await supabase
        .from('transactions')
        .update({
          status: 'confirmed',
          blockchain_confirmed: true,
        })
        .eq('tx_signature', txSignature)

      if (updateError) throw updateError

      return NextResponse.json({
        success: true,
        verified: true,
        transaction: txInfo,
      })
    } catch (error) {
      console.error('Blockchain verification error:', error)
      return NextResponse.json(
        { error: 'Transaction verification failed', verified: false },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Verify transaction error:', error)
    return NextResponse.json(
      { error: 'Failed to verify transaction', details: error.message },
      { status: 500 }
    )
  }
}
