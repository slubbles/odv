# 🚀 SOON Network Testnet Deployment Guide

**Date**: November 30, 2025  
**Network**: SOON Network Testnet (SVM Rollup)  
**Status**: Ready for Deployment

---

## 📋 Pre-Deployment Checklist

- [x] Smart contract built successfully (268KB)
- [x] All security fixes applied
- [x] IDL generated (19KB, 11 instructions)
- [x] Wallet configured: `4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw`
- [x] RPC endpoint set: `https://rpc.testnet.soo.network/rpc`
- [ ] **Test SOL acquired** ← START HERE

---

## 🎯 Deployment Overview

**Total Time**: ~30-45 minutes  
**Steps**: 8 main steps  
**Prerequisites**: None (we'll get test SOL first)

---

## 📍 STEP 1: Get Test SOL from SOON Faucet

### What You Need to Do:

1. **Open the SOON Faucet in your browser**:
   ```
   https://faucet.testnet.soo.network/
   ```

2. **Enter your wallet address**:
   ```
   4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw
   ```

3. **Complete the captcha and request tokens**

4. **Wait 30-60 seconds** for tokens to arrive

### Verification Command:

Run this in your terminal to verify you received the tokens:

```bash
solana balance
```

**Expected Output**: 
```
5 SOL  # or similar amount
```

**If balance is 0**: Wait a bit longer and check again. Sometimes it takes 2-3 minutes.

---

## 📍 STEP 2: Verify Build Artifacts

### Automated Check:

```bash
cd /workspaces/odv/anchor && \
echo "=== Checking build artifacts ===" && \
ls -lh target/deploy/odv_escrow.so && \
ls -lh target/deploy/odv_escrow-keypair.json && \
echo "✅ Build artifacts present"
```

**Expected Output**:
```
=== Checking build artifacts ===
-rwxr-xr-x ... 268K ... target/deploy/odv_escrow.so
-rw-r--r-- ... 154  ... target/deploy/odv_escrow-keypair.json
✅ Build artifacts present
```

**If files are missing**: Run `anchor build --skip-lint` again.

---

## 📍 STEP 3: Update Anchor.toml Configuration

### What You Need to Do:

**Option A: Automated Update**

```bash
cd /workspaces/odv/anchor && \
cat > Anchor.toml << 'EOF'
[toolchain]

[features]
seeds = false
skip-lint = false

[programs.testnet]
odv_escrow = "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "testnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
EOF
echo "✅ Anchor.toml updated for testnet"
```

**Option B: Manual Update** (if you prefer)

Edit `/workspaces/odv/anchor/Anchor.toml`:
- Change `[programs.localnet]` → `[programs.testnet]`
- Change `cluster = "devnet"` → `cluster = "testnet"`

---

## 📍 STEP 4: Set Solana Config to Testnet

### Command:

```bash
solana config set --url https://rpc.testnet.soo.network/rpc
```

**Expected Output**:
```
Config File: /home/codespace/.config/solana/cli/config.yml
RPC URL: https://rpc.testnet.soo.network/rpc 
WebSocket URL: wss://rpc.testnet.soo.network/rpc (computed)
Keypair Path: /home/codespace/.config/solana/id.json 
Commitment: confirmed
```

---

## 📍 STEP 5: Deploy Smart Contract to SOON Network

### Command:

```bash
cd /workspaces/odv/anchor && \
anchor deploy --provider.cluster testnet
```

**Expected Output** (this will take 2-3 minutes):
```
Deploying cluster: testnet
Upgrade authority: 4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw
Deploying program "odv_escrow"...
Program path: /workspaces/odv/anchor/target/deploy/odv_escrow.so...
Program Id: Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS

Deploy success
```

### ⚠️ If Deployment Fails:

**Error: Insufficient funds**
```bash
# Get more test SOL from faucet
# Then retry deployment
```

**Error: Program already deployed**
```bash
# This is OK! Skip to Step 6
```

**Error: Network timeout**
```bash
# Wait 1 minute and retry
anchor deploy --provider.cluster testnet
```

---

## 📍 STEP 6: Verify Deployment on Explorer

### What You Need to Do:

1. **Open SOON Network Explorer**:
   ```
   https://explorer.testnet.soo.network/address/Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
   ```

2. **Check the program page loads** (you should see your program details)

3. **Look for**:
   - ✅ Program ID: `Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS`
   - ✅ Type: "Program"
   - ✅ Upgrade Authority: Your wallet address

**Screenshot this page for your records!**

---

## 📍 STEP 7: Copy IDL and Types to Frontend

### Commands:

```bash
cd /workspaces/odv && \

# Create directory for smart contract artifacts
mkdir -p src/lib/solana/idl && \

# Copy IDL
cp anchor/target/idl/odv_escrow.json src/lib/solana/idl/ && \

# Copy TypeScript types
cp anchor/target/types/odv_escrow.ts src/lib/solana/types/ && \

echo "✅ IDL and types copied to frontend"
```

**Verification**:
```bash
ls -lh src/lib/solana/idl/odv_escrow.json
ls -lh src/lib/solana/types/odv_escrow.ts
```

---

## 📍 STEP 8: Update Frontend Configuration

### What You Need to Do:

Create or update the program ID configuration file:

```bash
cat > /workspaces/odv/src/lib/solana/config.ts << 'EOF'
import { PublicKey } from '@solana/web3.js';

// SOON Network Testnet Configuration
export const PROGRAM_ID = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');
export const NETWORK = 'testnet';
export const RPC_ENDPOINT = 'https://rpc.testnet.soo.network/rpc';

// Platform Admin (your wallet)
export const PLATFORM_ADMIN = new PublicKey('4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw');

// Fixed backing amount (1 USDC = 1_000_000 smallest units)
export const FIXED_BACKING_AMOUNT = 1_000_000;

// Platform Config PDA
export const PLATFORM_CONFIG_SEED = 'platform_config';
EOF

echo "✅ Frontend configuration created"
```

---

## 🎉 DEPLOYMENT COMPLETE!

Your smart contract is now deployed to SOON Network Testnet!

**Deployed Program**: `Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS`  
**Network**: SOON Network Testnet  
**RPC**: `https://rpc.testnet.soo.network/rpc`  
**Explorer**: https://explorer.testnet.soo.network

---

## 🧪 NEXT STEPS: Initialize Platform

Before anyone can use the platform, you need to initialize the PlatformConfig PDA.

### Option 1: Quick Initialization Script

Save this as `scripts/initialize-platform.ts`:

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { OdvEscrow } from "../target/types/odv_escrow";
import { PublicKey } from "@solana/web3.js";

async function initializePlatform() {
  // Setup
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  
  const program = anchor.workspace.OdvEscrow as Program<OdvEscrow>;
  
  // Platform Config PDA
  const [platformConfigPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("platform_config")],
    program.programId
  );
  
  console.log("Platform Config PDA:", platformConfigPDA.toString());
  console.log("Admin:", provider.wallet.publicKey.toString());
  console.log("Program ID:", program.programId.toString());
  
  // Fixed backing amount: 1 USDC = 1,000,000 smallest units
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
    console.log("Transaction signature:", tx);
    console.log("Explorer:", `https://explorer.testnet.soo.network/tx/${tx}`);
    
  } catch (error) {
    console.error("Error initializing platform:", error);
  }
}

initializePlatform();
```

**Run it**:
```bash
cd /workspaces/odv/anchor && \
npx ts-node scripts/initialize-platform.ts
```

### Option 2: Manual Initialization via Anchor Test

Add to `tests/odv_escrow.ts`:

```typescript
it("Initialize Platform", async () => {
  const [platformConfigPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("platform_config")],
    program.programId
  );

  const fixedBackingAmount = new anchor.BN(1_000_000); // 1 USDC

  const tx = await program.methods
    .initializePlatform(fixedBackingAmount)
    .accounts({
      platformConfig: platformConfigPDA,
      admin: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();

  console.log("Platform initialized:", tx);
});
```

**Run it**:
```bash
cd /workspaces/odv/anchor && \
anchor test --skip-local-validator --skip-deploy
```

---

## 🔍 Verification Checklist

After deployment and initialization, verify everything works:

### 1. Check Program Deployment
```bash
solana program show Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
```

**Expected**: Program details with your wallet as upgrade authority

### 2. Check Platform Config PDA

```bash
# Calculate PDA address
solana address --keypair <(echo '[platform_config]' | base58 -d)

# Or use this script
cd /workspaces/odv/anchor && \
node -e "
const anchor = require('@coral-xyz/anchor');
const { PublicKey } = require('@solana/web3.js');
const programId = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');
const [pda] = PublicKey.findProgramAddressSync([Buffer.from('platform_config')], programId);
console.log('Platform Config PDA:', pda.toString());
"
```

### 3. Check Balance After Deployment
```bash
solana balance
```

**Expected**: Should have remaining SOL (deployment costs ~0.5-1 SOL)

### 4. Test Creating a Campaign (Optional)

See `TESTING_GUIDE.md` for complete testing instructions.

---

## 🐛 Troubleshooting

### Issue: "Insufficient funds for transaction"
**Solution**: Get more test SOL from faucet

### Issue: "Program already deployed"
**Solution**: This is fine! Program is already on-chain. Skip to initialization.

### Issue: "Transaction simulation failed"
**Solution**: 
1. Check your SOL balance: `solana balance`
2. Verify RPC endpoint: `solana config get`
3. Try again in 1-2 minutes (network congestion)

### Issue: "Failed to get recent blockhash"
**Solution**: Network issue. Wait 1 minute and retry.

### Issue: "Cannot find IDL"
**Solution**: 
```bash
cd /workspaces/odv/anchor && anchor build --skip-lint
```

---

## 📊 Post-Deployment Monitoring

### Check Transaction History
```bash
# View recent transactions for your wallet
solana transaction-history 4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw
```

### Check Program Logs
Visit explorer and click on recent transactions to see program logs.

### Monitor Platform Activity
Use the SOON Network explorer to watch for:
- Campaign creations
- Funding transactions  
- Milestone submissions
- Fund releases

---

## 📚 Resources

- **SOON Network Testnet Explorer**: https://explorer.testnet.soo.network
- **SOON Network Faucet**: https://faucet.testnet.soo.network
- **SOON Network Docs**: https://docs.soo.network
- **RPC Endpoint**: https://rpc.testnet.soo.network/rpc
- **Your Program**: https://explorer.testnet.soo.network/address/Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS

---

## ✅ Deployment Summary

Once complete, you'll have:

- ✅ Smart contract deployed to SOON Network Testnet
- ✅ Program ID: `Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS`
- ✅ Platform initialized with $1 USDC backing amount
- ✅ IDL and types available in frontend
- ✅ Ready to create campaigns and test complete user flows

---

**Need Help?** 
- Check the troubleshooting section above
- Review the full smart contract documentation in `SMART_CONTRACT_USER_FLOW.md`
- Test individual instructions using the testing guide in `TESTING_GUIDE.md`

**Ready to go live?** See `MAINNET_DEPLOYMENT.md` when you're ready for production.
