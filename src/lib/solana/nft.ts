import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";

export async function mintBackerNFT(
    connection: Connection,
    wallet: WalletContextState,
    projectTitle: string,
    backerNumber: number
) {
    if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error("Wallet not connected");
    }

    const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));

    // In a real app, we would upload metadata to Arweave/IPFS first.
    // For this MVP, we'll use a mock URI or a generic one.
    const uri = "https://arweave.net/1234567890abcdef"; // Placeholder

    const { nft } = await metaplex.nfts().create({
        uri: uri,
        name: `${projectTitle} Backer #${backerNumber}`,
        sellerFeeBasisPoints: 0, // 0% royalties
        symbol: "ODV",
        creators: [
            {
                address: wallet.publicKey,
                share: 100,
            },
        ],
        isMutable: true,
    });

    return nft;
}
