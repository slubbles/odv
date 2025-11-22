import {
    Connection,
    PublicKey,
    Transaction
} from '@solana/web3.js';
import {
    createTransferInstruction,
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';

// Devnet USDC Mint Address
export const USDC_MINT = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');

// Placeholder Recipient Address (Replace with actual treasury wallet)
export const RECIPIENT_WALLET = new PublicKey('G2FAbFQPFa5qKXCetoFZQEvF9wtv9ij7fR6Ap6AQF4J4');

export async function createBackingTransaction(
    connection: Connection,
    payer: PublicKey
): Promise<Transaction> {
    // 1. Get the payer's associated token account for USDC
    const sourceTokenAccount = await getAssociatedTokenAddress(
        USDC_MINT,
        payer,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
    );

    // 2. Get the recipient's associated token account for USDC
    const destinationTokenAccount = await getAssociatedTokenAddress(
        USDC_MINT,
        RECIPIENT_WALLET,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
    );

    // 3. Create the transfer instruction (1 USDC = 1,000,000 base units)
    const transferInstruction = createTransferInstruction(
        sourceTokenAccount,
        destinationTokenAccount,
        payer,
        1_000_000, // 1 USDC
        [],
        TOKEN_PROGRAM_ID
    );

    // 4. Create and return the transaction
    const transaction = new Transaction().add(transferInstruction);

    // Get latest blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer;

    return transaction;
}

export async function mintBackerNFT(payer: PublicKey) {
    // Mock NFT minting process
    console.log(`Minting Backer NFT for ${payer.toBase58()}...`);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
    console.log('NFT Minted successfully!');
    return "https://arweave.net/placeholder-nft-image"; // Return a mock image URL
}
