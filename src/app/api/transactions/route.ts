import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET /api/transactions - Get user's transaction history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const wallet = searchParams.get('wallet')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      )
    }

    let query = supabase
      .from('transactions')
      .select('*')
      .or(`from_wallet.eq.${wallet},to_wallet.eq.${wallet}`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (type) {
      query = query.eq('type', type)
    }

    const { data: transactions, error } = await query

    if (error) throw error

    // Get total count
    const { count } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .or(`from_wallet.eq.${wallet},to_wallet.eq.${wallet}`)

    return NextResponse.json({
      transactions: transactions || [],
      total: count || 0,
    })
  } catch (error: any) {
    console.error('Get transactions error:', error)
    return NextResponse.json(
      { error: 'Failed to get transactions', details: error.message },
      { status: 500 }
    )
  }
}
