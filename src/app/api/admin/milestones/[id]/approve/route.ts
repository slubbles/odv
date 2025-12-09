import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/api-client'
import { isAdminRequest } from '@/lib/auth/admin-api'
import { notifyMilestoneApproved } from '@/lib/notifications'

// POST /api/admin/milestones/[id]/approve - Approve milestone
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
    const { notes, approveTxSignature, releaseTxSignature } = body

    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Get milestone details with project info
    const { data: milestone } = await supabase
      .from('milestones')
      .select('*, projects(id, title, creator_wallet, campaign_pda)')
      .eq('id', id)
      .single()

    if (!milestone) {
      return NextResponse.json(
        { error: 'Milestone not found' },
        { status: 404 }
      )
    }

    if (milestone.status !== 'in_review') {
      return NextResponse.json(
        { error: 'Milestone must be in review to approve' },
        { status: 400 }
      )
    }

    // Update milestone status to completed
    const updateData: Record<string, any> = {
      status: 'completed',
      reviewed_at: new Date().toISOString(),
      reviewer_notes: notes,
    }

    // Store transaction signatures if provided
    if (approveTxSignature) {
      updateData.approve_tx = approveTxSignature
    }
    if (releaseTxSignature) {
      updateData.release_tx = releaseTxSignature
    }

    const { error: updateError } = await supabase
      .from('milestones')
      .update(updateData)
      .eq('id', id)

    if (updateError) throw updateError

    // Activate the next milestone if exists
    const { data: nextMilestone } = await supabase
      .from('milestones')
      .select('id')
      .eq('project_id', milestone.project_id)
      .eq('status', 'locked')
      .order('percentage', { ascending: true })
      .limit(1)
      .single()

    if (nextMilestone) {
      await supabase
        .from('milestones')
        .update({ status: 'active' })
        .eq('id', nextMilestone.id)
    }

    // Record the fund release transaction
    const releaseAmount = milestone.amount || 0
    if (releaseAmount > 0 && milestone.projects?.creator_wallet) {
      await supabase
        .from('transactions')
        .insert({
          type: 'milestone_release',
          from_wallet: 'escrow',
          to_wallet: milestone.projects.creator_wallet,
          amount: releaseAmount,
          project_id: milestone.project_id,
          tx_signature: releaseTxSignature || `milestone_release_${id}_${Date.now()}`,
          status: releaseTxSignature ? 'confirmed' : 'pending',
          metadata: { 
            milestone_id: id, 
            milestone_title: milestone.title,
            approve_tx: approveTxSignature,
          }
        })
    }

    // Notify creator of milestone approval
    if (milestone.projects) {
      await notifyMilestoneApproved(
        milestone.projects.creator_wallet,
        milestone.projects.id,
        milestone.projects.title,
        milestone.title,
        releaseAmount
      )
    }

    return NextResponse.json({
      success: true,
      message: releaseTxSignature 
        ? 'Milestone approved and funds released on-chain'
        : 'Milestone approved (off-chain)',
      releasedAmount: releaseAmount,
      approveTxSignature,
      releaseTxSignature,
    })
  } catch (error: any) {
    console.error('Approve milestone error:', error)
    return NextResponse.json(
      { error: 'Failed to approve milestone', details: error.message },
      { status: 500 }
    )
  }
}
