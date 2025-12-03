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
import { getCampaignPDA, getCampaignVaultPDA, ODV_ESCROW_PROGRAM_ID } from './program';
import { PROGRAM_ID, PLATFORM_CONFIG_SEED } from './config';
import { getExplorerTransactionUrl, isSoonNetwork } from './network-utils';

// USDC Mint Address on SOON Testnet (Test USDC - can be overridden via env var)
export const USDC_MINT_ADDRESS = new PublicKey(
    process.env.NEXT_PUBLIC_USDC_MINT || "3PNhmxDckddYL24zEfrsHLFLXXvrdzBBoZgfRW8rruDs"
);

// Fund instruction discriminator from IDL: [218, 188, 111, 221, 152, 113, 174, 7]
const FUND_DISCRIMINATOR = Buffer.from([218, 188, 111, 221, 152, 113, 174, 7]);

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
    const [campaignVaultPDA] = getCampaignVaultPDA(campaignPDA);
    const [platformConfigPDA] = getPlatformConfigPDA();

    // 2. Get ATAs
    const backerAta = await getAssociatedTokenAddress(
        USDC_MINT_ADDRESS,
        backerPublicKey
    );

    const vaultAta = await getAssociatedTokenAddress(
        USDC_MINT_ADDRESS,
        campaignVaultPDA,
        true // Allow PDA ownership
    );

    // 3. Check if vault ATA exists, create if needed
    try {
        await getAccount(connection, vaultAta);
    } catch (error: unknown) {
        if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
            transaction.add(
                createAssociatedTokenAccountInstruction(
                    backerPublicKey, // payer
                    vaultAta,
                    campaignVaultPDA, // owner (PDA)
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
            { pubkey: vaultAta, isSigner: false, isWritable: true },
            { pubkey: backerPublicKey, isSigner: true, isWritable: true },
            { pubkey: backerAta, isSigner: false, isWritable: true },
            { pubkey: platformConfigPDA, isSigner: false, isWritable: false },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        ],
        programId: PROGRAM_ID,
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
