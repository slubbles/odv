import {
    Connection,
    PublicKey,
    Transaction,
    TransactionInstruction,
    SystemProgram,
    LAMPORTS_PER_SOL
} from '@solana/web3.js';
import {
    createTransferInstruction,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    getAccount,
    TokenAccountNotFoundError,
    TokenInvalidAccountOwnerError,
    TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import * as borsh from '@coral-xyz/borsh';
import { BN } from '@coral-xyz/anchor';
import { getCampaignPDA, getCampaignVaultPDA, ODV_ESCROW_PROGRAM_ID } from './program';
import { PROGRAM_ID, PLATFORM_CONFIG_SEED } from './config';
import { getExplorerTransactionUrl, isSoonNetwork } from './network-utils';

// USDC Mint Address on SOON Testnet (Test USDC - can be overridden via env var)
export const USDC_MINT_ADDRESS = new PublicKey(
    process.env.NEXT_PUBLIC_USDC_MINT || "3PNhmxDckddYL24zEfrsHLFLXXvrdzBBoZgfRW8rruDs"
);

// Fund instruction discriminator from IDL: [218, 188, 111, 221, 152, 113, 174, 7]
const FUND_DISCRIMINATOR = Buffer.from([218, 188, 111, 221, 152, 113, 174, 7]);

// Initialize instruction discriminator from IDL: [175, 175, 109, 31, 13, 152, 155, 237]
const INITIALIZE_DISCRIMINATOR = Buffer.from([175, 175, 109, 31, 13, 152, 155, 237]);

// Release Milestone instruction discriminator: [56, 2, 199, 164, 184, 108, 167, 222]
const RELEASE_MILESTONE_DISCRIMINATOR = Buffer.from([56, 2, 199, 164, 184, 108, 167, 222]);

// Borsh layout for Initialize instruction
const milestoneInputLayout = borsh.struct([
    borsh.str('title'),
    borsh.u64('amount'),
]);

const initializeLayout = borsh.struct([
    borsh.u64('goal'),
    borsh.i64('deadline'),
    borsh.vec(milestoneInputLayout, 'milestones'),
]);

/**
 * Get Platform Config PDA
 */
function getPlatformConfigPDA(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from(PLATFORM_CONFIG_SEED)],
        PROGRAM_ID
    );
}

/**
 * Create a transaction to fund a campaign through the Escrow program
 * @param connection - Solana connection
 * @param backerPublicKey - Public key of the backer
 * @param creatorPublicKey - Public key of the project creator
 * @param amount - Amount parameter (ignored - fixed $1 enforced by contract)
 */
export async function createFundCampaignTransaction(
    connection: Connection,
    backerPublicKey: PublicKey,
    creatorPublicKey: PublicKey,
    amount: number = 1
): Promise<Transaction> {
    const transaction = new Transaction();

    // 1. Derive PDAs
    const [campaignPDA] = getCampaignPDA(creatorPublicKey);
    const [platformConfigPDA] = getPlatformConfigPDA();

    // 2. Get ATAs
    const backerAta = await getAssociatedTokenAddress(
        USDC_MINT_ADDRESS,
        backerPublicKey
    );

    // The vault is the ATA of the campaign PDA
    const campaignVault = await getAssociatedTokenAddress(
        USDC_MINT_ADDRESS,
        campaignPDA,
        true
    );

    // 3. Check if vault ATA exists (it should be created during initialization)
    try {
        await getAccount(connection, campaignVault);
    } catch (error: unknown) {
        if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
            // If it doesn't exist for some reason, create it
            transaction.add(
                createAssociatedTokenAccountInstruction(
                    backerPublicKey, // payer
                    campaignVault,
                    campaignPDA, // owner
                    USDC_MINT_ADDRESS
                )
            );
        }
    }

    // 4. Create fund instruction using proper discriminator
    // The fund instruction takes no args - amount comes from PlatformConfig
    const fundInstruction = new TransactionInstruction({
        keys: [
            { pubkey: campaignPDA, isSigner: false, isWritable: true },
            { pubkey: campaignVault, isSigner: false, isWritable: true },
            { pubkey: backerPublicKey, isSigner: true, isWritable: true },
            { pubkey: backerAta, isSigner: false, isWritable: true },
            { pubkey: platformConfigPDA, isSigner: false, isWritable: false },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        ],
        programId: ODV_ESCROW_PROGRAM_ID,
        data: FUND_DISCRIMINATOR, // Just the discriminator, no additional args
    });

    transaction.add(fundInstruction);

    // 5. Set transaction metadata
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = backerPublicKey;

    return transaction;
}

/**
 * Get transaction confirmation with appropriate settings for current network
 */
export async function confirmTransaction(
    connection: Connection,
    signature: string,
    commitment: 'processed' | 'confirmed' | 'finalized' = 'confirmed'
): Promise<void> {
    // SOON Network typically has faster confirmation times
    const maxRetries = isSoonNetwork() ? 3 : 5;
    
    let retries = 0;
    while (retries < maxRetries) {
        try {
            const confirmation = await connection.confirmTransaction(signature, commitment);
            if (confirmation.value.err) {
                throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
            }
            return;
        } catch (error) {
            retries++;
            if (retries >= maxRetries) {
                throw error;
            }
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

/**
 * Send and confirm transaction with network-appropriate settings
 */
export async function sendAndConfirmTransactionWithRetry(
    connection: Connection,
    transaction: Transaction,
    commitment: 'processed' | 'confirmed' | 'finalized' = 'confirmed'
): Promise<string> {
    const signature = await connection.sendRawTransaction(transaction.serialize(), {
        maxRetries: isSoonNetwork() ? 3 : 5,
        preflightCommitment: commitment,
        skipPreflight: false,
    });
    
    await confirmTransaction(connection, signature, commitment);
    return signature;
}

/**
 * Get explorer URL for a transaction signature
 */
export function getTransactionExplorerUrl(signature: string): string {
    return getExplorerTransactionUrl(signature);
}

// Legacy function kept for backward compatibility (will remove after full migration)
export async function createBackingTransaction(
    connection: Connection,
    backerPublicKey: PublicKey,
    amount: number = 1
): Promise<Transaction> {
    // This is the old direct-transfer method
    // Keeping it temporarily for reference
    console.warn('Using legacy payment method. Migrate to createFundCampaignTransaction');

    const platformWallet = new PublicKey("11111111111111111111111111111111");
    const backerAta = await getAssociatedTokenAddress(USDC_MINT_ADDRESS, backerPublicKey);
    const platformAta = await getAssociatedTokenAddress(USDC_MINT_ADDRESS, platformWallet);

    const transaction = new Transaction();
    const amountInSmallestUnit = amount * 1_000_000;

    transaction.add(
        createTransferInstruction(
            backerAta,
            platformAta,
            backerPublicKey,
            amountInSmallestUnit
        )
    );

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = backerPublicKey;

    return transaction;
}

/**
 * Create transaction to withdraw funds (release milestone)
 */
export async function createWithdrawTransaction(
    connection: Connection,
    creatorPublicKey: PublicKey
): Promise<Transaction> {
    const transaction = new Transaction();

    // 1. Derive Campaign PDA
    const [campaignPDA] = getCampaignPDA(creatorPublicKey);

    // 2. Derive Campaign Vault (ATA)
    const campaignVault = await getAssociatedTokenAddress(
        USDC_MINT_ADDRESS,
        campaignPDA,
        true // allowOwnerOffCurve
    );

    // 3. Get Creator's ATA
    const creatorAta = await getAssociatedTokenAddress(
        USDC_MINT_ADDRESS,
        creatorPublicKey
    );

    // 4. Get Platform Config PDA
    const [platformConfigPDA] = getPlatformConfigPDA();

    // 5. Create release milestone instruction
    const releaseInstruction = new TransactionInstruction({
        keys: [
            { pubkey: campaignPDA, isSigner: false, isWritable: true },
            { pubkey: campaignVault, isSigner: false, isWritable: true },
            { pubkey: creatorPublicKey, isSigner: true, isWritable: true },
            { pubkey: creatorAta, isSigner: false, isWritable: true },
            { pubkey: platformConfigPDA, isSigner: false, isWritable: false },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        ],
        programId: ODV_ESCROW_PROGRAM_ID,
        data: RELEASE_MILESTONE_DISCRIMINATOR,
    });

    transaction.add(releaseInstruction);

    // 6. Set transaction metadata
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = creatorPublicKey;

    return transaction;
}

/**
 * Create transaction to initialize a new campaign
 */
export async function createInitializeCampaignTransaction(
    connection: Connection,
    creatorPublicKey: PublicKey,
    goal: number,
    deadline: number,
    milestones: { title: string; amount: number }[]
): Promise<Transaction> {
    const transaction = new Transaction();

    // 1. Derive Campaign PDA
    const [campaignPDA] = getCampaignPDA(creatorPublicKey);

    // 2. Derive Campaign Vault (ATA)
    // Note: We use the ATA of the campaign PDA as the vault
    const campaignVault = await getAssociatedTokenAddress(
        USDC_MINT_ADDRESS,
        campaignPDA,
        true // allowOwnerOffCurve
    );

    // 3. Check if Campaign Vault (ATA) exists
    // This is needed because the program's initialize instruction doesn't create the vault
    try {
        await getAccount(connection, campaignVault);
        // If it exists, we don't need to create it
    } catch (error: unknown) {
        // If it doesn't exist, add instruction to create it
        // Check for both instance and name to handle bundling issues
        const isTokenAccountError = 
            error instanceof TokenAccountNotFoundError || 
            error instanceof TokenInvalidAccountOwnerError ||
            (typeof error === 'object' && error !== null && 'name' in error && (error as any).name === 'TokenAccountNotFoundError') ||
            (typeof error === 'object' && error !== null && 'name' in error && (error as any).name === 'TokenInvalidAccountOwnerError');

        if (isTokenAccountError) {
            transaction.add(
                createAssociatedTokenAccountInstruction(
                    creatorPublicKey, // payer
                    campaignVault, // ata
                    campaignPDA, // owner
                    USDC_MINT_ADDRESS // mint
                )
            );
        } else {
            // If it's another error (e.g. network), rethrow
            console.warn("Error checking campaign vault:", error);
            // We'll try to create it anyway if we can't verify, but this might fail
            // transaction.add(...) 
            // Better to rethrow or assume it doesn't exist? 
            // If we can't check, we probably can't send either.
            throw error;
        }
    }

    // 4. Prepare Initialize instruction data
    const args = {
        goal: new BN(goal * 1_000_000), // Convert to smallest unit
        deadline: new BN(deadline),
        milestones: milestones.map(m => ({
            title: m.title,
            amount: new BN(m.amount * 1_000_000) // Convert to smallest unit
        }))
    };

    const buffer = Buffer.alloc(2048); // Allocate sufficient space
    const len = initializeLayout.encode(args, buffer);
    const data = Buffer.concat([INITIALIZE_DISCRIMINATOR, buffer.slice(0, len)]);

    // 5. Add Initialize instruction
    transaction.add(new TransactionInstruction({
        keys: [
            { pubkey: campaignPDA, isSigner: false, isWritable: true },
            { pubkey: creatorPublicKey, isSigner: true, isWritable: true },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        programId: ODV_ESCROW_PROGRAM_ID,
        data: data
    }));

    // 6. Set blockhash and fee payer
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = creatorPublicKey;

    return transaction;
}

