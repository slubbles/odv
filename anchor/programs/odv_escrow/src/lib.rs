use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod odv_escrow {
    use super::*;

    /// Initialize platform configuration (one-time, admin only)
    pub fn initialize_platform(
        ctx: Context<InitializePlatform>,
        fixed_backing_amount: u64, // Amount in USDC smallest units (1 USDC = 1_000_000)
    ) -> Result<()> {
        let platform_config = &mut ctx.accounts.platform_config;
        platform_config.admin = ctx.accounts.admin.key();
        platform_config.fixed_backing_amount = fixed_backing_amount;
        platform_config.total_campaigns = 0;
        platform_config.total_backers = 0;
        platform_config.bump = ctx.bumps.platform_config;
        Ok(())
    }

    /// Update fixed backing amount (admin only)
    pub fn update_backing_amount(
        ctx: Context<UpdatePlatformConfig>,
        new_amount: u64,
    ) -> Result<()> {
        let platform_config = &mut ctx.accounts.platform_config;
        platform_config.fixed_backing_amount = new_amount;
        Ok(())
    }

    pub fn initialize(
        ctx: Context<Initialize>, 
        goal: u64, 
        deadline: i64,
        milestones: Vec<MilestoneInput>
    ) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        campaign.creator = ctx.accounts.creator.key();
        campaign.goal = goal;
        campaign.deadline = deadline;
        campaign.raised = 0;
        campaign.backer_count = 0;
        campaign.current_milestone_index = 0;
        campaign.bump = ctx.bumps.campaign;

        // Initialize milestones
        let mut campaign_milestones = Vec::new();
        for m in milestones {
            campaign_milestones.push(Milestone {
                title: m.title,
                amount: m.amount,
                status: MilestoneStatus::Locked,
                votes_approve: 0,
                votes_dispute: 0,
            });
        }
        // Unlock first milestone if any
        if !campaign_milestones.is_empty() {
            campaign_milestones[0].status = MilestoneStatus::Active;
        }
        campaign.milestones = campaign_milestones;

        Ok(())
    }

    /// Creator submits proof for current active milestone
    pub fn submit_milestone_proof(
        ctx: Context<SubmitMilestoneProof>,
        _proof_url: String, // IPFS CID or URL to proof (stored off-chain for now)
    ) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        let index = campaign.current_milestone_index as usize;

        require!(index < campaign.milestones.len(), ErrorCode::NoMoreMilestones);
        
        let milestone = &mut campaign.milestones[index];
        require!(
            milestone.status == MilestoneStatus::Active,
            ErrorCode::MilestoneNotActive
        );

        // Store proof URL (in production, might store full struct with metadata)
        milestone.status = MilestoneStatus::InReview;
        
        // Note: proof_url is passed but not stored in current struct
        // In production, add proof_url field to Milestone struct
        
        Ok(())
    }

    /// Admin approves milestone after reviewing proof
    pub fn approve_milestone(
        ctx: Context<ApproveMilestone>,
    ) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        let platform_config = &ctx.accounts.platform_config;
        
        // Verify admin authority
        require!(
            ctx.accounts.admin.key() == platform_config.admin,
            ErrorCode::UnauthorizedAdmin
        );

        let index = campaign.current_milestone_index as usize;
        require!(index < campaign.milestones.len(), ErrorCode::NoMoreMilestones);
        
        let milestone = &mut campaign.milestones[index];
        require!(
            milestone.status == MilestoneStatus::InReview,
            ErrorCode::MilestoneNotInReview
        );

        milestone.status = MilestoneStatus::Approved;
        
        Ok(())
    }

    /// Admin rejects milestone and requires resubmission
    pub fn reject_milestone(
        ctx: Context<RejectMilestone>,
    ) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        let platform_config = &ctx.accounts.platform_config;
        
        require!(
            ctx.accounts.admin.key() == platform_config.admin,
            ErrorCode::UnauthorizedAdmin
        );

        let index = campaign.current_milestone_index as usize;
        require!(index < campaign.milestones.len(), ErrorCode::NoMoreMilestones);
        
        let milestone = &mut campaign.milestones[index];
        require!(
            milestone.status == MilestoneStatus::InReview,
            ErrorCode::MilestoneNotInReview
        );

        // Set back to Active so creator can resubmit
        milestone.status = MilestoneStatus::Active;
        
        Ok(())
    }

    pub fn fund(ctx: Context<Fund>) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        let platform_config = &ctx.accounts.platform_config;
        
        // Enforce fixed backing amount (e.g., $1 USDC = 1_000_000 smallest units)
        let amount = platform_config.fixed_backing_amount;
        
        // Transfer USDC from backer to campaign vault
        let cpi_context = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            anchor_spl::token::Transfer {
                from: ctx.accounts.backer_token_account.to_account_info(),
                to: ctx.accounts.campaign_vault.to_account_info(),
                authority: ctx.accounts.backer.to_account_info(),
            },
        );
        anchor_spl::token::transfer(cpi_context, amount)?;

        campaign.raised += amount;
        campaign.backer_count += 1;
        
        Ok(())
    }

    pub fn release_milestone(ctx: Context<ReleaseMilestone>) -> Result<()> {
        // Read values needed for validation and transfer (immutable borrows only)
        let index = ctx.accounts.campaign.current_milestone_index as usize;

        require!(index < ctx.accounts.campaign.milestones.len(), ErrorCode::NoMoreMilestones);
        require!(
            ctx.accounts.campaign.milestones[index].status == MilestoneStatus::Approved,
            ErrorCode::MilestoneNotApproved
        );

        let amount = ctx.accounts.campaign.milestones[index].amount;
        let creator_key = ctx.accounts.campaign.creator;
        let bump = ctx.accounts.campaign.bump;

        // Transfer funds to creator
        let seeds = &[
            b"campaign".as_ref(),
            creator_key.as_ref(),
            &[bump],
        ];
        let signer = &[&seeds[..]];

        let cpi_context = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            anchor_spl::token::Transfer {
                from: ctx.accounts.campaign_vault.to_account_info(),
                to: ctx.accounts.creator_token_account.to_account_info(),
                authority: ctx.accounts.campaign.to_account_info(),
            },
            signer,
        );
        anchor_spl::token::transfer(cpi_context, amount)?;

        // Now mutate campaign state after CPI is complete
        let campaign = &mut ctx.accounts.campaign;
        campaign.milestones[index].status = MilestoneStatus::Completed;
        campaign.current_milestone_index += 1;

        // Unlock next milestone
        let next_index = campaign.current_milestone_index as usize;
        if next_index < campaign.milestones.len() {
            campaign.milestones[next_index].status = MilestoneStatus::Active;
        }

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePlatform<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + 32 + 8 + 8 + 8 + 1,
        seeds = [b"platform_config"],
        bump
    )]
    pub platform_config: Account<'info, PlatformConfig>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdatePlatformConfig<'info> {
    #[account(
        mut,
        seeds = [b"platform_config"],
        bump = platform_config.bump,
        has_one = admin,
    )]
    pub platform_config: Account<'info, PlatformConfig>,
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init, 
        payer = creator, 
        space = 8 + 32 + 8 + 8 + 8 + 8 + 1 + 1 + (4 + 50 * 100), // Approximate space
        seeds = [b"campaign", creator.key().as_ref()],
        bump
    )]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitMilestoneProof<'info> {
    #[account(
        mut,
        seeds = [b"campaign", creator.key().as_ref()],
        bump = campaign.bump,
        has_one = creator,
    )]
    pub campaign: Account<'info, Campaign>,
    pub creator: Signer<'info>,
}

#[derive(Accounts)]
pub struct ApproveMilestone<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    #[account(
        seeds = [b"platform_config"],
        bump = platform_config.bump,
    )]
    pub platform_config: Account<'info, PlatformConfig>,
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct RejectMilestone<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    #[account(
        seeds = [b"platform_config"],
        bump = platform_config.bump,
    )]
    pub platform_config: Account<'info, PlatformConfig>,
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct Fund<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub campaign_vault: Account<'info, anchor_spl::token::TokenAccount>,
    #[account(mut)]
    pub backer: Signer<'info>,
    #[account(mut)]
    pub backer_token_account: Account<'info, anchor_spl::token::TokenAccount>,
    #[account(
        seeds = [b"platform_config"],
        bump = platform_config.bump,
    )]
    pub platform_config: Account<'info, PlatformConfig>,
    pub token_program: Program<'info, anchor_spl::token::Token>,
}

#[derive(Accounts)]
pub struct ReleaseMilestone<'info> {
    #[account(mut, has_one = creator)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub campaign_vault: Account<'info, anchor_spl::token::TokenAccount>,
    /// CHECK: Verified by has_one constraint
    #[account(mut)]
    pub creator: AccountInfo<'info>,
    #[account(mut)]
    pub creator_token_account: Account<'info, anchor_spl::token::TokenAccount>,
    pub token_program: Program<'info, anchor_spl::token::Token>,
}

#[account]
pub struct PlatformConfig {
    pub admin: Pubkey,                    // Platform admin who can update settings
    pub fixed_backing_amount: u64,        // Fixed amount per backing (e.g., 1_000_000 = $1 USDC)
    pub total_campaigns: u64,             // Total campaigns created
    pub total_backers: u64,               // Total unique backers
    pub bump: u8,
}

#[account]
pub struct Campaign {
    pub creator: Pubkey,
    pub goal: u64,
    pub raised: u64,
    pub deadline: i64,
    pub backer_count: u64,                // Number of backers for this campaign
    pub current_milestone_index: u8,
    pub milestones: Vec<Milestone>,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct Milestone {
    pub title: String,
    pub amount: u64,
    pub status: MilestoneStatus,
    pub votes_approve: u64,
    pub votes_dispute: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct MilestoneInput {
    pub title: String,
    pub amount: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum MilestoneStatus {
    Locked,
    Active,
    InReview,
    Approved,
    Completed,
    Disputed,
}

#[error_code]
pub enum ErrorCode {
    #[msg("No more milestones to release")]
    NoMoreMilestones,
    #[msg("Milestone is not approved yet")]
    MilestoneNotApproved,
    #[msg("Milestone is not in active state")]
    MilestoneNotActive,
    #[msg("Milestone is not in review state")]
    MilestoneNotInReview,
    #[msg("Unauthorized: Only admin can perform this action")]
    UnauthorizedAdmin,
}
