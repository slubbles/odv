#!/usr/bin/env node
/**
 * ODV Platform Initialization Script for SOON Testnet
 * 
 * This script initializes the Platform Config PDA on SOON Testnet.
 * It must be run once before any campaigns can be created.
 * 
 * Usage:
 *   node scripts/initialize-platform-soon.js
 * 
 * Requirements:
 *   - Admin wallet private key (as JSON array or base58)
 *   - SOL balance on SOON Testnet for transaction fees
 */

const {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  sendAndConfirmTransaction,
} = require("@solana/web3.js");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// SOON Testnet Configuration
const PROGRAM_ID = new PublicKey("4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA");
const RPC_ENDPOINT = "https://rpc.testnet.soo.network/rpc";
const EXPLORER_URL = "https://explorer.testnet.soo.network";
const EXPECTED_ADMIN = "4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw";

// Instruction discriminator for initialize_platform
// Computed from: sha256("global:initialize_platform")[0..8]
const INITIALIZE_PLATFORM_DISCRIMINATOR = Buffer.from([
  175, 175, 109, 31, 13, 152, 155, 237
]);

function getPlatformConfigPDA() {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("platform_config")],
    PROGRAM_ID
  );
}

async function promptForPrivateKey() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    console.log("\n🔐 Enter your admin wallet private key");
    console.log("   (Paste the JSON array from your wallet export)\n");
    rl.question("> ", (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function parsePrivateKey(input) {
  try {
    // Try parsing as JSON array first
    if (input.startsWith("[")) {
      const secretKey = new Uint8Array(JSON.parse(input));
      return Keypair.fromSecretKey(secretKey);
    }
    // Try base58 format
    const bs58 = require("bs58");
    const secretKey = bs58.decode(input);
    return Keypair.fromSecretKey(secretKey);
  } catch (error) {
    throw new Error("Invalid private key format. Expected JSON array [1,2,3,...] or base58 string.");
  }
}

async function checkPlatformStatus(connection) {
  const [platformConfigPDA] = getPlatformConfigPDA();
  
  try {
    const accountInfo = await connection.getAccountInfo(platformConfigPDA);
    if (accountInfo) {
      // Parse the account data
      // Layout: discriminator(8) + admin(32) + fixed_backing_amount(8) + campaign_counter(8) + paused(1) + bump(1)
      const data = accountInfo.data;
      const admin = new PublicKey(data.slice(8, 40));
      const fixedBackingAmount = data.readBigUInt64LE(40);
      const campaignCounter = data.readBigUInt64LE(48);
      const paused = data[56] === 1;
      const bump = data[57];
      
      return {
        initialized: true,
        admin: admin.toBase58(),
        fixedBackingAmount: fixedBackingAmount.toString(),
        campaignCounter: campaignCounter.toString(),
        paused,
        bump,
        pda: platformConfigPDA.toBase58(),
      };
    }
    return { initialized: false, pda: platformConfigPDA.toBase58() };
  } catch (error) {
    return { initialized: false, pda: platformConfigPDA.toBase58(), error: error.message };
  }
}

async function initializePlatform(connection, adminKeypair, fixedBackingAmount) {
  const [platformConfigPDA, bump] = getPlatformConfigPDA();
  
  // Build instruction data: discriminator + fixed_backing_amount (u64, little-endian)
  const amountBuffer = Buffer.alloc(8);
  amountBuffer.writeBigUInt64LE(BigInt(fixedBackingAmount), 0);
  
  const instructionData = Buffer.concat([
    INITIALIZE_PLATFORM_DISCRIMINATOR,
    amountBuffer,
  ]);
  
  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: platformConfigPDA, isSigner: false, isWritable: true },
      { pubkey: adminKeypair.publicKey, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: PROGRAM_ID,
    data: instructionData,
  });
  
  const transaction = new Transaction().add(instruction);
  
  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [adminKeypair],
    { commitment: "confirmed" }
  );
  
  return signature;
}

async function main() {
  console.log("\n" + "═".repeat(60));
  console.log("  🚀 ODV Platform Initialization - SOON Testnet");
  console.log("═".repeat(60));
  
  // Connect to SOON Testnet
  console.log("\n📡 Connecting to SOON Testnet...");
  const connection = new Connection(RPC_ENDPOINT, "confirmed");
  
  try {
    const version = await connection.getVersion();
    console.log("   ✅ Connected! Version:", version["solana-core"]);
  } catch (error) {
    console.error("   ❌ Failed to connect:", error.message);
    process.exit(1);
  }
  
  // Check current platform status
  console.log("\n📋 Checking platform status...");
  const status = await checkPlatformStatus(connection);
  console.log("   Platform Config PDA:", status.pda);
  
  if (status.initialized) {
    console.log("\n" + "─".repeat(60));
    console.log("✅ PLATFORM ALREADY INITIALIZED!");
    console.log("─".repeat(60));
    console.log("\n📊 Current Configuration:");
    console.log("   Admin:", status.admin);
    console.log("   Fixed Backing: $" + (parseInt(status.fixedBackingAmount) / 1_000_000).toFixed(2) + " USDC");
    console.log("   Campaign Count:", status.campaignCounter);
    console.log("   Paused:", status.paused);
    console.log("\n🎉 Platform is ready for use!");
    console.log("   You can now approve projects and they'll be initialized on-chain.\n");
    process.exit(0);
  }
  
  console.log("   ⏳ Platform not yet initialized.");
  
  // Get admin private key
  let adminKeypair;
  
  // Check for environment variable first
  if (process.env.ADMIN_PRIVATE_KEY) {
    console.log("\n🔐 Using ADMIN_PRIVATE_KEY from environment...");
    try {
      adminKeypair = parsePrivateKey(process.env.ADMIN_PRIVATE_KEY);
    } catch (error) {
      console.error("   ❌", error.message);
      process.exit(1);
    }
  } else if (process.env.ADMIN_KEYPAIR_PATH && fs.existsSync(process.env.ADMIN_KEYPAIR_PATH)) {
    console.log("\n🔐 Loading keypair from", process.env.ADMIN_KEYPAIR_PATH);
    try {
      const keyData = fs.readFileSync(process.env.ADMIN_KEYPAIR_PATH, "utf8");
      adminKeypair = parsePrivateKey(keyData);
    } catch (error) {
      console.error("   ❌", error.message);
      process.exit(1);
    }
  } else {
    // Prompt for private key
    const privateKeyInput = await promptForPrivateKey();
    try {
      adminKeypair = parsePrivateKey(privateKeyInput);
    } catch (error) {
      console.error("   ❌", error.message);
      process.exit(1);
    }
  }
  
  const adminPublicKey = adminKeypair.publicKey.toBase58();
  console.log("   Admin Wallet:", adminPublicKey);
  
  // Verify this is the expected admin
  if (adminPublicKey !== EXPECTED_ADMIN) {
    console.log("\n⚠️  WARNING: This wallet doesn't match the expected admin!");
    console.log("   Expected:", EXPECTED_ADMIN);
    console.log("   Got:", adminPublicKey);
    console.log("\n   The platform will be initialized with YOUR wallet as admin.");
    console.log("   Make sure this is what you want!\n");
  }
  
  // Check SOL balance
  console.log("\n💰 Checking balance...");
  const balance = await connection.getBalance(adminKeypair.publicKey);
  const balanceSOL = balance / 1e9;
  console.log("   Balance:", balanceSOL.toFixed(4), "SOL");
  
  if (balance < 10_000_000) { // 0.01 SOL minimum
    console.error("\n❌ Insufficient balance!");
    console.error("   Need at least 0.01 SOL for transaction fees.");
    console.error("   Get test SOL from: https://faucet.testnet.soo.network");
    process.exit(1);
  }
  
  // Initialize platform
  const FIXED_BACKING_AMOUNT = 1_000_000; // 1 USDC
  
  console.log("\n" + "─".repeat(60));
  console.log("📤 INITIALIZING PLATFORM...");
  console.log("─".repeat(60));
  console.log("\n   Fixed Backing Amount: $1.00 USDC (1,000,000 smallest units)");
  console.log("   Admin:", adminPublicKey);
  console.log("\n   Sending transaction...");
  
  try {
    const signature = await initializePlatform(connection, adminKeypair, FIXED_BACKING_AMOUNT);
    
    console.log("\n" + "═".repeat(60));
    console.log("  ✅ PLATFORM SUCCESSFULLY INITIALIZED!");
    console.log("═".repeat(60));
    console.log("\n📜 Transaction Details:");
    console.log("   Signature:", signature);
    console.log("   Explorer:", `${EXPLORER_URL}/tx/${signature}`);
    
    // Wait and fetch updated status
    console.log("\n⏳ Confirming on-chain...");
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newStatus = await checkPlatformStatus(connection);
    console.log("\n📊 Platform Configuration:");
    console.log("   PDA:", newStatus.pda);
    console.log("   Admin:", newStatus.admin);
    console.log("   Fixed Backing: $" + (parseInt(newStatus.fixedBackingAmount) / 1_000_000).toFixed(2) + " USDC");
    console.log("   Campaign Count:", newStatus.campaignCounter);
    console.log("   Paused:", newStatus.paused);
    
    console.log("\n🎉 Platform is now live on SOON Testnet!");
    console.log("   You can now:");
    console.log("   • Approve projects (creates campaigns on-chain)");
    console.log("   • Users can back projects with $1 USDC");
    console.log("   • Approve milestones to release funds");
    console.log("   • Pause/unpause the platform if needed\n");
    
  } catch (error) {
    console.error("\n❌ Failed to initialize platform:");
    console.error("   ", error.message);
    if (error.logs) {
      console.error("\n📝 Program Logs:");
      error.logs.forEach((log) => console.error("   ", log));
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("\n❌ Fatal error:", error);
  process.exit(1);
});
