const anchor = require("@coral-xyz/anchor");
const { PublicKey } = require("@solana/web3.js");

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  
  const idl = require("./target/idl/odv_escrow.json");
  const programId = new PublicKey("2NZKEk8zk47UAc27f7DScFgxpqyy22VptWVwBUjFfQxC");
  const program = new anchor.Program(idl, programId, provider);
  
  const [platformConfigPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("platform_config")],
    program.programId
  );
  
  console.log("========================================");
  console.log("Platform Initialization");
  console.log("========================================");
  console.log("Program ID:", program.programId.toString());
  console.log("Platform Config PDA:", platformConfigPDA.toString());
  console.log("Admin:", provider.wallet.publicKey.toString());
  console.log("Fixed Backing Amount: 1 USDC (1,000,000 units)");
  console.log("========================================\n");
  
  const fixedBackingAmount = new anchor.BN(1_000_000);
  
  try {
    console.log("Sending transaction...");
    const tx = await program.methods
      .initializePlatform(fixedBackingAmount)
      .accounts({
        platformConfig: platformConfigPDA,
        admin: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    
    console.log("\n✅ SUCCESS! Platform initialized!");
    console.log("\nTransaction Signature:");
    console.log(tx);
    console.log("\nView on Explorer:");
    console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`);
    console.log("\n========================================");
    console.log("✅ Deployment Complete!");
    console.log("========================================");
    console.log("Your ODV platform is now ready to use!");
    console.log("- Fixed backing: $1 USDC per project");
    console.log("- Platform admin:", provider.wallet.publicKey.toString());
    console.log("- Network: Solana Devnet");
    console.log("========================================\n");
  } catch (error) {
    console.error("\n❌ Error initializing platform:");
    console.error(error.message);
    if (error.logs) {
      console.error("\nProgram logs:");
      error.logs.forEach(log => console.error(log));
    }
    process.exit(1);
  }
}

main().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
