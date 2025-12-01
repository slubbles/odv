import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import * as fs from "fs";

// Load IDL
const idl = JSON.parse(fs.readFileSync("target/idl/odv_escrow.json", "utf8"));

async function main() {
  console.log("🚀 Initializing ODV Platform (Direct Method)...\n");

  // Setup connection (SOON Testnet)
  const connection = new Connection("https://rpc.testnet.soo.network/rpc", "confirmed");
  
  // Load wallet
  const walletKeypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(process.env.HOME + "/.config/solana/id.json", "utf8")))
  );
  
  const wallet = new anchor.Wallet(walletKeypair);
  const provider = new anchor.AnchorProvider(connection, wallet, { commitment: "confirmed" });
  
  // Program ID - SOON Testnet
  const programId = new PublicKey("4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA");
  
  // Create program instance
  const program = new Program(idl, provider);
  
  // Derive PDA
  const [platformConfigPDA, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("platform_config")],
    programId
  );
  
  console.log("📋 Configuration:");
  console.log("  Program ID:", programId.toString());
  console.log("  Platform Config PDA:", platformConfigPDA.toString());
  console.log("  Admin Wallet:", wallet.publicKey.toString());
  console.log();
  
  // Check if already initialized
  try {
    const account = await connection.getAccountInfo(platformConfigPDA);
    if (account) {
      console.log("⚠️  Platform already initialized!");
      console.log("  Account exists with", account.data.length, "bytes");
      return;
    }
  } catch (e) {
    console.log("✨ Platform not initialized yet\n");
  }
  
  // Initialize
  const fixedBackingAmount = new anchor.BN(1_000_000);
  
  console.log("💰 Fixed Backing Amount: $1 USDC (1,000,000 smallest units)");
  console.log("📡 Sending transaction...\n");
  
  try {
    const tx = await program.methods
      .initializePlatform(fixedBackingAmount)
      .accounts({
        admin: wallet.publicKey,
      })
      .rpc();
    
    console.log("✅ SUCCESS! Platform initialized!");
    console.log("📜 Transaction:", tx);
    console.log("🔗 Explorer: https://explorer.testnet.soo.network/tx/" + tx);
    
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    if (error.logs) {
      console.log("\nProgram Logs:");
      error.logs.forEach((log: string) => console.log("  ", log));
    }
  }
}

main();
