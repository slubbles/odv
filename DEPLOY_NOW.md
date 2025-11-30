# 🚀 Quick Start: Deploy to SOON Network Testnet

**Follow these exact steps in order:**

---

## ✅ STEP 1: Get Test SOL (5 minutes)

### What to do:
1. Open in your browser: **https://faucet.testnet.soo.network/**
2. Enter this address: `4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw`
3. Complete captcha and request tokens
4. Wait 1-2 minutes

### Verify:
```bash
solana balance
```
Should show: `5 SOL` (or similar)

**If 0 SOL:** Wait another minute and check again.

---

## ✅ STEP 2: Run Automated Deployment (5 minutes)

### Command:
```bash
cd /workspaces/odv/anchor && bash scripts/deploy.sh
```

### What it does:
- ✅ Checks your configuration
- ✅ Verifies build artifacts
- ✅ Deploys smart contract
- ✅ Copies IDL to frontend
- ✅ Confirms deployment on explorer

### Expected Output:
```
╔══════════════════════════════════════════════════════════╗
║   ODV Smart Contract - SOON Network Testnet Deployment   ║
╚══════════════════════════════════════════════════════════╝

...

✅ Smart Contract Deployed Successfully

Program ID: Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
```

**If deployment fails:** See troubleshooting in `TESTNET_DEPLOYMENT_GUIDE.md`

---

## ✅ STEP 3: Initialize Platform (2 minutes)

### Command:
```bash
cd /workspaces/odv/anchor && npx ts-node scripts/initialize-platform.ts
```

### What it does:
- Creates the PlatformConfig PDA on-chain
- Sets fixed backing amount to $1 USDC
- Makes you the platform admin

### Expected Output:
```
🚀 Initializing ODV Platform on SOON Network Testnet...

✅ Platform successfully initialized!

Transaction: https://explorer.testnet.soo.network/tx/...

🎉 ODV Platform is now live on SOON Network Testnet!
```

**If "already initialized":** That's OK! Platform is ready. Skip to Step 4.

---

## ✅ STEP 4: Verify Everything Works (1 minute)

### Check Deployment:
```bash
solana program show Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
```

### Check Platform Config:
Visit explorer to see your deployed program:
```
https://explorer.testnet.soo.network/address/Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
```

### Check Frontend Files:
```bash
ls -lh /workspaces/odv/src/lib/solana/idl/odv_escrow.json
ls -lh /workspaces/odv/src/lib/solana/types/odv_escrow.ts
```
Both should exist.

---

## 🎉 You're Done!

**What you now have:**
- ✅ Smart contract deployed to SOON Network Testnet
- ✅ Platform initialized with $1 USDC backing
- ✅ IDL and types available for frontend
- ✅ Ready to create campaigns and test!

---

## 🧪 Optional: Test the Smart Contract

### Create a Test Campaign:

See full testing guide in `TESTING_GUIDE.md`, or run quick test:

```bash
cd /workspaces/odv/anchor && anchor test --skip-local-validator --skip-deploy
```

---

## 📊 Deployment Summary

| Item | Value |
|------|-------|
| **Program ID** | `Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS` |
| **Network** | SOON Network Testnet |
| **RPC Endpoint** | `https://rpc.testnet.soo.network/rpc` |
| **Explorer** | https://explorer.testnet.soo.network |
| **Your Wallet** | `4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw` |
| **Admin Wallet** | Same as your wallet |
| **Fixed Backing** | 1 USDC (1,000,000 smallest units) |

---

## 🆘 Troubleshooting

### "Insufficient funds"
→ Get more test SOL from https://faucet.testnet.soo.network

### "Program already deployed"  
→ That's fine! Skip deployment, go to Step 3 (initialize)

### "Platform already initialized"
→ That's fine! You're done. Test the platform.

### "Command not found: npx"
→ Run: `npm install -g npx` then retry

### "Cannot find module"
→ Run: `cd /workspaces/odv/anchor && npm install` then retry

---

## 📚 Full Documentation

For detailed explanations, see:
- **Complete Guide**: `TESTNET_DEPLOYMENT_GUIDE.md`
- **Testing Instructions**: `TESTING_GUIDE.md`  
- **User Flow**: `SMART_CONTRACT_USER_FLOW.md`
- **Security Details**: `SMART_CONTRACT_SECURITY_FIXES.md`

---

**Total Time**: ~13 minutes  
**Difficulty**: Easy (just copy/paste commands)  
**Status**: Ready to Deploy! 🚀
