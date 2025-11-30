#!/bin/bash

# SOON Network Setup Script for ODV Platform
# This script helps you configure and deploy to SOON Network

set -e

echo "🚀 SOON Network Setup for OneDollarVentures"
echo "============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check prerequisites
echo "📋 Checking prerequisites..."
echo ""

# Check Solana CLI
if ! command -v solana &> /dev/null; then
    print_error "Solana CLI not found. Please install it first:"
    echo "   sh -c \"\$(curl -sSfL https://release.solana.com/stable/install)\""
    exit 1
else
    print_success "Solana CLI installed: $(solana --version)"
fi

# Check Anchor CLI
if ! command -v anchor &> /dev/null; then
    print_warning "Anchor CLI not found. Install with:"
    echo "   cargo install --git https://github.com/coral-xyz/anchor avm --locked --force"
    echo "   avm install latest && avm use latest"
else
    print_success "Anchor CLI installed: $(anchor --version)"
fi

echo ""
echo "🔧 Configuration Options"
echo "========================"
echo ""
echo "Choose network:"
echo "  1) SOON Testnet (recommended)"
echo "  2) SOON Devnet"
echo "  3) Solana Devnet (fallback)"
echo ""
read -p "Enter choice [1-3]: " network_choice

case $network_choice in
    1)
        NETWORK="soon-testnet"
        RPC_URL="https://rpc.testnet.soo.network/rpc"
        EXPLORER_URL="https://explorer.testnet.soo.network"
        FAUCET_URL="https://faucet.testnet.soo.network"
        ;;
    2)
        NETWORK="soon-devnet"
        RPC_URL="https://rpc.devnet.soo.network/rpc"
        EXPLORER_URL="https://explorer.devnet.soo.network"
        FAUCET_URL="https://faucet.testnet.soo.network"
        ;;
    3)
        NETWORK="devnet"
        RPC_URL="https://api.devnet.solana.com"
        EXPLORER_URL="https://explorer.solana.com"
        FAUCET_URL="https://faucet.solana.com"
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

print_success "Selected network: $NETWORK"
print_info "RPC URL: $RPC_URL"
echo ""

# Configure Solana CLI
echo "⚙️  Configuring Solana CLI..."
solana config set --url "$RPC_URL"
print_success "RPC endpoint configured"

# Keypair setup
echo ""
read -p "Do you want to create a new keypair? [y/N]: " create_keypair

if [[ $create_keypair =~ ^[Yy]$ ]]; then
    KEYPAIR_PATH="$HOME/.config/solana/soon-keypair.json"
    
    if [ -f "$KEYPAIR_PATH" ]; then
        print_warning "Keypair already exists at $KEYPAIR_PATH"
        read -p "Overwrite? [y/N]: " overwrite
        if [[ ! $overwrite =~ ^[Yy]$ ]]; then
            print_info "Using existing keypair"
        else
            solana-keygen new --outfile "$KEYPAIR_PATH"
            print_success "New keypair created"
        fi
    else
        solana-keygen new --outfile "$KEYPAIR_PATH"
        print_success "New keypair created"
    fi
    
    solana config set --keypair "$KEYPAIR_PATH"
    print_success "Keypair configured"
else
    CURRENT_KEYPAIR=$(solana config get | grep "Keypair Path" | awk '{print $3}')
    print_info "Using existing keypair: $CURRENT_KEYPAIR"
fi

# Get wallet address
WALLET_ADDRESS=$(solana address)
echo ""
print_success "Your wallet address: $WALLET_ADDRESS"

# Check balance
echo ""
echo "💰 Checking balance..."
BALANCE=$(solana balance 2>/dev/null || echo "0")
print_info "Current balance: $BALANCE"

# Request airdrop if on test network
if [[ $NETWORK != "mainnet-beta" ]]; then
    echo ""
    print_info "To get test tokens, visit the SOON faucet:"
    print_info "🌐 $FAUCET_URL"
    echo ""
    print_info "Your wallet address: $WALLET_ADDRESS"
    echo ""
    read -p "Press Enter after requesting tokens from the faucet..."
    
    # Check balance
    echo "Checking balance..."
    sleep 2
    NEW_BALANCE=$(solana balance)
    print_success "Current balance: $NEW_BALANCE"
fi

# Update .env.local
echo ""
echo "📝 Updating .env.local..."

if [ -f ".env.local" ]; then
    # Backup existing .env.local
    cp .env.local .env.local.backup
    print_info "Backed up existing .env.local to .env.local.backup"
    
    # Update environment variables
    sed -i.tmp "s|NEXT_PUBLIC_SOLANA_RPC_URL=.*|NEXT_PUBLIC_SOLANA_RPC_URL=$RPC_URL|g" .env.local
    sed -i.tmp "s|NEXT_PUBLIC_SOLANA_NETWORK=.*|NEXT_PUBLIC_SOLANA_NETWORK=$NETWORK|g" .env.local
    
    # Add SOON explorer URL if it doesn't exist
    if [[ $NETWORK =~ ^soon ]]; then
        if ! grep -q "NEXT_PUBLIC_SOON_EXPLORER_URL" .env.local; then
            echo "NEXT_PUBLIC_SOON_EXPLORER_URL=$EXPLORER_URL" >> .env.local
        else
            sed -i.tmp "s|NEXT_PUBLIC_SOON_EXPLORER_URL=.*|NEXT_PUBLIC_SOON_EXPLORER_URL=$EXPLORER_URL|g" .env.local
        fi
    fi
    
    rm -f .env.local.tmp
    print_success ".env.local updated"
else
    print_warning ".env.local not found. Create it from .env.example"
fi

# Build Anchor program
echo ""
read -p "Build Anchor program? [Y/n]: " build_program

if [[ ! $build_program =~ ^[Nn]$ ]]; then
    if [ -d "anchor" ]; then
        cd anchor
        print_info "Building Anchor program..."
        anchor build
        print_success "Build complete!"
        
        # Show program ID
        PROGRAM_ID=$(solana address -k target/deploy/odv_escrow-keypair.json)
        echo ""
        print_success "Program ID: $PROGRAM_ID"
        
        # Ask to deploy
        echo ""
        read -p "Deploy to $NETWORK? [y/N]: " deploy_program
        
        if [[ $deploy_program =~ ^[Yy]$ ]]; then
            print_info "Deploying program..."
            anchor deploy --provider.cluster "$RPC_URL"
            print_success "Program deployed!"
            print_info "View on explorer: $EXPLORER_URL/address/$PROGRAM_ID"
        fi
        
        cd ..
    else
        print_warning "anchor/ directory not found"
    fi
fi

# Summary
echo ""
echo "✅ Setup Complete!"
echo "=================="
echo ""
print_info "Network: $NETWORK"
print_info "RPC URL: $RPC_URL"
print_info "Wallet: $WALLET_ADDRESS"
print_info "Explorer: $EXPLORER_URL"
if [[ $NETWORK != "mainnet-beta" ]]; then
    print_info "Faucet: $FAUCET_URL"
fi
echo ""
print_success "You're ready to develop on SOON Network!"
echo ""
echo "Next steps:"
echo "  1. Run: npm run dev"
echo "  2. Connect your wallet (Phantom/Solflare)"
echo "  3. Test transactions"
echo ""
print_info "For more details, see SOON_NETWORK_MIGRATION.md"
