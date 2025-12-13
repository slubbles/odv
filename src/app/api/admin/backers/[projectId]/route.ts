import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/api-client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json' // json or csv
    
    // Note: Admin authentication handled by middleware.ts
    // Requires x-wallet-address header with admin wallet
    
    const supabase = getSupabaseClient()

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    // Fetch all backers for this project
    const { data: backings, error } = await supabase
      .from('backings')
      .select(`
        id,
        backer_wallet,
        amount,
        transaction_signature,
        backed_at,
        verified
      `)
      .eq('project_id', projectId)
      .order('backed_at', { ascending: false })

    if (error) {
      console.error('[Admin Backers Export] Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch backers', details: error.message },
        { status: 500 }
      )
    }

    if (!backings || backings.length === 0) {
      return NextResponse.json(
        { message: 'No backers found for this project', backers: [] },
        { status: 200 }
      )
    }

    // Return CSV format
    if (format === 'csv') {
      const csvHeaders = 'Backer Wallet,Amount (USDC),Transaction Signature,Date,Verified\n'
      const csvRows = backings.map(b => 
        `${b.backer_wallet},${b.amount},${b.transaction_signature},${new Date(b.backed_at).toISOString()},${b.verified}`
      ).join('\n')
      
      const csv = csvHeaders + csvRows

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="backers-${projectId}-${Date.now()}.csv"`
        }
      })
    }

    // Return JSON format (default)
    const summary = {
      projectId,
      totalBackers: backings.length,
      totalAmount: backings.reduce((sum, b) => sum + (b.amount || 0), 0),
      verifiedBackers: backings.filter(b => b.verified).length,
      exportedAt: new Date().toISOString(),
      backers: backings.map(b => ({
        wallet: b.backer_wallet,
        amount: b.amount,
        transactionSignature: b.transaction_signature,
        date: b.backed_at,
        verified: b.verified
      }))
    }

    return NextResponse.json(summary, { status: 200 })

  } catch (error) {
    console.error('[Admin Backers Export] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
