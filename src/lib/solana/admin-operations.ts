import {
    Connection,
    PublicKey,
    Transaction,
    TransactionInstruction,
    Keypair,
    SystemProgram,
} from '@solana/web3.js';
import {
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { PROGRAM_ID, PLATFORM_CONFIG_SEED, RPC_ENDPOINT } from './config';
import { getCampaignPDA, getCampaignVaultPDA } from './program';
import { USDC_MINT_ADDRESS } from './transaction';

// Instruction discriminators from IDL
const INITIALIZE_DISCRIMINATOR = Buffer.from([175, 175, 109, 31, 13, 152, 155, 237]);
const APPROVE_MILESTONE_DISCRIMINATOR = Buffer.from([145, 85, 92, 60, 50, 130, 219, 106]);
const REJECT_MILESTONE_DISCRIMINATOR = Buffer.from([171, 88, 116, 135, 147, 125, 224, 14]);
const RELEASE_MILESTONE_DISCRIMINATOR = Buffer.from([156, 23, 72, 103, 147, 147, 137, 134]);

/**
 * Get Platform Config PDA
 */
export function getPlatformConfigPDA(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from(PLATFORM_CONFIG_SEED)],
        PROGRAM_ID
    );
}

/**
 * Fetch next campaign ID from on-chain platform config
 */
export async function getNextCampaignId(connection: Connection): Promise<number> {
    const [platformConfigPDA] = getPlatformConfigPDA();
    
    const accountInfo = await connection.getAccountInfo(platformConfigPDA);
    if (!accountInfo) {
        throw new Error('Platform config not found. Platform may not be initialized.');
    }
    
    // Platform config layout (simplified - only reading next_campaign_id):
    // admin: Pubkey (32 bytes)
    // fixed_backing_amount: u64 (8 bytes)
    // total_campaigns: u64 (8 bytes)
    // total_backers: u64 (8 bytes)
    // next_campaign_id: u64 (8 bytes) at offset 56
    // paused: bool (1 byte)
    // bump: u8 (1 byte)
    
    const data = accountInfo.data;
    const nextCampaignId = data.readBigUInt64LE(56); // offset 56 for next_campaign_id
    
    return Number(nextCampaignId);
}

/**
 * Serialize a string for Borsh (4 bytes length prefix + UTF-8 bytes)
 */
function serializeString(str: string): Buffer {
    const strBytes = Buffer.from(str, 'utf-8');
    const lenBuffer = Buffer.alloc(4);
    lenBuffer.writeUInt32LE(strBytes.length, 0);
    return Buffer.concat([lenBuffer, strBytes]);
}

/**
 * Serialize MilestoneInput for the initialize instruction
 */
function serializeMilestones(milestones: Array<{ title: string; amount: number }>): Buffer {
    // Vec length (4 bytes)
    const lenBuffer = Buffer.alloc(4);
    lenBuffer.writeUInt32LE(milestones.length, 0);
    
    const milestoneBuffers = milestones.map(m => {
        const titleBytes = serializeString(m.title);
        const amountBuffer = Buffer.alloc(8);
        amountBuffer.writeBigUInt64LE(BigInt(m.amount), 0);
        return Buffer.concat([titleBytes, amountBuffer]);
    });
    
    return Buffer.concat([lenBuffer, ...milestoneBuffers]);
}

/**
 * Create initialize campaign transaction
 * Called when admin approves a project
 */
export async function createInitializeCampaignTransaction(
    connection: Connection,
    creatorPublicKey: PublicKey,
    campaignId: number,
    goal: number,
    deadline: number, // Unix timestamp
    milestones: Array<{ title: string; amount: number }>
): Promise<Transaction> {
    const transaction = new Transaction();
    
    // Derive PDAs
    const [campaignPDA] = getCampaignPDA(creatorPublicKey, campaignId);
    const [platformConfigPDA] = getPlatformConfigPDA();
    
    // Serialize instruction data
    // discriminator (8) + goal (8) + deadline (8) + milestones (variable)
    const goalBuffer = Buffer.alloc(8);
    goalBuffer.writeBigUInt64LE(BigInt(goal), 0);
    
    const deadlineBuffer = Buffer.alloc(8);
    deadlineBuffer.writeBigInt64LE(BigInt(deadline), 0);
    
    const milestonesBuffer = serializeMilestones(milestones);
    
    const instructionData = Buffer.concat([
        INITIALIZE_DISCRIMINATOR,
        goalBuffer,
        deadlineBuffer,
        milestonesBuffer,
    ]);
    
    const initializeInstruction = new TransactionInstruction({
        keys: [
            { pubkey: campaignPDA, isSigner: false, isWritable: true },
            { pubkey: creatorPublicKey, isSigner: true, isWritable: true },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        programId: PROGRAM_ID,
        data: instructionData,
    });
    
    transaction.add(initializeInstruction);
    
    // Set transaction metadata
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = creatorPublicKey;
    
    return transaction;
}

/**
 * Create approve milestone transaction
 * Called when admin approves a milestone after reviewing proof
 */
export async function createApproveMilestoneTransaction(
    connection: Connection,
    adminPublicKey: PublicKey,
    creatorPublicKey: PublicKey,
    campaignId: number
): Promise<Transaction> {
    const transaction = new Transaction();
    
    // Derive PDAs
    const [campaignPDA] = getCampaignPDA(creatorPublicKey, campaignId);
    const [platformConfigPDA] = getPlatformConfigPDA();
    
    const approveMilestoneInstruction = new TransactionInstruction({
        keys: [
            { pubkey: campaignPDA, isSigner: false, isWritable: true },
            { pubkey: platformConfigPDA, isSigner: false, isWritable: false },
            { pubkey: adminPublicKey, isSigner: true, isWritable: false },
        ],
        programId: PROGRAM_ID,
        data: APPROVE_MILESTONE_DISCRIMINATOR,
    });
    
    transaction.add(approveMilestoneInstruction);
    
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = adminPublicKey;
    
    return transaction;
}

/**
 * Create reject milestone transaction
 */
export async function createRejectMilestoneTransaction(
    connection: Connection,
    adminPublicKey: PublicKey,
    creatorPublicKey: PublicKey,
    campaignId: number
): Promise<Transaction> {
    const transaction = new Transaction();
    
    const [campaignPDA] = getCampaignPDA(creatorPublicKey, campaignId);
    const [platformConfigPDA] = getPlatformConfigPDA();
    
    const rejectMilestoneInstruction = new TransactionInstruction({
        keys: [
            { pubkey: campaignPDA, isSigner: false, isWritable: true },
            { pubkey: platformConfigPDA, isSigner: false, isWritable: false },
            { pubkey: adminPublicKey, isSigner: true, isWritable: false },
        ],
        programId: PROGRAM_ID,
        data: REJECT_MILESTONE_DISCRIMINATOR,
    });
    
    transaction.add(rejectMilestoneInstruction);
    
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = adminPublicKey;
    
    return transaction;
}

/**
 * Create release milestone transaction
 * Called after milestone is approved to release funds to creator
 */
export async function createReleaseMilestoneTransaction(
    connection: Connection,
    creatorPublicKey: PublicKey,
    campaignId: number
): Promise<Transaction> {
    const transaction = new Transaction();
    
    // Derive PDAs
    const [campaignPDA] = getCampaignPDA(creatorPublicKey, campaignId);
    const [campaignVaultPDA] = getCampaignVaultPDA(campaignPDA);
    const [platformConfigPDA] = getPlatformConfigPDA();
    
    // Get ATAs
    const campaignVaultAta = await getAssociatedTokenAddress(
        USDC_MINT_ADDRESS,
        campaignVaultPDA,
        true // allowOwnerOffCurve for PDA
    );
    
    const creatorAta = await getAssociatedTokenAddress(
        USDC_MINT_ADDRESS,
        creatorPublicKey
    );
    
    const releaseMilestoneInstruction = new TransactionInstruction({
        keys: [
            { pubkey: campaignPDA, isSigner: false, isWritable: true },
            { pubkey: campaignVaultAta, isSigner: false, isWritable: true },
            { pubkey: creatorPublicKey, isSigner: true, isWritable: true },
            { pubkey: creatorAta, isSigner: false, isWritable: true },
            { pubkey: platformConfigPDA, isSigner: false, isWritable: false },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        ],
        programId: PROGRAM_ID,
        data: RELEASE_MILESTONE_DISCRIMINATOR,
    });
    
    transaction.add(releaseMilestoneInstruction);
    
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = creatorPublicKey;
    
    return transaction;
}

/**
 * Get connection to SOON Network
 */
export function getSoonConnection(): Connection {
    return new Connection(RPC_ENDPOINT, 'confirmed');
}

/**
 * Check if campaign exists on-chain
 */
export async function campaignExists(
    connection: Connection,
    creatorPublicKey: PublicKey,
    campaignId: number
): Promise<boolean> {
    const [campaignPDA] = getCampaignPDA(creatorPublicKey, campaignId);
    const accountInfo = await connection.getAccountInfo(campaignPDA);
    return accountInfo !== null;
}

/**
 * Get campaign PDA address for a creator
 */
export function getCampaignAddress(creatorWallet: string, campaignId: number): string {
    const creatorPublicKey = new PublicKey(creatorWallet);
    const [campaignPDA] = getCampaignPDA(creatorPublicKey, campaignId);
    return campaignPDA.toBase58();
}
