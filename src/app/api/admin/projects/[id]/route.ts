import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/api-client'
import { isAdminRequest } from '@/lib/auth/admin-api'

// GET /api/admin/projects/[id] - Get project details for admin
export async function GET(
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

    // Check if Supabase is configured (mock check)
    const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")

    if (isMockMode) {
      const { mockDb } = await import("@/lib/mock-db")
      const project = mockDb.getProject(id)

      if (!project) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        project: {
          ...project,
          creator_wallet: project.creator_wallet || '4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw',
          goal: project.goal || 100,
          deadline: project.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          milestones: project.milestones || [
            { title: 'Phase 1', percentage: 50 },
            { title: 'Phase 2', percentage: 50 },
          ],
        },
      })
    }

    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Get project with milestones
    const { data: project, error } = await supabase
      .from('projects')
      .select(`
        *,
        milestones (
          id,
          title,
          description,
          percentage,
          amount,
          deadline,
          status
        )
      `)
      .eq('id', id)
      .single()

    if (error || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      project,
    })
  } catch (error: any) {
    console.error('Get project error:', error)
    return NextResponse.json(
      { error: 'Failed to get project', details: error.message },
      { status: 500 }
    )
  }
}
