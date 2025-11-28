import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

// GET /api/projects/[id] - Get single project with full details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Fetch project with creator info
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select(`
        *,
        users!projects_creator_wallet_fkey(
          wallet_address,
          name,
          avatar_url,
          bio,
          user_type
        )
      `)
      .eq('id', id)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Fetch milestones
    const { data: milestones } = await supabase
      .from('milestones')
      .select('*')
      .eq('project_id', id)
      .order('order', { ascending: true })

    // Fetch project updates
    const { data: updates } = await supabase
      .from('project_updates')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false })
      .limit(10)

    // Fetch backers count and recent backers
    const { data: backers } = await supabase
      .from('backers')
      .select('wallet_address, amount, created_at')
      .eq('project_id', id)
      .order('created_at', { ascending: false })
      .limit(10)

    // Increment view count (async, don't wait)
    void supabase
      .from('projects')
      .update({ views_count: (project.views_count || 0) + 1 })
      .eq('id', id)

    return NextResponse.json({
      ...project,
      milestones: milestones || [],
      updates: updates || [],
      backers: backers || [],
      creator: project.users || null
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/projects/[id] - Update project (for creators)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const {
      title,
      description,
      category,
      goal,
      deadline,
      image_url,
      video_url,
      wallet_address // For authorization
    } = body

    if (!wallet_address) {
      return NextResponse.json(
        { error: 'Wallet address required for authorization' },
        { status: 401 }
      )
    }

    // Verify ownership
    const { data: project } = await supabase
      .from('projects')
      .select('creator_wallet, status')
      .eq('id', id)
      .single()

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    if (project.creator_wallet !== wallet_address) {
      return NextResponse.json(
        { error: 'Unauthorized: You are not the creator of this project' },
        { status: 403 }
      )
    }

    // Only allow editing if status is draft or queue
    if (!['draft', 'queue'].includes(project.status)) {
      return NextResponse.json(
        { error: 'Cannot edit project after it has been published' },
        { status: 400 }
      )
    }

    // Update project
    const updates: any = {}
    if (title) updates.title = title
    if (description) updates.description = description
    if (category) updates.category = category
    if (goal) updates.goal = goal
    if (deadline) updates.deadline = deadline
    if (image_url) updates.image_url = image_url
    if (video_url) updates.video_url = video_url

    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Failed to update project:', updateError)
      return NextResponse.json(
        { error: 'Failed to update project', details: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      project: updatedProject,
      message: 'Project updated successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Delete project (for creators/admins)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const wallet_address = searchParams.get('wallet')

    if (!wallet_address) {
      return NextResponse.json(
        { error: 'Wallet address required for authorization' },
        { status: 401 }
      )
    }

    // Verify ownership
    const { data: project } = await supabase
      .from('projects')
      .select('creator_wallet, status')
      .eq('id', id)
      .single()

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    if (project.creator_wallet !== wallet_address) {
      return NextResponse.json(
        { error: 'Unauthorized: You are not the creator of this project' },
        { status: 403 }
      )
    }

    // Only allow deletion if status is draft or queue
    if (!['draft', 'queue'].includes(project.status)) {
      return NextResponse.json(
        { error: 'Cannot delete project after it has been published' },
        { status: 400 }
      )
    }

    // Delete project (cascade will handle related records)
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Failed to delete project:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete project', details: deleteError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
