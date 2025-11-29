import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/api-client'

// POST /api/admin/projects/[id]/approve - Approve project
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseClient()
    const { id } = await params
    const body = await request.json()
    const { launchDate, notes } = body

    const updateData: any = {
      status: 'active',
      launch_date: launchDate || new Date().toISOString(),
    }

    if (notes) {
      updateData.admin_notes = notes
    }

    const { data: project, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // TODO: Notify creator of approval

    return NextResponse.json({
      success: true,
      project,
      message: 'Project approved',
    })
  } catch (error: any) {
    console.error('Approve project error:', error)
    return NextResponse.json(
      { error: 'Failed to approve project', details: error.message },
      { status: 500 }
    )
  }
}
