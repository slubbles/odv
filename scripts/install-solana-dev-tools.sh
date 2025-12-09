#!/bin/bash

# Solana Development Tools Installation Script
# Installs: Rust, Solana CLI, Anchor CLI

set -e

echo "🚀 Installing Solana Development Environment"
echo "============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# 1. Install Rust
echo "📦 Step 1: Installing Rust..."
if command -v rustc &> /dev/null; then
    print_success "Rust already installed: $(rustc --version)"
else
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
    print_success "Rust installed successfully"
fi

# Verify Rust
rustc --version
cargo --version

# 2. Install Solana CLI
echo ""
echo "⚡ Step 2: Installing Solana CLI..."
if command -v solana &> /dev/null; then
    print_success "Solana CLI already installed: $(solana --version)"
else
    sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
    print_success "Solana CLI installed successfully"
fi

# Add Solana to PATH permanently
if ! grep -q 'solana/install/active_release/bin' "$HOME/.bashrc"; then
    echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> "$HOME/.bashrc"
fi

# Verify Solana
solana --version

# 3. Install Anchor CLI
echo ""
echo "⚓ Step 3: Installing Anchor CLI..."
if command -v anchor &> /dev/null; then
    print_success "Anchor CLI already installed: $(anchor --version)"
else
    cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
    avm install latest
    avm use latest
    print_success "Anchor CLI installed successfully"
fi

# Verify Anchor
anchor --version

# 4. Configure Solana for SOON Testnet
echo ""
echo "🌐 Step 4: Configuring Solana CLI for SOON Testnet..."
solana config set --url https://rpc.testnet.soo.network/rpc
print_success "Solana CLI configured for SOON Testnet"

# 5. Check/Create Keypair
echo ""
echo "🔑 Step 5: Checking Solana keypair..."
if [ ! -f "$HOME/.config/solana/id.json" ]; then
    print_warning "No keypair found. Creating new keypair..."
    solana-keygen new --no-bip39-passphrase
    print_success "New keypair created"
else
    print_success "Keypair already exists"
fi

WALLET_ADDRESS=$(solana address)
print_info "Your wallet address: $WALLET_ADDRESS"

# 6. Check balance
echo ""
echo "💰 Checking balance..."
BALANCE=$(solana balance)
print_info "Current balance: $BALANCE"

if [[ $BALANCE == "0 SOL" ]]; then
    print_warning "Balance is 0. You need test SOL to deploy."
    print_info "Visit: https://faucet.soo.network/"
    print_info "Paste your wallet address: $WALLET_ADDRESS"
fi

# 7. Summary
echo ""
echo "============================================="
echo "✨ Installation Complete!"
echo "============================================="
echo ""
echo "Installed tools:"
echo "  • Rust:        $(rustc --version | cut -d' ' -f2)"
echo "  • Cargo:       $(cargo --version | cut -d' ' -f2)"
echo "  • Solana CLI:  $(solana --version | cut -d' ' -f2)"
echo "  • Anchor CLI:  $(anchor --version | cut -d' ' -f3)"
echo ""
echo "Solana Config:"
echo "  • RPC URL:     https://rpc.testnet.soo.network/rpc"
echo "  • Wallet:      $WALLET_ADDRESS"
echo "  • Balance:     $BALANCE"
echo ""
echo "Next steps:"
echo "  1. Get test SOL: https://faucet.soo.network/"
echo "  2. Build program: cd anchor && anchor build"
echo "  3. Deploy program: anchor deploy"
echo ""
print_success "Ready to develop on SOON Network! 🚀"
