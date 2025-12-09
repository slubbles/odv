import { PublicKey } from '@solana/web3.js';

// Program ID from our Anchor.toml (replace if you deploy with different ID)
export const ODV_ESCROW_PROGRAM_ID = new PublicKey(
    'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS'
);

// Seeds for PDA derivation
export const CAMPAIGN_SEED = 'campaign';
export const CAMPAIGN_VAULT_SEED = 'campaign_vault';

// Derive Campaign PDA
export function getCampaignPDA(creatorPublicKey: PublicKey): [PublicKey, number] {
    const [pda, bump] = PublicKey.findProgramAddressSync(
        [
            Buffer.from(CAMPAIGN_SEED),
            creatorPublicKey.toBuffer(),
        ],
        ODV_ESCROW_PROGRAM_ID
    );
    return [pda, bump];
}

// Derive Campaign Vault PDA (for holding USDC)
export function getCampaignVaultPDA(campaignPDA: PublicKey): [PublicKey, number] {
    const [pda, bump] = PublicKey.findProgramAddressSync(
        [
            Buffer.from(CAMPAIGN_VAULT_SEED),
            campaignPDA.toBuffer(),
        ],
        ODV_ESCROW_PROGRAM_ID
    );
    return [pda, bump];
}

// TypeScript types matching our Rust structs
export enum MilestoneStatus {
    Locked = 'locked',
    Active = 'active',
    InReview = 'inReview',
    Approved = 'approved',
    Completed = 'completed',
    Disputed = 'disputed',
}

export interface Milestone {
    title: string;
    amount: number;
    status: MilestoneStatus;
    votesApprove: number;
    votesDispute: number;
}

export interface Campaign {
    creator: PublicKey;
    goal: number;
    raised: number;
    deadline: number;
    currentMilestoneIndex: number;
    milestones: Milestone[];
    bump: number;
}
