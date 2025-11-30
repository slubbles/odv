const anchor = require("@coral-xyz/anchor");
const { PublicKey, SystemProgram } = require("@solana/web3.js");

describe("initialize-platform", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.OdvEscrow;

  it("Initializes the platform", async () => {
    const provider = anchor.getProvider();
    
    const [platformConfigPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("platform_config")],
      program.programId
    );

    console.log("\n" + "=".repeat(60));
    console.log("🚀 Initializing ODV Platform");
    console.log("=".repeat(60));
    console.log("Platform Config PDA:", platformConfigPDA.toString());
    console.log("Admin:", provider.wallet.publicKey.toString());
    console.log("Program ID:", program.programId.toString());
    console.log("=".repeat(60) + "\n");

    const fixedBackingAmount = new anchor.BN(1_000_000);

    try {
      const tx = await program.methods
        .initializePlatform(fixedBackingAmount)
        .accounts({
          platformConfig: platformConfigPDA,
          admin: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("✅ SUCCESS! Platform initialized!");
      console.log("Transaction:", tx);
      console.log("Explorer: https://explorer.solana.com/tx/" + tx + "?cluster=devnet");
      console.log();
    } catch (error) {
      if (error.message && error.message.includes("already in use")) {
        console.log("✅ Platform already initialized!");
      } else {
        throw error;
      }
    }
  });
});
