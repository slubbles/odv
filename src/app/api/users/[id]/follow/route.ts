import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/api-client'

// POST /api/users/[id]/follow - Follow a creator
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: followingWallet } = await params
    const body = await request.json()
    const { followerWallet } = body

    if (!followerWallet) {
      return NextResponse.json(
        { error: 'Follower wallet required' },
        { status: 400 }
      )
    }

    // Check if already following
    const { data: existing } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_wallet', followerWallet)
      .eq('following_wallet', followingWallet)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Already following' },
        { status: 400 }
      )
    }

    // Create follow
    const { error } = await supabase
      .from('follows')
      .insert({
        follower_wallet: followerWallet,
        following_wallet: followingWallet,
      })

    if (error) throw error

    // Update follower counts (cached)
    await Promise.all([
      supabase.rpc('increment_followers', { user_wallet: followingWallet }),
      supabase.rpc('increment_following', { user_wallet: followerWallet }),
    ]).catch(console.error)

    return NextResponse.json({
      success: true,
      message: 'Successfully followed',
    })
  } catch (error: any) {
    console.error('Follow error:', error)
    return NextResponse.json(
      { error: 'Failed to follow', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/users/[id]/follow - Unfollow a creator
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: followingWallet } = await params
    const { searchParams } = new URL(request.url)
    const followerWallet = searchParams.get('follower')

    if (!followerWallet) {
      return NextResponse.json(
        { error: 'Follower wallet required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_wallet', followerWallet)
      .eq('following_wallet', followingWallet)

    if (error) throw error

    // Update follower counts (cached)
    await Promise.all([
      supabase.rpc('decrement_followers', { user_wallet: followingWallet }),
      supabase.rpc('decrement_following', { user_wallet: followerWallet }),
    ]).catch(console.error)

    return NextResponse.json({
      success: true,
      message: 'Successfully unfollowed',
    })
  } catch (error: any) {
    console.error('Unfollow error:', error)
    return NextResponse.json(
      { error: 'Failed to unfollow', details: error.message },
      { status: 500 }
    )
  }
}
