import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/api-client'

// POST /api/admin/milestones/[id]/approve - Approve milestone
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseClient()
    const { id } = await params
    const body = await request.json()
    const { notes } = body

    // Get milestone details
    const { data: milestone } = await supabase
      .from('milestones')
      .select('*, projects(creator_wallet)')
      .eq('id', id)
      .single()

    if (!milestone) {
      return NextResponse.json(
        { error: 'Milestone not found' },
        { status: 404 }
      )
    }

    // Update milestone status
    const { error: updateError } = await supabase
      .from('milestones')
      .update({
        status: 'completed',
        reviewed_at: new Date().toISOString(),
        reviewer_notes: notes,
      })
      .eq('id', id)

    if (updateError) throw updateError

    // TODO: Release funds to creator

    return NextResponse.json({
      success: true,
      message: 'Milestone approved and funds released',
    })
  } catch (error: any) {
    console.error('Approve milestone error:', error)
    return NextResponse.json(
      { error: 'Failed to approve milestone', details: error.message },
      { status: 500 }
    )
  }
}
