# 🚀 SOON Testnet Deployment Guide

**Date**: December 1, 2025  
**Network**: SOON Testnet (SVM Rollup)  
**Status**: Ready to Deploy

---

## 📋 What Changed

Your project has been configured to deploy on **SOON Testnet** instead of Solana Devnet.

### Configuration Updates

1. **Anchor.toml** ✅
   - Added `[programs.soon-testnet]` section
   - Updated provider cluster to SOON Testnet RPC
   - RPC: `https://rpc.testnet.soo.network/rpc`

2. **src/lib/solana/config.ts** ✅
   - Network changed from `devnet` to `soon-testnet`
   - RPC endpoint: `https://rpc.testnet.soo.network/rpc`
   - Explorer: `https://explorer.testnet.soo.network`

3. **src/lib/solana/network-utils.ts** ✅
   - Default network now SOON Testnet
   - Network detection updated

---

## 🛠️ Deployment Steps

### Step 1: Configure Solana CLI for SOON Testnet

```bash
# Set SOON Testnet as default network
solana config set --url https://rpc.testnet.soo.network/rpc

# Verify configuration
solana config get
```

**Expected output:**
```
RPC URL: https://rpc.testnet.soo.network/rpc
WebSocket URL: wss://rpc.testnet.soo.network/rpc (computed)
Keypair Path: /home/xxxxx/.config/solana/id.json
Commitment: confirmed
```

---

### Step 2: Get Test Tokens from SOON Faucet

**Option A: Via CLI (Recommended)**

```bash
# Get your wallet address
solana address

# Request SOL from faucet (max 10 SOL per 10 hours)
solana airdrop 2
```

**Option B: Via Web Faucet**

Visit: https://faucet.soo.network/

Enter your wallet address and request tokens.

**Note**: You can get maximum 10 SOL every 10 hours per address and IP.

---

### Step 3: Check Your Balance

```bash
# Check balance
solana balance

# Should show at least 2 SOL for deployment
```

---

### Step 4: Build the Smart Contract

```bash
cd /workspaces/odv/anchor

# Clean previous builds
anchor clean

# Build for SOON Testnet
anchor build

# Verify build
ls -lh target/deploy/odv_escrow.so
```

---

### Step 5: Get Program ID

```bash
# Display program ID from keypair
solana address -k target/deploy/odv_escrow-keypair.json
```

**Important**: If this differs from `4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA`, you'll need to:

1. Update `anchor/programs/odv_escrow/src/lib.rs` (line 3):
   ```rust
   declare_id!("YOUR_NEW_PROGRAM_ID");
   ```

2. Rebuild:
   ```bash
   anchor build
   ```

---

### Step 6: Deploy to SOON Testnet

```bash
# Deploy the program
anchor deploy --provider.cluster https://rpc.testnet.soo.network/rpc

# Or simply (since we updated Anchor.toml)
anchor deploy
```

**Expected output:**
```
Deploying workspace: https://rpc.testnet.soo.network/rpc
Upgrade authority: YOUR_WALLET_ADDRESS
Deploying program "odv_escrow"...
Program Id: 4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA
Deploy success
```

---

### Step 7: Verify Deployment

```bash
# Check program exists on-chain
solana program show 4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA

# View on SOON Explorer
echo "https://explorer.testnet.soo.network/address/4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA"
```

---

### Step 8: Initialize Platform

After deployment, initialize the platform configuration:

```bash
cd /workspaces/odv

# Run initialization script
npx ts-node anchor/scripts/initialize-platform.ts
```

**Or use the web interface:**

Navigate to `http://localhost:3000/admin/initialize` and click "Initialize Platform"

---

## 🌐 Environment Variables

Update your `.env.local` file:

```bash
# SOON Testnet Configuration
NEXT_PUBLIC_SOLANA_RPC_URL=https://rpc.testnet.soo.network/rpc
NEXT_PUBLIC_SOLANA_NETWORK=soon-testnet
NEXT_PUBLIC_ODV_PROGRAM_ID=4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA

# Supabase (keep existing)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

---

## 🔍 Testing the Deployment

### 1. Connect Wallet

Open your app and connect a SOON-compatible wallet (Phantom, Solflare).

### 2. Create Test Campaign

```bash
# Use the admin interface
http://localhost:3000/admin
```

### 3. Verify on Explorer

Check all transactions on: https://explorer.testnet.soo.network/

---

## 📊 SOON Testnet vs Solana Devnet

| Feature | Solana Devnet | SOON Testnet |
|---------|---------------|--------------|
| **RPC URL** | `https://api.devnet.solana.com` | `https://rpc.testnet.soo.network/rpc` |
| **Explorer** | `explorer.solana.com` | `explorer.testnet.soo.network` |
| **Faucet** | `solana airdrop` | `faucet.soo.network` |
| **Compatibility** | Native Solana | 100% Solana-compatible (SVM) |
| **Transaction Fees** | Standard | ~90% cheaper |
| **Finality** | ~13 seconds | Faster |
| **Network Type** | Solana L1 | Ethereum-based SVM Rollup |

---

## 🐛 Common Issues & Solutions

### Issue 1: "Insufficient funds"

**Solution:**
```bash
# Request more SOL from faucet
solana airdrop 5
```

### Issue 2: "Program ID mismatch"

**Solution:**
1. Get current program ID: `solana address -k target/deploy/odv_escrow-keypair.json`
2. Update `lib.rs` with new ID
3. Rebuild: `anchor build`
4. Redeploy

### Issue 3: "RPC request failed"

**Solution:**
```bash
# Verify RPC configuration
solana config get

# Should show SOON Testnet RPC
# If not, reset:
solana config set --url https://rpc.testnet.soo.network/rpc
```

### Issue 4: "Transaction timeout"

**Solution:**
- SOON Testnet may be slower during peak times
- Wait and retry
- Check network status: https://explorer.testnet.soo.network/

---

## 🔗 Useful Links

- **SOON Explorer**: https://explorer.testnet.soo.network/
- **SOON Faucet**: https://faucet.soo.network/
- **SOON Docs**: https://docs.soo.network/
- **SOON RPC**: https://rpc.testnet.soo.network/rpc
- **Example dApp**: https://github.com/rkmonarch/soon-app

---

## ✅ Deployment Checklist

- [ ] Solana CLI configured for SOON Testnet
- [ ] Wallet has sufficient SOL (2+ SOL)
- [ ] Smart contract built successfully
- [ ] Program ID verified in code
- [ ] Program deployed to SOON Testnet
- [ ] Deployment verified on explorer
- [ ] Platform initialized (one-time setup)
- [ ] Environment variables updated
- [ ] Frontend connects to SOON Testnet
- [ ] Test transaction successful

---

## 🎯 Next Steps After Deployment

1. **Test Core Functions**
   - Create a test project
   - Back a project with $1
   - Submit milestone proof
   - Approve milestone (admin)

2. **Monitor Performance**
   - Check transaction costs
   - Verify finality times
   - Monitor explorer for activity

3. **Update Documentation**
   - Share SOON Testnet URLs with users
   - Update README with new network info
   - Create user guide for SOON wallets

4. **Prepare for Mainnet**
   - Once testing is complete
   - Deploy to SOON Mainnet
   - Use production RPC: `https://rpc.mainnet.soo.network/rpc`

---

## 🚨 Important Notes

1. **Network Compatibility**: SOON Network is 100% Solana-compatible (SVM). Your Anchor program requires NO code changes.

2. **Wallet Support**: All Solana wallets (Phantom, Solflare, etc.) work on SOON.

3. **Faucet Limits**: 10 SOL max every 10 hours per address/IP.

4. **Program ID**: Keep the same across networks for consistency, or generate new ones per network.

5. **Explorer**: Always use SOON Explorer for SOON transactions, not Solana Explorer.

---

**Status**: ✅ Configuration complete. Ready to deploy!

**Need Help?**
- SOON Discord: https://discord.gg/soon
- SOON Docs: https://docs.soo.network/
