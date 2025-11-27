import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// POST /api/wallet/withdraw - Withdraw funds
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress, amount, projectId } = body

    if (!walletAddress || !amount) {
      return NextResponse.json(
        { error: 'Wallet address and amount required' },
        { status: 400 }
      )
    }

    // TODO: Implement actual blockchain withdrawal
    // For now, just create a transaction record

    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert({
        type: 'withdrawal',
        from_wallet: 'platform',
        to_wallet: walletAddress,
        amount,
        project_id: projectId,
        tx_signature: `withdrawal_${Date.now()}`,
        status: 'pending',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      transaction,
      message: 'Withdrawal initiated',
    })
  } catch (error: any) {
    console.error('Withdraw error:', error)
    return NextResponse.json(
      { error: 'Failed to withdraw', details: error.message },
      { status: 500 }
    )
  }
}
