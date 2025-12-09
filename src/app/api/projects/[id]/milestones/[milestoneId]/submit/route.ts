import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/api-client'
import { notifyMilestoneSubmitted } from '@/lib/notifications'
import { ADMIN_WALLETS } from '@/lib/auth/admin'

// POST /api/projects/[id]/milestones/[milestoneId]/submit - Submit milestone for review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; milestoneId: string }> }
) {
  try {
    const supabase = getSupabaseClient()
    const { id: projectId, milestoneId } = await params
    const body = await request.json()
    const { proofUrl, proofDescription, walletAddress } = body

    if (!proofUrl || !proofDescription) {
      return NextResponse.json(
        { error: 'Proof URL and description required' },
        { status: 400 }
      )
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    // Get milestone with project info
    const { data: milestone } = await supabase
      .from('milestones')
      .select('status, title, project_id, projects(title, creator_wallet)')
      .eq('id', milestoneId)
      .single()

    if (!milestone) {
      return NextResponse.json(
        { error: 'Milestone not found' },
        { status: 404 }
      )
    }

    if (milestone.status !== 'active') {
      return NextResponse.json(
        { error: 'Only active milestones can be submitted for review' },
        { status: 400 }
      )
    }

    // Update milestone
    const { data: updatedMilestone, error } = await supabase
      .from('milestones')
      .update({
        status: 'in_review',
        proof_url: proofUrl,
        proof_description: proofDescription,
        submitted_at: new Date().toISOString(),
      })
      .eq('id', milestoneId)
      .select()
      .single()

    if (error) throw error

    // Notify all admins of new milestone submission
    // milestone.projects can be an array or single object depending on Supabase join
    const projectData = Array.isArray(milestone.projects) 
      ? milestone.projects[0] 
      : milestone.projects
    const project = projectData as { title: string; creator_wallet: string } | null
    if (project) {
      for (const adminWallet of ADMIN_WALLETS) {
        await notifyMilestoneSubmitted(
          adminWallet,
          projectId,
          project.title,
          milestone.title,
          walletAddress || project.creator_wallet
        )
      }
    }

    return NextResponse.json({
      success: true,
      milestone: updatedMilestone,
      message: 'Milestone submitted for review',
    })
  } catch (error: any) {
    console.error('Submit milestone error:', error)
    return NextResponse.json(
      { error: 'Failed to submit milestone', details: error.message },
      { status: 500 }
    )
  }
}
