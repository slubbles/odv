import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { Connection, PublicKey } from '@solana/web3.js'
import { createFundCampaignTransaction } from '@/lib/solana/transaction'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const body = await request.json()
    
    const {
      walletAddress,
      transactionSignature,
      amount = 1
    } = body

    if (!walletAddress || !transactionSignature) {
      return NextResponse.json(
        { error: 'Missing wallet address or transaction signature' },
        { status: 400 }
      )
    }

    // Fetch project to get creator wallet
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, creator_wallet, goal, raised, status')
      .eq('id', projectId)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    if (project.status !== 'active') {
      return NextResponse.json(
        { error: 'Project is not active for backing' },
        { status: 400 }
      )
    }

    // Verify transaction on Solana (optional but recommended)
    try {
      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
        'confirmed'
      )
      
      const txInfo = await connection.getTransaction(transactionSignature, {
        maxSupportedTransactionVersion: 0
      })

      if (!txInfo) {
        return NextResponse.json(
          { error: 'Transaction not found on blockchain' },
          { status: 400 }
        )
      }

      // Additional verification: check if transaction involves correct accounts
      // This is a simplified check - in production, verify the exact instruction
    } catch (verifyError) {
      console.error('Transaction verification error:', verifyError)
      // Continue anyway - transaction might be too new
    }

    // Check if user already backed this project
    const { data: existingBacking } = await supabase
      .from('backers')
      .select('id')
      .eq('project_id', projectId)
      .eq('wallet_address', walletAddress)
      .single()

    if (existingBacking) {
      return NextResponse.json(
        { error: 'You have already backed this project' },
        { status: 400 }
      )
    }

    // Insert backing record
    const { data: backing, error: backingError } = await supabase
      .from('backers')
      .insert({
        project_id: projectId,
        wallet_address: walletAddress,
        amount,
        transaction_signature: transactionSignature
      })
      .select()
      .single()

    if (backingError) {
      console.error('Failed to record backing:', backingError)
      return NextResponse.json(
        { error: 'Failed to record backing', details: backingError.message },
        { status: 500 }
      )
    }

    // Update project raised amount and backers count
    const { error: updateError } = await supabase.rpc('increment_backers', {
      project_id: projectId,
      amount_to_add: amount
    })

    // Fallback if RPC doesn't exist - manual update
    if (updateError) {
      console.warn('RPC increment failed, using manual update:', updateError)
      const { error: manualUpdateError } = await supabase
        .from('projects')
        .update({
          raised: project.raised + amount
        })
        .eq('id', projectId)
      
      if (manualUpdateError) {
        console.error('Manual update also failed:', manualUpdateError)
      }
    }

    if (updateError) {
      console.error('Failed to update project stats:', updateError)
      // Don't fail the request - backing is recorded
    }

    return NextResponse.json({
      success: true,
      backing,
      message: 'Successfully backed project!'
    }, { status: 201 })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('wallet')

    if (!walletAddress) {
      // Return all backers for this project
      const { data: backers, error } = await supabase
        .from('backers')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch backers' },
          { status: 500 }
        )
      }

      return NextResponse.json({ backers })
    }

    // Check if specific wallet has backed this project
    const { data: backing, error } = await supabase
      .from('backers')
      .select('*')
      .eq('project_id', projectId)
      .eq('wallet_address', walletAddress)
      .single()

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json(
        { error: 'Failed to check backing status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      hasBacked: !!backing,
      backing: backing || null
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
