const anchor = require("@coral-xyz/anchor");
const { PublicKey } = require("@solana/web3.js");

async function initializePlatform() {
  console.log("🚀 Initializing ODV Platform on SOON Network Testnet...\n");
  
  // Setup provider
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  
  // Load the program
  const programId = new PublicKey("2NZKEk8zk47UAc27f7DScFgxpqyy22VptWVwBUjFfQxC");
  const idl = require("../target/idl/odv_escrow.json");
  const program = new anchor.Program(idl, programId, provider);
  
  // Derive Platform Config PDA
  const [platformConfigPDA, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("platform_config")],
    programId
  );
  
  console.log("📋 Configuration:");
  console.log("  Program ID:", programId.toString());
  console.log("  Platform Config PDA:", platformConfigPDA.toString());
  console.log("  PDA Bump:", bump);
  console.log("  Admin Wallet:", provider.wallet.publicKey.toString());
  console.log("  RPC Endpoint:", provider.connection.rpcEndpoint);
  console.log();
  
  // Check if already initialized
  try {
    const existingConfig = await program.account.platformConfig.fetch(platformConfigPDA);
    console.log("⚠️  Platform already initialized!");
    console.log("  Admin:", existingConfig.admin.toString());
    console.log("  Fixed Backing Amount:", existingConfig.fixedBackingAmount.toString(), "smallest units");
    console.log("  Total Campaigns:", existingConfig.totalCampaigns.toString());
    console.log("  Total Backers:", existingConfig.totalBackers.toString());
    console.log("  Next Campaign ID:", existingConfig.nextCampaignId.toString());
    console.log("  Paused:", existingConfig.paused);
    console.log();
    console.log("✅ No action needed. Platform is ready!");
    return;
  } catch (error) {
    // Not initialized yet, continue
    console.log("✨ Platform not yet initialized. Proceeding...\n");
  }
  
  // Fixed backing amount: 1 USDC = 1,000,000 smallest units
  const fixedBackingAmount = new anchor.BN(1_000_000);
  
  console.log("💰 Fixed Backing Amount: 1 USDC (1,000,000 smallest units)");
  console.log("📡 Sending transaction...\n");
  
  try {
    const tx = await program.methods
      .initializePlatform(fixedBackingAmount)
      .accounts({
        admin: provider.wallet.publicKey,
      })
      .rpc();
    
    console.log("✅ Platform successfully initialized!");
    console.log();
    console.log("📜 Transaction Details:");
    console.log("  Signature:", tx);
    console.log("  Explorer:", `https://explorer.testnet.soo.network/tx/${tx}`);
    console.log();
    
    // Fetch and display the initialized config
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for confirmation
    
    const config = await program.account.platformConfig.fetch(platformConfigPDA);
    console.log("📋 Platform Configuration:");
    console.log("  Admin:", config.admin.toString());
    console.log("  Fixed Backing Amount:", config.fixedBackingAmount.toString(), "smallest units ($1 USDC)");
    console.log("  Total Campaigns:", config.totalCampaigns.toString());
    console.log("  Total Backers:", config.totalBackers.toString());
    console.log("  Next Campaign ID:", config.nextCampaignId.toString());
    console.log("  Paused:", config.paused);
    console.log();
    console.log("🎉 ODV Platform is now live on SOON Network Testnet!");
    
  } catch (error) {
    console.error("❌ Error initializing platform:");
    
    if (error.message?.includes("insufficient")) {
      console.error("  Issue: Insufficient SOL balance");
      console.error("  Solution: Get more test SOL from https://faucet.testnet.soo.network");
    } else if (error.logs) {
      console.error("  Program Logs:", error.logs);
    } else {
      console.error("  Error:", error.message || error);
    }
    
    process.exit(1);
  }
}

// Run the script
initializePlatform()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
