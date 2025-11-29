import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/api-client'

// GET /api/admin/projects/queue - Get projects in review queue
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'queue')
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) throw error

    const { count } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'queue')

    return NextResponse.json({
      projects: projects || [],
      total: count || 0,
    })
  } catch (error: any) {
    console.error('Get queue error:', error)
    return NextResponse.json(
      { error: 'Failed to get queue', details: error.message },
      { status: 500 }
    )
  }
}
