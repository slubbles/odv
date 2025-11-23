import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { OdvEscrow } from "../target/types/odv_escrow";
import { assert } from "chai";

describe("odv_escrow", () => {
    // Configure the client to use the local cluster.
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.OdvEscrow as Program<OdvEscrow>;

    // Accounts
    const creator = anchor.web3.Keypair.generate();
    const backer = anchor.web3.Keypair.generate();

    let campaignPda: anchor.web3.PublicKey;
    let campaignBump: number;
    let campaignVault: anchor.web3.PublicKey;

    before(async () => {
        // Airdrop SOL to creator and backer
        await provider.connection.requestAirdrop(creator.publicKey, 10 * anchor.web3.LAMPORTS_PER_SOL);
        await provider.connection.requestAirdrop(backer.publicKey, 10 * anchor.web3.LAMPORTS_PER_SOL);

        // Derive PDA
        [campaignPda, campaignBump] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from("campaign"), creator.publicKey.toBuffer()],
            program.programId
        );
    });

    it("Is initialized!", async () => {
        const goal = new anchor.BN(1000);
        const deadline = new anchor.BN(Date.now() / 1000 + 86400); // 1 day from now
        const milestones = [
            { title: "Milestone 1", amount: new anchor.BN(200) },
            { title: "Milestone 2", amount: new anchor.BN(800) },
        ];

        await program.methods
            .initialize(goal, deadline, milestones)
            .accounts({
                campaign: campaignPda,
                creator: creator.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([creator])
            .rpc();

        const campaignAccount = await program.account.campaign.fetch(campaignPda);
        assert.ok(campaignAccount.creator.equals(creator.publicKey));
        assert.ok(campaignAccount.goal.eq(goal));
        assert.equal(campaignAccount.milestones.length, 2);
        assert.ok(campaignAccount.milestones[0].status.active);
    });

    // Note: Funding and Release tests would require setting up a mock SPL Token
    // For MVP/Devnet, we assume the client handles token creation.
    // In a real test, we would use @solana/spl-token to create mints and accounts.
});
