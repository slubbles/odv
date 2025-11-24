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

// Devnet USDC Mint Address (Standard)
export const USDC_MINT_ADDRESS = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");

/**
 * Create a transaction to fund a campaign through the Escrow program
 * @param connection - Solana connection
 * @param backerPublicKey - Public key of the backer
 * @param creatorPublicKey - Public key of the project creator
 * @param amount - Amount in USDC (default 1)
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

    // 4. Create fund instruction
    // Note: This is a simplified version. In production, use the Anchor-generated client
    const amountInSmallestUnit = amount * 1_000_000;

    const fundInstructionData = Buffer.from([
        1, // Instruction discriminator for 'fund'
        ...new Uint8Array(new BigUint64Array([BigInt(amountInSmallestUnit)]).buffer),
    ]);

    const fundInstruction = new TransactionInstruction({
        keys: [
            { pubkey: campaignPDA, isSigner: false, isWritable: true },
            { pubkey: vaultAta, isSigner: false, isWritable: true },
            { pubkey: backerPublicKey, isSigner: true, isWritable: false },
            { pubkey: backerAta, isSigner: false, isWritable: true },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        ],
        programId: ODV_ESCROW_PROGRAM_ID,
        data: fundInstructionData,
    });

    transaction.add(fundInstruction);

    // 5. Set transaction metadata
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = backerPublicKey;

    return transaction;
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
