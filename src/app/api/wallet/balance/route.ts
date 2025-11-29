import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/api-client'

// GET /api/wallet/balance - Get user's wallet balance
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { searchParams } = new URL(request.url)
    const wallet = searchParams.get('wallet')

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      )
    }

    // Calculate balance from transactions
    const { data: incoming } = await supabase
      .from('transactions')
      .select('amount')
      .eq('to_wallet', wallet)
      .eq('status', 'confirmed')

    const { data: outgoing } = await supabase
      .from('transactions')
      .select('amount')
      .eq('from_wallet', wallet)
      .eq('status', 'confirmed')

    const incomingTotal = incoming?.reduce((sum, t) => sum + Number(t.amount), 0) || 0
    const outgoingTotal = outgoing?.reduce((sum, t) => sum + Number(t.amount), 0) || 0
    const balance = incomingTotal - outgoingTotal

    return NextResponse.json({
      balance,
      incoming: incomingTotal,
      outgoing: outgoingTotal,
    })
  } catch (error: any) {
    console.error('Get balance error:', error)
    return NextResponse.json(
      { error: 'Failed to get balance', details: error.message },
      { status: 500 }
    )
  }
}
