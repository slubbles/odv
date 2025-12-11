const anchor = require("@coral-xyz/anchor");
const { Connection, PublicKey, Keypair } = require("@solana/web3.js");
const fs = require("fs");

async function initializePlatform() {
  console.log("\n" + "=".repeat(60));
  console.log("🚀 ODV Platform Initialization");
  console.log("=".repeat(60) + "\n");

  // Load wallet
  const walletKeypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(process.env.HOME + "/.config/solana/id.json", "utf8")))
  );

  // Setup connection and provider
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const wallet = new anchor.Wallet(walletKeypair);
  const provider = new anchor.AnchorProvider(connection, wallet, { commitment: "confirmed" });
  anchor.setProvider(provider);

  // Load program
  const idl = JSON.parse(fs.readFileSync("./target/idl/odv_escrow.json", "utf8"));
  const programId = new PublicKey("2NZKEk8zk47UAc27f7DScFgxpqyy22VptWVwBUjFfQxC");
  const program = new anchor.Program(idl, programId, provider);

  console.log("📍 Program ID:", program.programId.toString());
  console.log("📍 Admin Wallet:", wallet.publicKey.toString());

  // Get balance
  const balance = await connection.getBalance(wallet.publicKey);
  console.log("💰 Balance:", (balance / 1e9).toFixed(4), "SOL\n");

  if (balance < 10_000_000) {
    console.log("❌ Insufficient balance. Need at least 0.01 SOL");
    process.exit(1);
  }

  // Calculate Platform Config PDA
  const [platformConfigPDA, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("platform_config")],
    program.programId
  );

  console.log("📍 Platform Config PDA:", platformConfigPDA.toString());
  console.log("📍 Bump:", bump);
  console.log();

  // Check if already initialized
  try {
    const existingConfig = await program.account.platformConfig.fetch(platformConfigPDA);
    console.log("✅ Platform already initialized!");
    console.log("   Fixed Backing:", existingConfig.fixedBackingAmount.toString(), "units");
    console.log("   Admin:", existingConfig.admin.toString());
    console.log("   Campaign Counter:", existingConfig.campaignCounter.toString());
    console.log("   Paused:", existingConfig.paused);
    console.log("\n" + "=".repeat(60));
    console.log("✅ Initialization Complete!");
    console.log("=".repeat(60) + "\n");
    process.exit(0);
  } catch (error) {
    if (!error.message.includes("Account does not exist")) {
      throw error;
    }
    console.log("⏳ Platform not initialized. Initializing now...\n");
  }

  // Initialize platform
  const fixedBackingAmount = new anchor.BN(1_000_000); // 1 USDC

  try {
    console.log("📤 Sending transaction...");
    const tx = await program.methods
      .initializePlatform(fixedBackingAmount)
      .accounts({
        platformConfig: platformConfigPDA,
        admin: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("✅ SUCCESS! Platform initialized!");
    console.log("\n📋 Transaction Details:");
    console.log("   Signature:", tx);
    console.log("   Explorer:", `https://explorer.solana.com/tx/${tx}?cluster=devnet`);
    
    // Wait a bit and fetch the account
    console.log("\n⏳ Waiting for confirmation...");
    await new Promise(resolve => setTimeout(resolve, 2000));

    const config = await program.account.platformConfig.fetch(platformConfigPDA);
    console.log("\n📊 Platform Config:");
    console.log("   PDA:", platformConfigPDA.toString());
    console.log("   Admin:", config.admin.toString());
    console.log("   Fixed Backing:", config.fixedBackingAmount.toString(), "units (1 USDC)");
    console.log("   Campaign Counter:", config.campaignCounter.toString());
    console.log("   Paused:", config.paused);

    console.log("\n" + "=".repeat(60));
    console.log("✅ Platform Ready for Use!");
    console.log("=".repeat(60));
    console.log("\n🎉 You can now:");
    console.log("   - Create campaigns");
    console.log("   - Back projects with $1 USDC");
    console.log("   - Submit milestone proofs");
    console.log("   - Release funds to creators");
    console.log();

  } catch (error) {
    console.error("\n❌ Error initializing platform:");
    console.error(error.message);
    if (error.logs) {
      console.error("\n📝 Program Logs:");
      error.logs.forEach((log) => console.error("   ", log));
    }
    process.exit(1);
  }
}

initializePlatform()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("\n❌ Fatal Error:", err);
    process.exit(1);
  });
