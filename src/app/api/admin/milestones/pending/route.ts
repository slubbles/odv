import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/api-client'

// GET /api/admin/milestones/pending - Get milestones pending review
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { data: milestones, error } = await supabase
      .from('milestones')
      .select('*, projects(title, creator_wallet)')
      .eq('status', 'in_review')
      .order('submitted_at', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) throw error

    const { count } = await supabase
      .from('milestones')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'in_review')

    return NextResponse.json({
      milestones: milestones || [],
      total: count || 0,
    })
  } catch (error: any) {
    console.error('Get pending milestones error:', error)
    return NextResponse.json(
      { error: 'Failed to get pending milestones', details: error.message },
      { status: 500 }
    )
  }
}
