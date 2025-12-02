import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/api-client'

// GET /api/comments - Get comments for a project
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('project_id')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID required' },
        { status: 400 }
      )
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    const { data: comments, error, count } = await supabase
      .from('comments')
      .select(`
        *,
        users:wallet_address (
          wallet_address,
          name,
          avatar_url
        )
      `, { count: 'exact' })
      .eq('project_id', projectId)
      .is('parent_id', null) // Only top-level comments
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Failed to fetch comments:', error)
      return NextResponse.json(
        { error: 'Failed to fetch comments' },
        { status: 500 }
      )
    }

    // Fetch replies for each comment
    const commentsWithReplies = await Promise.all(
      (comments || []).map(async (comment) => {
        const { data: replies } = await supabase
          .from('comments')
          .select(`
            *,
            users:wallet_address (
              wallet_address,
              name,
              avatar_url
            )
          `)
          .eq('parent_id', comment.id)
          .order('created_at', { ascending: true })
          .limit(5)

        return {
          ...comment,
          replies: replies || []
        }
      })
    )

    return NextResponse.json({
      comments: commentsWithReplies,
      total: count || 0,
      hasMore: (offset + limit) < (count || 0)
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/comments - Create a new comment
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const body = await request.json()

    const {
      project_id,
      wallet_address,
      content,
      parent_id = null
    } = body

    if (!project_id || !wallet_address || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Comment too long (max 1000 characters)' },
        { status: 400 }
      )
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    // Create the comment
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        project_id,
        wallet_address,
        content,
        parent_id,
        likes: 0
      })
      .select(`
        *,
        users:wallet_address (
          wallet_address,
          name,
          avatar_url
        )
      `)
      .single()

    if (error) {
      console.error('Failed to create comment:', error)
      return NextResponse.json(
        { error: 'Failed to create comment', details: error.message },
        { status: 500 }
      )
    }

    // If it's a reply, notify the parent comment author
    if (parent_id) {
      const { data: parentComment } = await supabase
        .from('comments')
        .select('wallet_address, project_id')
        .eq('id', parent_id)
        .single()

      if (parentComment && parentComment.wallet_address !== wallet_address) {
        // Create notification for reply
        await supabase.from('notifications').insert({
          wallet_address: parentComment.wallet_address,
          type: 'comment',
          title: 'New Reply',
          description: `Someone replied to your comment`,
          project_id,
          action_url: `/project/${project_id}`,
          action_label: 'View Reply',
          read: false
        })
      }
    }

    return NextResponse.json({
      success: true,
      comment
    }, { status: 201 })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/comments - Like/unlike a comment
export async function PATCH(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const body = await request.json()

    const {
      comment_id,
      wallet_address,
      action // 'like' or 'unlike'
    } = body

    if (!comment_id || !wallet_address || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('comment_id', comment_id)
      .eq('wallet_address', wallet_address)
      .single()

    if (action === 'like' && !existingLike) {
      // Add like
      await supabase.from('comment_likes').insert({
        comment_id,
        wallet_address
      })

      // Increment likes count
      await supabase.rpc('increment_comment_likes', { cid: comment_id })

    } else if (action === 'unlike' && existingLike) {
      // Remove like
      await supabase
        .from('comment_likes')
        .delete()
        .eq('comment_id', comment_id)
        .eq('wallet_address', wallet_address)

      // Decrement likes count
      await supabase.rpc('decrement_comment_likes', { cid: comment_id })
    }

    // Get updated comment
    const { data: comment, error } = await supabase
      .from('comments')
      .select('id, likes')
      .eq('id', comment_id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update like' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      likes: comment?.likes || 0,
      liked: action === 'like'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/comments - Delete a comment
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { searchParams } = new URL(request.url)
    const commentId = searchParams.get('id')
    const walletAddress = searchParams.get('wallet')

    if (!commentId || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing comment ID or wallet address' },
        { status: 400 }
      )
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    // Verify ownership
    const { data: comment } = await supabase
      .from('comments')
      .select('wallet_address')
      .eq('id', commentId)
      .single()

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    if (comment.wallet_address !== walletAddress) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Delete comment (cascade will handle likes and replies)
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)

    if (error) {
      console.error('Failed to delete comment:', error)
      return NextResponse.json(
        { error: 'Failed to delete comment' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Comment deleted'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
