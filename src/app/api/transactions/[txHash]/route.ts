import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/api-client'

// GET /api/transactions/[txHash] - Get transaction details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ txHash: string }> }
) {
  try {
    const { txHash } = await params

    const { data: transaction, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('tx_signature', txHash)
      .single()

    if (error || !transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ transaction })
  } catch (error: any) {
    console.error('Get transaction error:', error)
    return NextResponse.json(
      { error: 'Failed to get transaction', details: error.message },
      { status: 500 }
    )
  }
}
