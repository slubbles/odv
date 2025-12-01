#!/bin/bash

# Quick SOON Testnet Setup
# Run this first-time setup for SOON Testnet

echo "🔧 SOON Testnet Quick Setup"
echo ""

# 1. Configure Solana CLI
echo "1️⃣ Configuring Solana CLI for SOON Testnet..."
solana config set --url https://rpc.testnet.soo.network/rpc
echo "✅ RPC configured"
echo ""

# 2. Show configuration
echo "2️⃣ Current Configuration:"
solana config get
echo ""

# 3. Show wallet address
echo "3️⃣ Your Wallet Address:"
solana address
echo ""

# 4. Check balance
echo "4️⃣ Current Balance:"
solana balance
echo ""

# 5. Instructions for getting tokens
echo "============================================"
echo "📝 Next Steps:"
echo "============================================"
echo ""
echo "Get test tokens (choose one method):"
echo ""
echo "Method 1 - CLI:"
echo "  solana airdrop 5"
echo ""
echo "Method 2 - Web Faucet:"
echo "  Visit: https://faucet.soo.network/"
echo "  Paste your wallet address above"
echo ""
echo "Note: Max 10 SOL per 10 hours per address/IP"
echo ""
echo "After getting tokens, run deployment:"
echo "  ./scripts/deploy-soon-testnet.sh"
echo ""
