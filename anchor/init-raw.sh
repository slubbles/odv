#!/bin/bash
set -e

echo "=============================================="
echo "🚀 Initializing ODV Platform"
echo "=============================================="
echo ""

PROGRAM_ID="2NZKEk8zk47UAc27f7DScFgxpqyy22VptWVwBUjFfQxC"
PLATFORM_PDA="GhM5s7sdrVuZjVvXraxMAhGgQb9vTGNvom45DHHfV1H9"

echo "Program ID: $PROGRAM_ID"
echo "Platform Config PDA: $PLATFORM_PDA"
echo ""

# Check if already exists
if solana account $PLATFORM_PDA 2>/dev/null; then
  echo "✅ Platform already initialized!"
  solana account $PLATFORM_PDA
  exit 0
fi

echo "⏳ Platform not initialized. Creating..."
echo ""
echo "Using Anchor CLI to initialize..."
echo ""

# Use anchor test with our existing test file
cd tests && cat > init-test.ts << 'TESTEOF'
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";

describe("initialize-platform", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const programId = new PublicKey("2NZKEk8zk47UAc27f7DScFgxpqyy22VptWVwBUjFfQxC");
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
TESTEOF

cd .. && anchor test --skip-build --skip-local-validator --skip-deploy tests/init-test.ts

