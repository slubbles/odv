import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";

describe("initialize-platform", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const programId = new PublicKey("4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA");
  const program = anchor.workspace.OdvEscrow as Program;

  it("Initializes the platform", async () => {
    const [platformConfigPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("platform_config")],
      programId
    );

    console.log("Platform Config PDA:", platformConfigPDA.toString());
    console.log("Admin:", provider.wallet.publicKey.toString());

    const fixedBackingAmount = new anchor.BN(1_000_000);

    const tx = await program.methods
      .initializePlatform(fixedBackingAmount)
      .accounts({
        platformConfig: platformConfigPDA,
        admin: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("✅ Platform initialized!");
    console.log("Transaction:", tx);
    console.log("Explorer: https://explorer.solana.com/tx/" + tx + "?cluster=devnet");
  });
});
