#!/usr/bin/env node

const anchor = require("@coral-xyz/anchor");
const { Connection, PublicKey, Transaction, TransactionInstruction } = require("@solana/web3.js");
const fs = require("fs");

async function initialize() {
  console.log("🚀 Initializing ODV Platform...\n");

  // Configuration
  const RPC_URL = "https://rpc.testnet.soo.network/rpc";
  const PROGRAM_ID = new PublicKey("2NZKEk8zk47UAc27f7DScFgxpqyy22VptWVwBUjFfQxC");
  const WALLET_PATH = process.env.HOME + "/.config/solana/id.json";

  // Load wallet
  const keypairData = JSON.parse(fs.readFileSync(WALLET_PATH, "utf-8"));
  const keypair = anchor.web3.Keypair.fromSecretKey(new Uint8Array(keypairData));
  
  console.log("Admin Wallet:", keypair.publicKey.toString());
  
  // Create connection and provider
  const connection = new Connection(RPC_URL, "confirmed");
  const wallet = new anchor.Wallet(keypair);
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });

  // Load IDL
  const idl = JSON.parse(fs.readFileSync("target/idl/odv_escrow.json", "utf-8"));
  const program = new anchor.Program(idl, PROGRAM_ID, provider);

  // Derive PDA
  const [platformConfigPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("platform_config")],
    PROGRAM_ID
  );

  console.log("Platform Config PDA:", platformConfigPDA.toString());
  console.log("Program ID:", PROGRAM_ID.toString());
  console.log();

  // Check if already initialized
  try {
    const accountInfo = await connection.getAccountInfo(platformConfigPDA);
    if (accountInfo) {
      console.log("⚠️  Platform already initialized!");
      console.log("Account exists with", accountInfo.data.length, "bytes");
      return;
    }
  } catch (e) {
    // Continue
  }

  console.log("📡 Sending initialization transaction...\n");

  try {
    const fixedBackingAmount = new anchor.BN(1_000_000); // 1 USDC

    const tx = await program.methods
      .initializePlatform(fixedBackingAmount)
      .accounts({
        platformConfig: platformConfigPDA,
        admin: keypair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("✅ Platform initialized successfully!");
    console.log();
    console.log("Transaction:", tx);
    console.log("Explorer:", `https://explorer.testnet.soo.network/tx/${tx}`);
    console.log();

    // Wait and fetch config
    await new Promise(r => setTimeout(r, 3000));

    try {
      const config = await program.account.platformConfig.fetch(platformConfigPDA);
      console.log("📋 Platform Config:");
      console.log("  Admin:", config.admin.toString());
      console.log("  Fixed Backing:", config.fixedBackingAmount.toString());
      console.log("  Next Campaign ID:", config.nextCampaignId.toString());
      console.log("  Total Campaigns:", config.totalCampaigns.toString());
      console.log("  Paused:", config.paused);
    } catch (e) {
      console.log("Note: Config fetch failed, but initialization likely succeeded");
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.logs) {
      console.error("\nProgram Logs:");
      error.logs.forEach(log => console.error("  ", log));
    }
    process.exit(1);
  }
}

initialize().catch(console.error);
