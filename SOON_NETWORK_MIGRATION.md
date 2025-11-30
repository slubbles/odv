# 🚀 SOON Network Migration Guide

## Overview

This guide covers migrating OneDollarVentures from Solana Devnet to **SOON Network** (SVM Rollup - Solana-compatible testnet).

**SOON Network** is an Ethereum-based SVM (Solana Virtual Machine) rollup that maintains full compatibility with Solana programs while offering faster finality and lower costs.

---

## 📋 Prerequisites

Before starting, ensure you have:
- Node.js 18+ installed
- Solana CLI installed (`solana --version`)
- Anchor CLI installed (`anchor --version`)
- A code editor (VS Code recommended)

---

## 🔧 Step 1: Install Required Tools

### 1.1 Install/Update Solana CLI

```bash
# If not installed
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# If already installed, update to latest
solana-install update

# Verify installation
solana --version
```

### 1.2 Install Anchor (if not installed)

```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# Verify
anchor --version
```

---

## 🌐 Step 2: Configure SOON Network RPC

### 2.1 Update Environment Variables

Update `.env.local`:

```bash
# SOON Network Configuration (Testnet)
NEXT_PUBLIC_SOLANA_RPC_URL=https://rpc.testnet.soo.network/rpc
NEXT_PUBLIC_SOLANA_NETWORK=soon-testnet
NEXT_PUBLIC_SOON_EXPLORER_URL=https://explorer.testnet.soo.network

# For Devnet (alternative)
# NEXT_PUBLIC_SOLANA_RPC_URL=https://rpc.devnet.soo.network/rpc
# NEXT_PUBLIC_SOLANA_NETWORK=soon-devnet

# Your Program ID (will be updated after deployment)
NEXT_PUBLIC_ODV_PROGRAM_ID=Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS

# USDC on SOON (use SOON's test token)
NEXT_PUBLIC_USDC_MINT=TBD_AFTER_DEPLOYMENT

# Supabase (unchanged)
NEXT_PUBLIC_SUPABASE_URL=https://zsfujmvltpumleszcrwh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZnVqbXZsdHB1bWxlc3pjcndoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NjY1MjIsImV4cCI6MjA3OTQ0MjUyMn0.Oo17LARoqRirRqtX_RZtouINBzyTRiUv3mSM6e3zNQM

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Update `.env.example`:

```bash
# SOON Network Configuration
NEXT_PUBLIC_SOLANA_RPC_URL=https://rpc.testnet.soo.network/rpc
NEXT_PUBLIC_SOLANA_NETWORK=soon-testnet
NEXT_PUBLIC_SOON_EXPLORER_URL=https://explorer.testnet.soo.network

# Program Configuration
NEXT_PUBLIC_ODV_PROGRAM_ID=your_deployed_program_id
NEXT_PUBLIC_USDC_MINT=your_test_token_mint

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🔑 Step 3: Create SOON Network Keypair

### 3.1 Generate New Keypair

```bash
# Navigate to project root
cd /workspaces/odv

# Generate new keypair (or use existing Solana keypair)
solana-keygen new --outfile ~/.config/solana/soon-keypair.json

# Show public key
solana-keygen pubkey ~/.config/solana/soon-keypair.json
```

### 3.2 Set Solana CLI to Use SOON Network

```bash
# Configure Solana CLI to use SOON testnet
solana config set --url https://rpc.testnet.soo.network/rpc

# Set your keypair
solana config set --keypair ~/.config/solana/soon-keypair.json

# Verify configuration
solana config get
```

**Expected output:**
```
Config File: ~/.config/solana/cli/config.yml
RPC URL: https://rpc.testnet.soo.network/rpc
WebSocket URL: wss://rpc.testnet.soo.network/rpc (computed)
Keypair Path: ~/.config/solana/soon-keypair.json
Commitment: confirmed
```

---

## 💰 Step 4: Get Test Tokens from SOON Faucet

### 4.1 Get SOON Testnet Tokens

```bash
# Get your wallet address
WALLET_ADDRESS=$(solana-keygen pubkey ~/.config/solana/soon-keypair.json)
echo "Your wallet address: $WALLET_ADDRESS"

# Request airdrop (1 SOON token)
curl -X POST https://faucet.testnet.soo.network/api/faucet \
  -H "Content-Type: application/json" \
  -d "{\"address\": \"$WALLET_ADDRESS\"}"
```

**Alternative:** Use the web faucet at https://faucet.testnet.soo.network

### 4.2 Verify Balance

```bash
# Check balance
solana balance

# Should show: 1 SOL (SOON tokens)
```

### 4.3 Request More if Needed

For development, you may need more tokens:

```bash
# Request additional airdrops (wait 30 seconds between requests)
curl -X POST https://faucet.testnet.soo.network/api/faucet \
  -H "Content-Type: application/json" \
  -d "{\"address\": \"$WALLET_ADDRESS\"}"
```

---

## 🏗️ Step 5: Update Anchor Configuration

### 5.1 Update `anchor/Anchor.toml`

```bash
cd /workspaces/odv/anchor
```

Edit `Anchor.toml`:

```toml
[toolchain]

[features]
seeds = false
skip-lint = false

[programs.soon-testnet]
odv_escrow = "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "https://rpc.testnet.soo.network/rpc"
wallet = "~/.config/solana/soon-keypair.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"

# Add cluster definitions
[[test.validator]]
url = "https://rpc.testnet.soo.network/rpc"

[test.validator.clone]
# Add any accounts you want to clone for testing
```

### 5.2 Add SOON Network Cluster Config

Create `anchor/soon-config.json`:

```json
{
  "cluster": "soon-testnet",
  "rpc": {
    "url": "https://rpc.testnet.soo.network/rpc",
    "commitment": "confirmed"
  },
  "wallet": "~/.config/solana/soon-keypair.json",
  "explorer": "https://explorer.testnet.soo.network"
}
```

---

## 📦 Step 6: Build and Deploy Smart Contract

### 6.1 Build the Program

```bash
cd /workspaces/odv/anchor

# Clean previous builds
anchor clean

# Build for SOON network (same as Solana)
anchor build

# Verify build succeeded
ls -lh target/deploy/
# Should see: odv_escrow.so
```

### 6.2 Get Program ID

```bash
# Show program public key
solana address -k target/deploy/odv_escrow-keypair.json

# Copy this address - you'll need it for deployment
```

### 6.3 Update Program ID in Code

If the program ID changed, update these files:

1. **`anchor/Anchor.toml`**:
```toml
[programs.soon-testnet]
odv_escrow = "YOUR_NEW_PROGRAM_ID"
```

2. **`src/lib/solana/program.ts`**:
```typescript
export const ODV_ESCROW_PROGRAM_ID = new PublicKey(
    'YOUR_NEW_PROGRAM_ID'
);
```

3. **`.env.local`**:
```bash
NEXT_PUBLIC_ODV_PROGRAM_ID=YOUR_NEW_PROGRAM_ID
```

### 6.4 Deploy to SOON Testnet

```bash
# Ensure you have enough tokens (check balance)
solana balance

# Deploy the program
anchor deploy --provider.cluster https://rpc.testnet.soo.network/rpc

# Wait for confirmation (may take 30-60 seconds)
```

**Expected output:**
```
Deploying workspace: https://rpc.testnet.soo.network/rpc
Upgrade authority: YOUR_WALLET_ADDRESS
Deploying program "odv_escrow"...
Program Id: YOUR_PROGRAM_ID

Deploy success
```

### 6.5 Verify Deployment

```bash
# Check program account exists
solana program show YOUR_PROGRAM_ID

# View on SOON Explorer
echo "https://explorer.testnet.soo.network/address/YOUR_PROGRAM_ID"
```

---

## 🔄 Step 7: Update Frontend Code

### 7.1 Update WalletContextProvider

Edit `src/components/providers/WalletContextProvider.tsx`:

```typescript
'use client';

import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

export const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    // Use SOON Network RPC endpoint
    const endpoint = useMemo(() => {
        return process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://rpc.testnet.soo.network/rpc';
    }, []);

    // Phantom is auto-detected via Standard Wallet protocol
    const wallets = useMemo(
        () => [
            new SolflareWalletAdapter(),
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};
```

### 7.2 Update Transaction Helper (Optional)

If you want to add SOON-specific optimizations, edit `src/lib/solana/transaction.ts`:

```typescript
// Add SOON network check
export function isSoonNetwork(): boolean {
    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK;
    return network?.includes('soon') || false;
}

// Add SOON explorer link helper
export function getExplorerUrl(signature: string): string {
    if (isSoonNetwork()) {
        return `${process.env.NEXT_PUBLIC_SOON_EXPLORER_URL}/tx/${signature}`;
    }
    return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
}
```

---

## 🧪 Step 8: Test the Integration

### 8.1 Start Development Server

```bash
cd /workspaces/odv
npm run dev
```

### 8.2 Test Wallet Connection

1. Open http://localhost:3000
2. Click "Connect Wallet"
3. Select Phantom or Solflare
4. Approve connection
5. Wallet should connect to SOON network automatically

### 8.3 Test Transaction

1. Navigate to a project page
2. Click "Back This Project"
3. Approve transaction in wallet
4. Transaction should process on SOON network

### 8.4 Verify on SOON Explorer

```bash
# After transaction, check on explorer
# URL format: https://explorer.testnet.soo.network/tx/YOUR_TX_SIGNATURE
```

---

## 🔍 Step 9: Verify Smart Contract on SOON

### 9.1 View Program on Explorer

Visit: `https://explorer.testnet.soo.network/address/YOUR_PROGRAM_ID`

You should see:
- Program account details
- Executable data
- Upgrade authority
- Recent transactions

### 9.2 Test Program Instructions

```bash
cd /workspaces/odv/anchor

# Run Anchor tests against SOON network
anchor test --provider.cluster https://rpc.testnet.soo.network/rpc
```

---

## 📊 Step 10: Update Documentation

### 10.1 Update README.md

Add SOON network information:

```markdown
## 🌐 Network

This project is deployed on **SOON Network Testnet** - an Ethereum-based SVM rollup.

- **RPC Endpoint**: https://rpc.testnet.soo.network/rpc
- **Explorer**: https://explorer.testnet.soo.network
- **Faucet**: https://faucet.testnet.soo.network
```

### 10.2 Update Deployment Instructions

Document the SOON-specific deployment process for future team members.

---

## 🚨 Troubleshooting

### Issue: "Transaction simulation failed"

**Solution:**
```bash
# Check you have enough SOON tokens
solana balance

# Request more from faucet
curl -X POST https://faucet.testnet.soo.network/api/faucet \
  -H "Content-Type: application/json" \
  -d "{\"address\": \"$(solana address)\"}"
```

### Issue: "Program deployment failed"

**Solution:**
```bash
# Ensure program size isn't too large
ls -lh target/deploy/odv_escrow.so

# If > 1MB, optimize your Rust code
# Check Anchor version is latest
anchor --version
```

### Issue: "Wallet not connecting"

**Solution:**
1. Ensure wallet is set to correct network
2. In Phantom: Settings → Developer Settings → Change Network → Custom RPC
3. Enter: `https://rpc.testnet.soo.network/rpc`

### Issue: "Transaction timeout"

**Solution:**
```bash
# SOON network may have different confirmation times
# Increase timeout in your code:
const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
const signature = await connection.sendRawTransaction(transaction.serialize(), {
    maxRetries: 5,
    preflightCommitment: 'confirmed',
});
await connection.confirmTransaction({
    signature,
    blockhash,
    lastValidBlockHeight,
}, 'confirmed');
```

---

## 🔗 Useful SOON Network Resources

- **Documentation**: https://docs.soo.network
- **RPC Configuration**: https://docs.soo.network/developers/soon-rpc-configuration
- **Explorer**: https://explorer.testnet.soo.network
- **Faucet**: https://faucet.testnet.soo.network
- **Discord**: https://discord.gg/soon-network
- **GitHub**: https://github.com/soon-network

---

## 📋 Migration Checklist

```
✅ Installed Solana CLI
✅ Installed Anchor CLI
✅ Created SOON network keypair
✅ Configured Solana CLI to use SOON RPC
✅ Requested test tokens from faucet
✅ Updated Anchor.toml
✅ Built Anchor program
✅ Deployed to SOON testnet
✅ Updated frontend environment variables
✅ Updated WalletContextProvider
✅ Tested wallet connection
✅ Tested transaction flow
✅ Verified on SOON explorer
✅ Updated documentation
```

---

## 🎯 Next Steps

After successful migration to SOON testnet:

1. **Monitor Performance**: Compare transaction speeds vs Solana devnet
2. **Test All Features**: Backing, milestone submissions, withdrawals
3. **Document Gas Costs**: Track transaction costs on SOON vs Solana
4. **Prepare for Mainnet**: When ready, migrate to SOON mainnet
5. **Update Marketing**: Highlight SOON network benefits (faster, cheaper)

---

## ⚠️ Important Notes

- **SOON Network is Solana-compatible**: No changes needed to Rust smart contracts
- **Wallet adapters work the same**: Phantom/Solflare just need RPC endpoint change
- **SPL tokens work**: You can use existing SPL token standards
- **Lower fees**: SOON typically has 90% lower transaction costs than Solana
- **Faster finality**: 400ms block times vs Solana's 400ms

---

**Need help?** Check SOON Network's documentation or reach out on their Discord!

🚀 Happy building on SOON Network!
