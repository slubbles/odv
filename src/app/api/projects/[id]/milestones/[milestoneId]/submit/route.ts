import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/api-client'

// POST /api/projects/[id]/milestones/[milestoneId]/submit - Submit milestone for review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; milestoneId: string }> }
) {
  try {
    const supabase = getSupabaseClient()
    const { milestoneId } = await params
    const body = await request.json()
    const { proofUrl, proofDescription } = body

    if (!proofUrl || !proofDescription) {
      return NextResponse.json(
        { error: 'Proof URL and description required' },
        { status: 400 }
      )
    }

    // Check if milestone exists and is active
    const { data: milestone } = await supabase
      .from('milestones')
      .select('status')
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

    // TODO: Notify admin of new milestone submission

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
