import { PublicKey } from '@solana/web3.js';

// SOON Testnet Program ID (Deployed December 10, 2025 - with campaign_id support)
export const ODV_ESCROW_PROGRAM_ID = new PublicKey(
    '2NZKEk8zk47UAc27f7DScFgxpqyy22VptWVwBUjFfQxC'
);

// Seeds for PDA derivation
export const CAMPAIGN_SEED = 'campaign';
export const CAMPAIGN_VAULT_SEED = 'campaign_vault';

// Derive Campaign PDA with campaign_id
export function getCampaignPDA(creatorPublicKey: PublicKey, campaignId: number): [PublicKey, number] {
    const campaignIdBuffer = Buffer.alloc(8);
    campaignIdBuffer.writeBigUInt64LE(BigInt(campaignId), 0);
    
    console.log('[getCampaignPDA] 🧮 Computing PDA with seeds:', {
        seed: CAMPAIGN_SEED,
        creator: creatorPublicKey.toString().slice(0, 8) + '...',
        campaignId,
        campaignIdBuffer: campaignIdBuffer.toString('hex')
    });
    
    const [pda, bump] = PublicKey.findProgramAddressSync(
        [
            Buffer.from(CAMPAIGN_SEED),
            creatorPublicKey.toBuffer(),
            campaignIdBuffer,
        ],
        ODV_ESCROW_PROGRAM_ID
    );
    
    console.log('[getCampaignPDA] ✅ PDA computed:', {
        pda: pda.toString(),
        bump
    });
    
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
    campaignId: number;
    goal: number;
    raised: number;
    deadline: number;
    currentMilestoneIndex: number;
    milestones: Milestone[];
    bump: number;
}

// Get Platform Config PDA
function getPlatformConfigPDA(): [PublicKey, number] {
    const [pda, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from('platform_config')],
        ODV_ESCROW_PROGRAM_ID
    );
    return [pda, bump];
}

// Get next campaign ID from platform config
export async function getNextCampaignId(connection: any): Promise<number> {
    const [platformConfigPDA] = getPlatformConfigPDA();
    
    const accountInfo = await connection.getAccountInfo(platformConfigPDA);
    if (!accountInfo) {
        throw new Error('Platform config not initialized');
    }
    
    // Decode next_campaign_id from account data
    // Account layout: 8 (discriminator) + 32 (admin) + 8 (fixed_backing) + 8 (total_campaigns) + 8 (total_backers) + 8 (next_campaign_id)
    const dataView = new DataView(accountInfo.data.buffer, accountInfo.data.byteOffset);
    const nextCampaignId = Number(dataView.getBigUint64(64, true)); // offset 64 bytes
    
    return nextCampaignId;
}

// List all campaigns for a creator
export async function getCreatorCampaigns(
    connection: any,
    creatorPublicKey: PublicKey,
    maxCampaigns: number = 100
): Promise<Array<{ pda: PublicKey; campaignId: number; bump: number; exists: boolean }>> {
    const campaigns = [];
    
    for (let i = 0; i < maxCampaigns; i++) {
        const [pda, bump] = getCampaignPDA(creatorPublicKey, i);
        const accountInfo = await connection.getAccountInfo(pda);
        
        campaigns.push({
            pda,
            campaignId: i,
            bump,
            exists: accountInfo !== null
        });
        
        // Stop checking after we find 10 consecutive non-existent campaigns
        if (accountInfo === null && i > 0) {
            const lastTen = campaigns.slice(-10);
            if (lastTen.every(c => !c.exists)) {
                break;
            }
        }
    }
    
    return campaigns.filter(c => c.exists);
}

