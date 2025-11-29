import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/api-client'

// POST /api/admin/projects/[id]/reject - Reject project
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { reason } = body

    if (!reason) {
      return NextResponse.json(
        { error: 'Rejection reason required' },
        { status: 400 }
      )
    }

    const { data: project, error } = await supabase
      .from('projects')
      .update({
        status: 'rejected',
        rejection_reason: reason,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // TODO: Notify creator of rejection with reason

    return NextResponse.json({
      success: true,
      project,
      message: 'Project rejected',
    })
  } catch (error: any) {
    console.error('Reject project error:', error)
    return NextResponse.json(
      { error: 'Failed to reject project', details: error.message },
      { status: 500 }
    )
  }
}
