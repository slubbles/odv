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
