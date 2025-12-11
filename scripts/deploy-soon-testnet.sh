#!/bin/bash

# SOON Testnet Deployment Script
# This script automates the deployment process for ODV on SOON Testnet

set -e  # Exit on error

echo "============================================"
echo "🚀 ODV SOON Testnet Deployment Script"
echo "============================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check if Solana CLI is installed
echo "📋 Step 1: Checking Solana CLI..."
if ! command -v solana &> /dev/null; then
    echo -e "${RED}❌ Solana CLI not found. Please install it first.${NC}"
    echo "Visit: https://docs.solana.com/cli/install-solana-cli-tools"
    exit 1
fi
echo -e "${GREEN}✅ Solana CLI found${NC}"
echo ""

# Step 2: Configure Solana CLI for SOON Testnet
echo "📋 Step 2: Configuring Solana CLI for SOON Testnet..."
solana config set --url https://rpc.testnet.soo.network/rpc
echo -e "${GREEN}✅ RPC configured${NC}"
echo ""

# Step 3: Display current configuration
echo "📋 Step 3: Current Configuration:"
solana config get
echo ""

# Step 4: Check wallet balance
echo "📋 Step 4: Checking wallet balance..."
WALLET_ADDRESS=$(solana address)
BALANCE=$(solana balance | awk '{print $1}')
echo "Wallet: $WALLET_ADDRESS"
echo "Balance: $BALANCE SOL"

if (( $(echo "$BALANCE < 2" | bc -l) )); then
    echo -e "${YELLOW}⚠️  Low balance detected (< 2 SOL)${NC}"
    echo ""
    echo "Request tokens from SOON Faucet:"
    echo "1. Via CLI: solana airdrop 5"
    echo "2. Via Web: https://faucet.soo.network/"
    echo ""
    read -p "Press Enter after getting tokens, or Ctrl+C to exit..."
fi
echo -e "${GREEN}✅ Sufficient balance${NC}"
echo ""

# Step 5: Check if in correct directory
echo "📋 Step 5: Checking project structure..."
if [ ! -d "anchor" ]; then
    echo -e "${RED}❌ anchor/ directory not found. Please run this script from project root.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Project structure verified${NC}"
echo ""

# Step 6: Build Anchor program
echo "📋 Step 6: Building Anchor program..."
cd anchor

# Clean previous builds
echo "Cleaning previous builds..."
anchor clean

# Build
echo "Building smart contract..."
anchor build

if [ ! -f "target/deploy/odv_escrow.so" ]; then
    echo -e "${RED}❌ Build failed. Check errors above.${NC}"
    exit 1
fi

BUILD_SIZE=$(ls -lh target/deploy/odv_escrow.so | awk '{print $5}')
echo -e "${GREEN}✅ Build successful (Size: $BUILD_SIZE)${NC}"
echo ""

# Step 7: Get Program ID
echo "📋 Step 7: Verifying Program ID..."
PROGRAM_ID=$(solana address -k target/deploy/odv_escrow-keypair.json)
echo "Program ID: $PROGRAM_ID"

EXPECTED_ID="2NZKEk8zk47UAc27f7DScFgxpqyy22VptWVwBUjFfQxC"
if [ "$PROGRAM_ID" != "$EXPECTED_ID" ]; then
    echo -e "${YELLOW}⚠️  Program ID mismatch!${NC}"
    echo "Expected: $EXPECTED_ID"
    echo "Got: $PROGRAM_ID"
    echo ""
    echo "You need to update declare_id! in src/lib.rs"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
echo -e "${GREEN}✅ Program ID verified${NC}"
echo ""

# Step 8: Deploy
echo "📋 Step 8: Deploying to SOON Testnet..."
echo "This may take a minute..."
echo ""

if anchor deploy; then
    echo ""
    echo -e "${GREEN}✅ Deployment successful!${NC}"
else
    echo ""
    echo -e "${RED}❌ Deployment failed. Check errors above.${NC}"
    cd ..
    exit 1
fi

cd ..
echo ""

# Step 9: Verify deployment
echo "📋 Step 9: Verifying deployment..."
if solana program show $PROGRAM_ID > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Program verified on-chain${NC}"
else
    echo -e "${YELLOW}⚠️  Could not verify program (might still be propagating)${NC}"
fi
echo ""

# Step 10: Display next steps
echo "============================================"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "============================================"
echo ""
echo "📍 Program ID: $PROGRAM_ID"
echo "🌐 Explorer: https://explorer.testnet.soo.network/address/$PROGRAM_ID"
echo ""
echo "Next Steps:"
echo "1. Initialize platform: npx ts-node anchor/scripts/initialize-platform.ts"
echo "2. Or visit: http://localhost:3000/admin/initialize"
echo "3. Update .env.local with:"
echo "   NEXT_PUBLIC_ODV_PROGRAM_ID=$PROGRAM_ID"
echo ""
echo "View transaction on SOON Explorer:"
echo "https://explorer.testnet.soo.network/address/$PROGRAM_ID"
echo ""
echo -e "${GREEN}Ready to go! 🚀${NC}"
