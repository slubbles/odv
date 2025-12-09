import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/api-client'
import { isAdminRequest } from '@/lib/auth/admin-api'
import { notifyProjectApproved } from '@/lib/notifications'
import { getCampaignAddress } from '@/lib/solana/admin-operations'

// POST /api/admin/projects/[id]/approve - Approve project
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
    const { launchDate, notes, initializeTxSignature, campaignPda: providedCampaignPda } = body

    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // First, get the project to get creator wallet
    const { data: existingProject } = await supabase
      .from('projects')
      .select('creator_wallet, title, goal, deadline, milestones')
      .eq('id', id)
      .single()

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Use provided campaign PDA or generate one
    let campaignPda = providedCampaignPda
    if (!campaignPda) {
      try {
        campaignPda = getCampaignAddress(existingProject.creator_wallet)
      } catch (err) {
        console.warn('Could not generate campaign PDA:', err)
      }
    }

    const updateData: Record<string, any> = {
      status: 'active',
      launch_date: launchDate || new Date().toISOString(),
    }

    if (notes) {
      updateData.admin_notes = notes
    }

    // Store campaign PDA if available
    if (campaignPda) {
      updateData.campaign_pda = campaignPda
    }

    // Store initialization transaction signature if provided
    if (initializeTxSignature) {
      updateData.initialize_tx = initializeTxSignature
    }

    const { data: project, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Notify creator of approval
    await notifyProjectApproved(
      existingProject.creator_wallet,
      id,
      existingProject.title
    )

    return NextResponse.json({
      success: true,
      project,
      campaignPda,
      initializeTxSignature,
      message: initializeTxSignature 
        ? 'Project approved and campaign initialized on-chain'
        : 'Project approved (off-chain only)',
    })
  } catch (error: any) {
    console.error('Approve project error:', error)
    return NextResponse.json(
      { error: 'Failed to approve project', details: error.message },
      { status: 500 }
    )
  }
}
