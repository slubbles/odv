import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// POST /api/projects/[id]/withdraw - Withdraw project
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { reason } = body

    // Get project
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if project can be withdrawn
    if (project.status === 'completed') {
      return NextResponse.json(
        { error: 'Cannot withdraw completed projects' },
        { status: 400 }
      )
    }

    // Update status to withdrawn
    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update({ 
        status: 'withdrawn',
        admin_notes: reason || 'Withdrawn by creator',
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) throw updateError

    // TODO: Trigger refunds for backers if project was active

    return NextResponse.json({
      success: true,
      project: updatedProject,
      message: 'Project withdrawn successfully',
    })
  } catch (error: any) {
    console.error('Withdraw project error:', error)
    return NextResponse.json(
      { error: 'Failed to withdraw project', details: error.message },
      { status: 500 }
    )
  }
}
