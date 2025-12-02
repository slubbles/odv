import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/api-client'

// GET /api/users/[wallet] - Get user profile
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ wallet: string }> }
) {
  try {
    const supabase = getSupabaseClient()
    const { wallet } = await params

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      )
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', wallet)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Failed to fetch user:', error)
      return NextResponse.json(
        { error: 'Failed to fetch user' },
        { status: 500 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found', exists: false },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user,
      exists: true
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/users/[wallet] - Update user profile
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ wallet: string }> }
) {
  try {
    const supabase = getSupabaseClient()
    const { wallet } = await params
    const body = await request.json()

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      )
    }

    const {
      name,
      username,
      bio,
      email,
      avatar_url,
      twitter_url,
      website_url,
      linkedin_url,
      notification_email,
      notification_milestone,
      notification_updates,
      notification_marketing,
      privacy_public_profile,
      privacy_show_backed,
      privacy_show_nfts
    } = body

    // Build update object with only provided fields
    const updates: Record<string, any> = {}
    if (name !== undefined) updates.name = name
    if (username !== undefined) updates.username = username
    if (bio !== undefined) updates.bio = bio
    if (email !== undefined) updates.email = email
    if (avatar_url !== undefined) updates.avatar_url = avatar_url
    if (twitter_url !== undefined) updates.twitter_url = twitter_url
    if (website_url !== undefined) updates.website_url = website_url
    if (linkedin_url !== undefined) updates.linkedin_url = linkedin_url
    if (notification_email !== undefined) updates.notification_email = notification_email
    if (notification_milestone !== undefined) updates.notification_milestone = notification_milestone
    if (notification_updates !== undefined) updates.notification_updates = notification_updates
    if (notification_marketing !== undefined) updates.notification_marketing = notification_marketing
    if (privacy_public_profile !== undefined) updates.privacy_public_profile = privacy_public_profile
    if (privacy_show_backed !== undefined) updates.privacy_show_backed = privacy_show_backed
    if (privacy_show_nfts !== undefined) updates.privacy_show_nfts = privacy_show_nfts

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    updates.updated_at = new Date().toISOString()

    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
      .eq('wallet_address', wallet)
      .select()
      .single()

    if (error) {
      console.error('Failed to update user:', error)
      return NextResponse.json(
        { error: 'Failed to update user', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      user,
      message: 'Profile updated successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/users/[wallet] - Create user profile (upsert)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ wallet: string }> }
) {
  try {
    const supabase = getSupabaseClient()
    const { wallet } = await params
    const body = await request.json()

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      )
    }

    const {
      name,
      username,
      bio,
      email,
      avatar_url,
      user_type = 'backer'
    } = body

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    // Upsert - create if not exists, update if exists
    const { data: user, error } = await supabase
      .from('users')
      .upsert({
        wallet_address: wallet,
        name: name || null,
        username: username || null,
        bio: bio || null,
        email: email || null,
        avatar_url: avatar_url || null,
        user_type,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'wallet_address'
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create/update user:', error)
      return NextResponse.json(
        { error: 'Failed to create user', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      user,
      message: 'User profile saved'
    }, { status: 201 })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
