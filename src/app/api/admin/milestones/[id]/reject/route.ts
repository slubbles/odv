import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// POST /api/admin/milestones/[id]/reject - Reject milestone
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { feedback } = body

    if (!feedback) {
      return NextResponse.json(
        { error: 'Feedback required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('milestones')
      .update({
        status: 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewer_notes: feedback,
      })
      .eq('id', id)

    if (error) throw error

    // TODO: Notify creator of rejection with feedback

    return NextResponse.json({
      success: true,
      message: 'Milestone rejected',
    })
  } catch (error: any) {
    console.error('Reject milestone error:', error)
    return NextResponse.json(
      { error: 'Failed to reject milestone', details: error.message },
      { status: 500 }
    )
  }
}
