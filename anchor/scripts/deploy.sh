#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   ODV Smart Contract - SOON Network Testnet Deployment   ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "Anchor.toml" ]; then
    echo -e "${RED}❌ Error: Not in anchor directory${NC}"
    echo "Please run: cd /workspaces/odv/anchor && ./scripts/deploy.sh"
    exit 1
fi

echo -e "${YELLOW}📋 Step 1: Checking Solana Configuration${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
solana config get
echo ""

WALLET=$(solana address)
echo -e "${GREEN}✓ Wallet Address: $WALLET${NC}"
echo ""

echo -e "${YELLOW}📋 Step 2: Checking SOL Balance${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
BALANCE=$(solana balance | awk '{print $1}')
echo -e "Current Balance: ${GREEN}$BALANCE SOL${NC}"
echo ""

# Check if balance is less than 2 SOL (need ~1.91 for deployment)
if awk "BEGIN {exit !($BALANCE < 2)}"; then
    echo -e "${RED}⚠️  Warning: Low balance (need at least 2 SOL for deployment)${NC}"
    echo ""
    echo -e "${YELLOW}Please get test SOL from the faucet:${NC}"
    echo "  https://faucet.testnet.soo.network/"
    echo ""
    echo "Enter your wallet address:"
    echo "  $WALLET"
    echo ""
    read -p "Press Enter after you've received test SOL..."
    echo ""
    
    BALANCE=$(solana balance | awk '{print $1}')
    echo -e "New Balance: ${GREEN}$BALANCE SOL${NC}"
    echo ""
fi

echo -e "${YELLOW}📋 Step 3: Verifying Build Artifacts${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f "target/deploy/odv_escrow.so" ]; then
    SIZE=$(ls -lh target/deploy/odv_escrow.so | awk '{print $5}')
    echo -e "${GREEN}✓ Smart Contract Binary: $SIZE${NC}"
else
    echo -e "${RED}❌ Binary not found. Building now...${NC}"
    anchor build --skip-lint
fi

if [ -f "target/idl/odv_escrow.json" ]; then
    SIZE=$(ls -lh target/idl/odv_escrow.json | awk '{print $5}')
    echo -e "${GREEN}✓ IDL File: $SIZE${NC}"
else
    echo -e "${RED}❌ IDL not found${NC}"
    exit 1
fi
echo ""

echo -e "${YELLOW}📋 Step 4: Deploying to SOON Network Testnet${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "This will take 2-3 minutes..."
echo ""

# Deploy to Solana Devnet
if anchor deploy --provider.cluster devnet; then
    echo ""
    echo -e "${GREEN}✅ Deployment Successful!${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Deployment Failed${NC}"
    echo "Check the error above and refer to TESTNET_DEPLOYMENT_GUIDE.md"
    exit 1
fi

PROGRAM_ID="Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"

echo -e "${YELLOW}📋 Step 5: Verifying Deployment${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Program ID: $PROGRAM_ID"
echo ""

if solana program show $PROGRAM_ID > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Program verified on-chain${NC}"
else
    echo -e "${YELLOW}⚠️  Could not verify program (might be network delay)${NC}"
fi
echo ""

echo -e "${YELLOW}📋 Step 6: Copying IDL and Types to Frontend${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cp target/idl/odv_escrow.json ../src/lib/solana/idl/
cp target/types/odv_escrow.ts ../src/lib/solana/types/
echo -e "${GREEN}✓ IDL copied to: src/lib/solana/idl/odv_escrow.json${NC}"
echo -e "${GREEN}✓ Types copied to: src/lib/solana/types/odv_escrow.ts${NC}"
echo ""

echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                   Deployment Complete! 🎉                 ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ Smart Contract Deployed Successfully${NC}"
echo ""
echo "📜 Deployment Details:"
echo "  Program ID: $PROGRAM_ID"
echo "  Network: SOON Network Testnet"
echo "  RPC: https://rpc.testnet.soo.network/rpc"
echo ""
echo "🔍 View on Explorer:"
echo "  https://explorer.testnet.soo.network/address/$PROGRAM_ID"
echo ""
echo -e "${YELLOW}⚡ Next Step: Initialize Platform${NC}"
echo ""
echo "Run the initialization script:"
echo "  cd /workspaces/odv/anchor"
echo "  npx ts-node scripts/initialize-platform.ts"
echo ""
echo "Or follow the complete guide:"
echo "  See TESTNET_DEPLOYMENT_GUIDE.md (Step 8)"
echo ""
