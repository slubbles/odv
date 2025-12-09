import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/api-client'
import { isAdminRequest } from '@/lib/auth/admin-api'
import { notifyProjectRejected } from '@/lib/notifications'

// POST /api/admin/projects/[id]/reject - Reject project
export async function POST(
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
    const body = await request.json()
    const { reason } = body

    if (!reason) {
      return NextResponse.json(
        { error: 'Rejection reason required' },
        { status: 400 }
      )
    }

    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // First get the project details for notification
    const { data: existingProject } = await supabase
      .from('projects')
      .select('creator_wallet, title')
      .eq('id', id)
      .single()

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
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

    // Notify creator of rejection with reason
    await notifyProjectRejected(
      existingProject.creator_wallet,
      id,
      existingProject.title,
      reason
    )

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
