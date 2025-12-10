use anchor_lang::prelude::*;

declare_id!("2NZKEk8zk47UAc27f7DScFgxpqyy22VptWVwBUjFfQxC");

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
        platform_config.next_campaign_id = 0;
        platform_config.paused = false;
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

    /// Pause platform (emergency stop, admin only)
    pub fn pause_platform(
        ctx: Context<UpdatePlatformConfig>,
    ) -> Result<()> {
        let platform_config = &mut ctx.accounts.platform_config;
        platform_config.paused = true;
        Ok(())
    }

    /// Unpause platform (admin only)
    pub fn unpause_platform(
        ctx: Context<UpdatePlatformConfig>,
    ) -> Result<()> {
        let platform_config = &mut ctx.accounts.platform_config;
        platform_config.paused = false;
        Ok(())
    }

    pub fn initialize(
        ctx: Context<Initialize>,
        campaign_id: u64,
        goal: u64, 
        deadline: i64,
        milestones: Vec<MilestoneInput>
    ) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        campaign.creator = ctx.accounts.creator.key();
        campaign.campaign_id = campaign_id;
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
                proof_url: None,
                submitted_at: None,
                votes_approve: 0,
                votes_dispute: 0,
            });
        }
        // Unlock first milestone if any
        if !campaign_milestones.is_empty() {
            campaign_milestones[0].status = MilestoneStatus::Active;
        }
        campaign.milestones = campaign_milestones;

        // Increment platform campaign counter
        let platform_config = &mut ctx.accounts.platform_config;
        platform_config.total_campaigns += 1;
        platform_config.next_campaign_id += 1;

        Ok(())
    }

    /// Creator submits proof for current active milestone
    pub fn submit_milestone_proof(
        ctx: Context<SubmitMilestoneProof>,
        campaign_id: u64,
        proof_url: String, // IPFS CID or URL to proof
    ) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        let platform_config = &ctx.accounts.platform_config;
        
        require!(!platform_config.paused, ErrorCode::PlatformPaused);
        
        let index = campaign.current_milestone_index as usize;

        require!(index < campaign.milestones.len(), ErrorCode::NoMoreMilestones);
        
        let milestone = &mut campaign.milestones[index];
        require!(
            milestone.status == MilestoneStatus::Active,
            ErrorCode::MilestoneNotActive
        );

        // Store proof URL and submission timestamp
        milestone.proof_url = Some(proof_url);
        milestone.submitted_at = Some(Clock::get()?.unix_timestamp);
        milestone.status = MilestoneStatus::InReview;
        
        Ok(())
    }

    /// Admin approves milestone after reviewing proof
    pub fn approve_milestone(
        ctx: Context<ApproveMilestone>,
        campaign_id: u64,
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
        campaign_id: u64,
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

    pub fn fund(ctx: Context<Fund>, campaign_id: u64) -> Result<()> {
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

    pub fn release_milestone(ctx: Context<ReleaseMilestone>, campaign_id: u64) -> Result<()> {
        let platform_config = &ctx.accounts.platform_config;
        
        // Security: Platform must not be paused
        require!(!platform_config.paused, ErrorCode::PlatformPaused);
        
        // Security: Only creator can release funds
        require!(
            ctx.accounts.creator.key() == ctx.accounts.campaign.creator,
            ErrorCode::UnauthorizedWithdrawal
        );
        
        // Security: Goal must be reached before releasing funds
        require!(
            ctx.accounts.campaign.raised >= ctx.accounts.campaign.goal,
            ErrorCode::GoalNotReached
        );
        
        // Read values needed for validation and transfer (immutable borrows only)
        let index = ctx.accounts.campaign.current_milestone_index as usize;

        require!(index < ctx.accounts.campaign.milestones.len(), ErrorCode::NoMoreMilestones);
        require!(
            ctx.accounts.campaign.milestones[index].status == MilestoneStatus::Approved,
            ErrorCode::MilestoneNotApproved
        );

        let amount = ctx.accounts.campaign.milestones[index].amount;
        let creator_key = ctx.accounts.campaign.creator;
        let campaign_id_val = ctx.accounts.campaign.campaign_id;
        let bump = ctx.accounts.campaign.bump;

        // Transfer funds to creator
        let seeds = &[
            b"campaign".as_ref(),
            creator_key.as_ref(),
            &campaign_id_val.to_le_bytes(),
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

    /// Close a campaign and reclaim rent
    pub fn close_campaign(ctx: Context<CloseCampaign>) -> Result<()> {
        let campaign = &ctx.accounts.campaign;
        let clock = Clock::get()?;
        
        // Only allow closing if:
        // 1. No backers yet (pre-launch cancellation)
        // 2. Failed to reach goal and deadline passed (refund scenario)
        // 3. All milestones completed (successful completion)
        
        require!(
            campaign.backer_count == 0 || 
            (campaign.raised < campaign.goal && clock.unix_timestamp > campaign.deadline) ||
            (campaign.current_milestone_index as usize >= campaign.milestones.len()),
            ErrorCode::CannotCloseCampaign
        );
        
        Ok(())
    }

    /// Refund all backers if campaign fails to reach goal by deadline
    pub fn refund_campaign(
        ctx: Context<RefundCampaign>,
        campaign_id: u64,
    ) -> Result<()> {
        let campaign = &ctx.accounts.campaign;
        let clock = Clock::get()?;
        
        // Check deadline has passed
        require!(
            clock.unix_timestamp > campaign.deadline,
            ErrorCode::DeadlineNotReached
        );
        
        // Check goal was not met
        require!(
            campaign.raised < campaign.goal,
            ErrorCode::GoalAlreadyReached
        );
        
        let amount = ctx.accounts.platform_config.fixed_backing_amount;
        let creator_key = campaign.creator;
        let campaign_id_val = campaign.campaign_id;
        let bump = campaign.bump;
        
        // Transfer refund to backer
        let seeds = &[
            b"campaign".as_ref(),
            creator_key.as_ref(),
            &campaign_id_val.to_le_bytes(),
            &[bump],
        ];
        let signer = &[&seeds[..]];

        let cpi_context = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            anchor_spl::token::Transfer {
                from: ctx.accounts.campaign_vault.to_account_info(),
                to: ctx.accounts.backer_token_account.to_account_info(),
                authority: ctx.accounts.campaign.to_account_info(),
            },
            signer,
        );
        anchor_spl::token::transfer(cpi_context, amount)?;
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePlatform<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + 32 + 8 + 8 + 8 + 8 + 1 + 1,
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
#[instruction(campaign_id: u64)]
pub struct Initialize<'info> {
    #[account(
        init, 
        payer = creator, 
        space = 8 + 32 + 8 + 8 + 8 + 8 + 8 + 1 + 1 + (4 + 50 * 100), // Added 8 for campaign_id
        seeds = [b"campaign", creator.key().as_ref(), &campaign_id.to_le_bytes()],
        bump
    )]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(
        mut,
        seeds = [b"platform_config"],
        bump = platform_config.bump,
    )]
    pub platform_config: Account<'info, PlatformConfig>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(campaign_id: u64)]
pub struct SubmitMilestoneProof<'info> {
    #[account(
        mut,
        seeds = [b"campaign", creator.key().as_ref(), &campaign_id.to_le_bytes()],
        bump = campaign.bump,
        has_one = creator,
    )]
    pub campaign: Account<'info, Campaign>,
    pub creator: Signer<'info>,
    #[account(
        seeds = [b"platform_config"],
        bump = platform_config.bump,
    )]
    pub platform_config: Account<'info, PlatformConfig>,
}

#[derive(Accounts)]
#[instruction(campaign_id: u64)]
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
#[instruction(campaign_id: u64)]
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
#[instruction(campaign_id: u64)]
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
#[instruction(campaign_id: u64)]
pub struct ReleaseMilestone<'info> {
    #[account(mut, has_one = creator)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub campaign_vault: Account<'info, anchor_spl::token::TokenAccount>,
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(mut)]
    pub creator_token_account: Account<'info, anchor_spl::token::TokenAccount>,
    #[account(
        seeds = [b"platform_config"],
        bump = platform_config.bump,
    )]
    pub platform_config: Account<'info, PlatformConfig>,
    pub token_program: Program<'info, anchor_spl::token::Token>,
}

#[derive(Accounts)]
#[instruction(campaign_id: u64)]
pub struct RefundCampaign<'info> {
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
#[instruction(campaign_id: u64)]
pub struct CloseCampaign<'info> {
    #[account(
        mut,
        close = creator,
        seeds = [b"campaign", creator.key().as_ref(), &campaign_id.to_le_bytes()],
        bump = campaign.bump,
        has_one = creator,
    )]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub creator: Signer<'info>,
}

#[account]
pub struct PlatformConfig {
    pub admin: Pubkey,                    // Platform admin who can update settings
    pub fixed_backing_amount: u64,        // Fixed amount per backing (e.g., 1_000_000 = $1 USDC)
    pub total_campaigns: u64,             // Total campaigns created
    pub total_backers: u64,               // Total unique backers
    pub next_campaign_id: u64,            // Next campaign ID to assign
    pub paused: bool,                     // Emergency pause flag
    pub bump: u8,
}

#[account]
pub struct Campaign {
    pub creator: Pubkey,
    pub campaign_id: u64,                 // Unique campaign ID
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
    pub proof_url: Option<String>,
    pub submitted_at: Option<i64>,
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
    #[msg("Unauthorized: Only creator can withdraw funds")]
    UnauthorizedWithdrawal,
    #[msg("Goal not reached: Cannot release funds until funding goal is met")]
    GoalNotReached,
    #[msg("Platform is paused: Operations are temporarily disabled")]
    PlatformPaused,
    #[msg("Deadline not reached: Cannot refund until campaign deadline passes")]
    DeadlineNotReached,
    #[msg("Goal already reached: Cannot refund successful campaign")]
    GoalAlreadyReached,
    #[msg("Cannot close campaign: Has active backers or goal reached")]
    CannotCloseCampaign,
}
