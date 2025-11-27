import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET /api/settings - Get user settings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const wallet = searchParams.get('wallet')

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      )
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('notification_preferences, privacy_settings, email, email_verified')
      .eq('wallet_address', wallet)
      .single()

    if (error) throw error

    return NextResponse.json({
      settings: user || {},
    })
  } catch (error: any) {
    console.error('Get settings error:', error)
    return NextResponse.json(
      { error: 'Failed to get settings', details: error.message },
      { status: 500 }
    )
  }
}

// PATCH /api/settings - Update user settings
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { wallet, notificationPreferences, privacySettings, email } = body

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (notificationPreferences) updateData.notification_preferences = notificationPreferences
    if (privacySettings) updateData.privacy_settings = privacySettings
    if (email !== undefined) updateData.email = email

    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('wallet_address', wallet)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error: any) {
    console.error('Update settings error:', error)
    return NextResponse.json(
      { error: 'Failed to update settings', details: error.message },
      { status: 500 }
    )
  }
}
