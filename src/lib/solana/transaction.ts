import {
    Connection,
    PublicKey,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL
} from '@solana/web3.js';
import {
    createTransferInstruction,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    getAccount,
    TokenAccountNotFoundError,
    TokenInvalidAccountOwnerError
} from '@solana/spl-token';

// Devnet USDC Mint Address (Standard)
// Ideally this should be in env vars, but hardcoding for Devnet simplicity
export const USDC_MINT_ADDRESS = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");

// The platform's wallet address (where funds go)
// Replace with a real devnet wallet you control for testing
// This is a valid Solana devnet address for testing (replace with your own)
export const PLATFORM_WALLET_ADDRESS = new PublicKey("11111111111111111111111111111111");

export async function createBackingTransaction(
    connection: Connection,
    backerPublicKey: PublicKey,
    amount: number = 1 // Default 1 USDC
): Promise<Transaction> {

    // 1. Get the Associated Token Accounts (ATA) for USDC
    const backerAta = await getAssociatedTokenAddress(
        USDC_MINT_ADDRESS,
        backerPublicKey
    );

    const platformAta = await getAssociatedTokenAddress(
        USDC_MINT_ADDRESS,
        PLATFORM_WALLET_ADDRESS
    );

    const transaction = new Transaction();

    // 2. Check if Platform ATA exists, if not, create it (backer pays rent - standard practice or platform pays)
    // For simplicity in this MVP, we assume platform ATA exists or we add instruction to create it.
    // Checking account info is better.
    try {
        await getAccount(connection, platformAta);
    } catch (error: unknown) {
        if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
            transaction.add(
                createAssociatedTokenAccountInstruction(
                    backerPublicKey, // payer
                    platformAta, // associated token account address
                    PLATFORM_WALLET_ADDRESS, // owner
                    USDC_MINT_ADDRESS // mint
                )
            );
        }
    }

    // 3. Add Transfer Instruction
    // USDC has 6 decimals
    const amountInSmallestUnit = amount * 1_000_000;

    transaction.add(
        createTransferInstruction(
            backerAta, // source
            platformAta, // destination
            backerPublicKey, // owner
            amountInSmallestUnit
        )
    );

    // 4. Get latest blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = backerPublicKey;

    return transaction;
}
