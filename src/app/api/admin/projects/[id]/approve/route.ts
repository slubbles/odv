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

    // Check if Supabase is configured (mock check)
    const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")

    if (isMockMode) {
      const { mockDb } = await import("@/lib/mock-db")
      const project = mockDb.updateStatus(id, 'approved')

      if (!project) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        project,
        message: 'Project approved (Mock Mode)',
      })
    }

    const updateData: any = {
      status: 'active',
      launch_date: launchDate || new Date().toISOString(),
    }

    if (notes) {
      updateData.admin_notes = notes
    }

    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
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
