#!/bin/bash

set -e

echo "=============================================="
echo "🚀 ODV Platform Initialization"
echo "=============================================="
echo ""

# Check balance
BALANCE=$(solana balance | awk '{print $1}')
echo "💰 Current Balance: $BALANCE SOL"

# Simple check without bc
if [ $(echo "$BALANCE < 0.01" | awk '{if ($1 < $3) print "yes"; else print "no"}') = "yes" ]; then
  echo "❌ Insufficient balance. Need at least 0.01 SOL"
  exit 1
fi

echo ""
echo "📍 Program ID: 4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA"
echo "📍 Platform Config PDA: GhM5s7sdrVuZjVvXraxMAhGgQb9vTGNvom45DHHfV1H9"
echo "📍 Fixed Backing: 1 USDC (1,000,000 units)"
echo ""

# Use anchor CLI to call initialize_platform
echo "⏳ Initializing platform..."
echo ""

# Create a temporary test file
cat > /tmp/init-platform-test.ts << 'EOF'
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

describe("Initialize Platform", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.OdvEscrow as Program;

  it("Initializes the platform", async () => {
    const [platformConfigPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("platform_config")],
      program.programId
    );

    console.log("Platform Config PDA:", platformConfigPDA.toString());
    console.log("Admin:", provider.wallet.publicKey.toString());

    const fixedBackingAmount = new anchor.BN(1_000_000);

    try {
      const tx = await program.methods
        .initializePlatform(fixedBackingAmount)
        .accounts({
          platformConfig: platformConfigPDA,
          admin: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      console.log("✅ Platform initialized!");
      console.log("Transaction:", tx);
    } catch (error) {
      if (error.message && error.message.includes("already in use")) {
        console.log("✅ Platform already initialized!");
      } else {
        throw error;
      }
    }
  });
});
EOF

# Run the test using yarn (which supports mocha grep)
cd /workspaces/odv/anchor && \
  export ANCHOR_PROVIDER_URL=https://api.devnet.solana.com && \
  export ANCHOR_WALLET=~/.config/solana/id.json && \
  yarn run ts-mocha -p ./tsconfig.json -t 1000000 /tmp/init-platform-test.ts --grep "Initialize Platform"

echo ""
echo "=============================================="
echo "✅ Platform Initialization Complete!"
echo "=============================================="
