import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/api-client'

// POST /api/projects/[id]/publish - Publish project to queue
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseClient()
    const { id } = await params

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

    // Check if project is in draft
    if (project.status !== 'draft') {
      return NextResponse.json(
        { error: 'Only draft projects can be published' },
        { status: 400 }
      )
    }

    // Update status to queue
    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update({ status: 'queue' })
      .eq('id', id)
      .select()
      .single()

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      project: updatedProject,
    })
  } catch (error: any) {
    console.error('Publish project error:', error)
    return NextResponse.json(
      { error: 'Failed to publish project', details: error.message },
      { status: 500 }
    )
  }
}
