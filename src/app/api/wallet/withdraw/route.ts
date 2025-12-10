import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/api-client'
import { Connection, PublicKey } from '@solana/web3.js'
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { USDC_MINT_ADDRESS } from '@/lib/solana/transaction'
import { getCampaignPDA, getCampaignVaultPDA } from '@/lib/solana/program'
import { RPC_ENDPOINT } from '@/lib/solana/config'

// POST /api/wallet/withdraw - Withdraw funds (for creators after milestone approval)
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const body = await request.json()
    const { walletAddress, amount, projectId, milestoneId } = body

    if (!walletAddress || !amount) {
      return NextResponse.json(
        { error: 'Wallet address and amount required' },
        { status: 400 }
      )
    }

    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Verify the withdrawal is authorized and get campaign_id
    let campaignId: number | null = null
    
    if (projectId) {
      // Check if this is a valid project withdrawal
      const { data: project } = await supabase
        .from('projects')
        .select('creator_wallet, status, raised, campaign_id')
        .eq('id', projectId)
        .single()

      if (!project) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        )
      }

      if (project.creator_wallet !== walletAddress) {
        return NextResponse.json(
          { error: 'Unauthorized: Only project creator can withdraw' },
          { status: 403 }
        )
      }

      if (project.status !== 'active' && project.status !== 'completed') {
        return NextResponse.json(
          { error: 'Project must be active or completed to withdraw' },
          { status: 400 }
        )
      }

      campaignId = project.campaign_id
    }

    if (campaignId === null) {
      return NextResponse.json(
        { error: 'Campaign ID not found. Project may not be initialized on-chain.' },
        { status: 400 }
      )
    }

    // Calculate the on-chain vault and creator ATAs
    const creatorPublicKey = new PublicKey(walletAddress)
    const [campaignPDA] = getCampaignPDA(creatorPublicKey, campaignId)
    const [campaignVaultPDA] = getCampaignVaultPDA(campaignPDA)
    
    const vaultAta = await getAssociatedTokenAddress(
      USDC_MINT_ADDRESS,
      campaignVaultPDA,
      true // allowOwnerOffCurve for PDA
    )
    
    const creatorAta = await getAssociatedTokenAddress(
      USDC_MINT_ADDRESS,
      creatorPublicKey
    )

    // Check vault balance on-chain
    const connection = new Connection(RPC_ENDPOINT, 'confirmed')
    let vaultBalance = 0
    try {
      const vaultAccount = await connection.getTokenAccountBalance(vaultAta)
      vaultBalance = parseInt(vaultAccount.value.amount)
    } catch (err) {
      console.warn('Could not fetch vault balance:', err)
    }

    // Record the withdrawal transaction (pending - user must sign on client)
    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert({
        type: 'withdrawal',
        from_wallet: campaignVaultPDA.toBase58(),
        to_wallet: walletAddress,
        amount,
        project_id: projectId,
        tx_signature: `pending_withdrawal_${Date.now()}`,
        status: 'pending',
        metadata: {
          milestone_id: milestoneId,
          vault_ata: vaultAta.toBase58(),
          creator_ata: creatorAta.toBase58(),
          vault_balance: vaultBalance,
        }
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      transaction,
      vaultInfo: {
        campaignPda: campaignPDA.toBase58(),
        vaultPda: campaignVaultPDA.toBase58(),
        vaultAta: vaultAta.toBase58(),
        creatorAta: creatorAta.toBase58(),
        vaultBalance,
      },
      message: 'Withdrawal prepared. Please sign the transaction on the client.',
    })
  } catch (error: any) {
    console.error('Withdraw error:', error)
    return NextResponse.json(
      { error: 'Failed to prepare withdrawal', details: error.message },
      { status: 500 }
    )
  }
}
