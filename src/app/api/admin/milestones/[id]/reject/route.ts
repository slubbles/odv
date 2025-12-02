import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/api-client'
import { isAdminRequest } from '@/lib/auth/admin-api'
import { notifyMilestoneRejected } from '@/lib/notifications'

// POST /api/admin/milestones/[id]/reject - Reject milestone
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authorization
    const walletAddress = request.headers.get('x-wallet-address')
    if (!isAdminRequest(walletAddress)) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      )
    }

    const supabase = getSupabaseClient()
    const { id } = await params
    const body = await request.json()
    const { feedback } = body

    if (!feedback) {
      return NextResponse.json(
        { error: 'Feedback required' },
        { status: 400 }
      )
    }

    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Get milestone details with project info
    const { data: milestone } = await supabase
      .from('milestones')
      .select('*, projects(id, title, creator_wallet)')
      .eq('id', id)
      .single()

    if (!milestone) {
      return NextResponse.json(
        { error: 'Milestone not found' },
        { status: 404 }
      )
    }

    // Set back to active so creator can resubmit
    const { error } = await supabase
      .from('milestones')
      .update({
        status: 'active',
        reviewed_at: new Date().toISOString(),
        reviewer_notes: feedback,
      })
      .eq('id', id)

    if (error) throw error

    // Notify creator of rejection with feedback
    if (milestone.projects) {
      await notifyMilestoneRejected(
        milestone.projects.creator_wallet,
        milestone.projects.id,
        milestone.projects.title,
        milestone.title,
        feedback
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Milestone rejected - creator notified to resubmit',
    })
  } catch (error: any) {
    console.error('Reject milestone error:', error)
    return NextResponse.json(
      { error: 'Failed to reject milestone', details: error.message },
      { status: 500 }
    )
  }
}
