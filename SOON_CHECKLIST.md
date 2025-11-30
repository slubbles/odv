# ✅ SOON Network Integration Checklist

## 🎯 Quick Start (5 Minutes)

Follow these steps to get running on SOON Network:

### 1️⃣ Run Setup Script
```bash
cd /workspaces/odv
./scripts/setup-soon-network.sh
```

**What it does:**
- ✅ Checks prerequisites
- ✅ Configures Solana CLI
- ✅ Requests test tokens
- ✅ Updates environment variables
- ✅ Builds & deploys program (optional)

### 2️⃣ Start Development Server
```bash
npm run dev
```

Open http://localhost:3000

### 3️⃣ Configure Your Wallet

**Phantom:**
1. Settings → Developer Settings → Change Network
2. Custom RPC: `https://rpc.testnet.soo.network/rpc`

**Solflare:**
1. Settings → Network → Custom
2. RPC: `https://rpc.testnet.soo.network/rpc`

### 4️⃣ Test Connection
1. Click "Connect Wallet"
2. Approve connection
3. Verify wallet address shows

### 5️⃣ Test Transaction
1. Browse projects
2. Click "Back This Project"
3. Approve transaction
4. View on explorer: https://explorer.testnet.soo.network

---

## 📋 Manual Setup (Alternative)

If you prefer manual setup:

### Step 1: Configure Solana CLI
```bash
solana config set --url https://rpc.testnet.soo.network/rpc
```

### Step 2: Get Test Tokens
```bash
# Get your wallet address
solana address

# Visit the faucet (opens in browser)
"$BROWSER" https://faucet.soo.network/

# Or copy your address and visit manually:
# https://faucet.soo.network/

# Check balance after requesting
solana balance
```

### Step 3: Deploy Program (Optional)
```bash
cd anchor
anchor build
anchor deploy --provider.cluster https://rpc.testnet.soo.network/rpc
```

### Step 4: Update Environment
`.env.local` is already configured! Just verify:
```bash
cat .env.local | grep NEXT_PUBLIC_SOLANA
```

Should show:
```
NEXT_PUBLIC_SOLANA_RPC_URL=https://rpc.testnet.soo.network/rpc
NEXT_PUBLIC_SOLANA_NETWORK=soon-testnet
NEXT_PUBLIC_SOON_EXPLORER_URL=https://explorer.testnet.soo.network
```

---

## 🔍 Verification

Run these commands to verify everything is set up:

```bash
# 1. Check Solana CLI config
solana config get

# 2. Check balance (should be > 0)
solana balance

# 3. Check environment
grep SOLANA .env.local

# 4. Test RPC endpoint
curl -X POST https://rpc.testnet.soo.network/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}'

# 5. Start dev server
npm run dev
```

---

## 📚 Documentation Quick Links

| Document | What's Inside |
|----------|---------------|
| [SOON_NETWORK_MIGRATION.md](./SOON_NETWORK_MIGRATION.md) | Complete step-by-step guide (350+ lines) |
| [SOON_NETWORK_QUICK_REF.md](./SOON_NETWORK_QUICK_REF.md) | Commands & URLs reference |
| [SOON_NETWORK_INTEGRATION_SUMMARY.md](./SOON_NETWORK_INTEGRATION_SUMMARY.md) | What changed and why |

---

## 🚨 Troubleshooting

### Problem: "Wallet won't connect"
**Solution:**
```bash
# Make sure wallet is configured for SOON Network
# In Phantom: Settings → Developer Settings → Custom RPC
# Enter: https://rpc.testnet.soo.network/rpc
```

### Problem: "Insufficient funds"
**Solution:**
```bash
# Get your wallet address
solana address

# Visit the web faucet and request tokens
# https://faucet.soo.network/

# Note: There may be rate limits - wait between requests
```

### Problem: "Transaction fails"
**Solution:**
```bash
# Check balance
solana balance

# View recent transactions
solana transaction-history $(solana address) --limit 5
```

### Problem: "Program not found"
**Solution:**
```bash
# Verify program is deployed
solana program show YOUR_PROGRAM_ID

# Redeploy if needed
cd anchor && anchor deploy --provider.cluster https://rpc.testnet.soo.network/rpc
```

---

## 🎯 What to Test

After setup, test these features:

- [ ] Wallet connection (Phantom/Solflare)
- [ ] Browse projects without wallet
- [ ] View project details
- [ ] Back a project ($1 transaction)
- [ ] Create new project
- [ ] Submit milestone proof
- [ ] View transaction on SOON Explorer
- [ ] Check balance updates
- [ ] Test on mobile (responsive design)

---

## 🌐 Important URLs

| Resource | URL |
|----------|-----|
| **Testnet RPC** | `https://rpc.testnet.soo.network/rpc` |
| **Explorer** | https://explorer.testnet.soo.network |
| **Faucet** | https://faucet.soo.network |
| **Documentation** | https://docs.soo.network |
| **Discord** | https://discord.gg/soon-network |

---

## 💡 Pro Tips

1. **Bookmark the faucet** - https://faucet.soo.network/ (web GUI for testnet)
2. **Use the quick ref** - `SOON_NETWORK_QUICK_REF.md` has common commands
3. **Check the explorer** - Verify all transactions there
4. **Keep CLI updated** - Run `solana-install update` periodically
5. **Switch networks easily** - Just change `.env.local` and restart
6. **Testnet vs Faucet Devnet** - We use Testnet (production-like); Faucet Devnet has CLI airdrops

---

## ✨ What's New

Your codebase now has:

✅ **Network Auto-Detection**
```typescript
import { isSoonNetwork, getNetworkConfig } from '@/lib/solana/network-utils';

if (isSoonNetwork()) {
  console.log('Using SOON Network! ⚡');
}
```

✅ **Smart Explorer Links**
```typescript
import { getExplorerTransactionUrl } from '@/lib/solana/network-utils';

const url = getExplorerTransactionUrl(signature);
// Returns: https://explorer.testnet.soo.network/tx/{signature}
```

✅ **Network-Aware Transactions**
```typescript
import { confirmTransaction } from '@/lib/solana/transaction';

await confirmTransaction(connection, signature);
// Automatically uses optimal retry settings for SOON
```

---

## 🎊 Success!

When everything works, you'll see:

1. ✅ Wallet connects to SOON Testnet
2. ✅ Balance shows test SOON tokens
3. ✅ Transactions execute in ~1 second
4. ✅ Explorer shows your transactions
5. ✅ Program calls work perfectly
6. ✅ 90% lower fees than Solana 🎉

---

## 🔄 Switch Back to Solana?

Easy! Just update `.env.local`:

```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

Restart dev server. Done! ✅

---

## 📞 Need Help?

1. Check `SOON_NETWORK_MIGRATION.md` troubleshooting section
2. Review `SOON_NETWORK_QUICK_REF.md` for commands
3. Visit SOON Network Discord
4. Read https://docs.soo.network

---

**Ready to launch on SOON Network! 🚀**

*Lower fees. Faster finality. Same Solana experience.*
