use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod odv_escrow {
    use super::*;

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
        campaign.current_milestone_index = 0;
        campaign.bump = *ctx.bumps.get("campaign").unwrap();

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

    pub fn fund(ctx: Context<Fund>, amount: u64) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        
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
        
        // Record backing (simplified for MVP, ideally would have a Backer account)
        
        Ok(())
    }

    pub fn release_milestone(ctx: Context<ReleaseMilestone>) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        let index = campaign.current_milestone_index as usize;

        require!(index < campaign.milestones.len(), ErrorCode::NoMoreMilestones);
        
        let milestone = &mut campaign.milestones[index];
        require!(milestone.status == MilestoneStatus::Approved, ErrorCode::MilestoneNotApproved);

        // Transfer funds to creator
        let seeds = &[
            b"campaign".as_ref(),
            campaign.creator.as_ref(),
            &[campaign.bump],
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
        anchor_spl::token::transfer(cpi_context, milestone.amount)?;

        milestone.status = MilestoneStatus::Completed;
        campaign.current_milestone_index += 1;

        // Unlock next milestone
        if campaign.current_milestone_index < campaign.milestones.len() as u8 {
            campaign.milestones[campaign.current_milestone_index as usize].status = MilestoneStatus::Active;
        }

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init, 
        payer = creator, 
        space = 8 + 32 + 8 + 8 + 8 + 1 + 1 + (4 + 50 * 100), // Approximate space
        seeds = [b"campaign", creator.key().as_ref()],
        bump
    )]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
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
pub struct Campaign {
    pub creator: Pubkey,
    pub goal: u64,
    pub raised: u64,
    pub deadline: i64,
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
}
