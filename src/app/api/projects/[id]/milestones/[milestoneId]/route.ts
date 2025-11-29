import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/api-client'

// PATCH /api/projects/[id]/milestones/[milestoneId] - Update milestone
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; milestoneId: string }> }
) {
  try {
    const supabase = getSupabaseClient()
    const { milestoneId } = await params
    const body = await request.json()
    const { title, description, percentage, deadline } = body

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (percentage !== undefined) updateData.percentage = percentage
    if (deadline !== undefined) updateData.deadline = deadline

    const { data: milestone, error } = await supabase
      .from('milestones')
      .update(updateData)
      .eq('id', milestoneId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      milestone,
    })
  } catch (error: any) {
    console.error('Update milestone error:', error)
    return NextResponse.json(
      { error: 'Failed to update milestone', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id]/milestones/[milestoneId] - Delete milestone
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; milestoneId: string }> }
) {
  try {
    const supabase = getSupabaseClient()
    const { milestoneId } = await params

    // Check if milestone can be deleted (must be locked)
    const { data: milestone } = await supabase
      .from('milestones')
      .select('status')
      .eq('id', milestoneId)
      .single()

    if (milestone && milestone.status !== 'locked') {
      return NextResponse.json(
        { error: 'Can only delete locked milestones' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('milestones')
      .delete()
      .eq('id', milestoneId)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Milestone deleted successfully',
    })
  } catch (error: any) {
    console.error('Delete milestone error:', error)
    return NextResponse.json(
      { error: 'Failed to delete milestone', details: error.message },
      { status: 500 }
    )
  }
}
