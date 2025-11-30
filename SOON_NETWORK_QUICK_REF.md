# ⚡ SOON Network Quick Reference

## 🔗 Essential Links

| Resource | URL |
|----------|-----|
| **Testnet RPC** | `https://rpc.testnet.soo.network/rpc` |
| **Devnet RPC** | `https://rpc.devnet.soo.network/rpc` |
| **Testnet Explorer** | https://explorer.testnet.soo.network |
| **Devnet Explorer** | https://explorer.devnet.soo.network |
| **Faucet** | https://faucet.testnet.soo.network |
| **Documentation** | https://docs.soo.network |

## 🚀 Quick Setup Commands

```bash
# 1. Configure Solana CLI for SOON Network
solana config set --url https://rpc.testnet.soo.network/rpc

# 2. Create/use keypair
solana-keygen new --outfile ~/.config/solana/soon-keypair.json
solana config set --keypair ~/.config/solana/soon-keypair.json

# 3. Get test tokens (replace with your address)
curl -X POST https://faucet.testnet.soo.network/api/faucet \
  -H "Content-Type: application/json" \
  -d '{"address": "YOUR_WALLET_ADDRESS"}'

# 4. Check balance
solana balance

# 5. Deploy program
cd anchor
anchor build
anchor deploy --provider.cluster https://rpc.testnet.soo.network/rpc
```

## 📋 Environment Variables

```bash
# SOON Testnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://rpc.testnet.soo.network/rpc
NEXT_PUBLIC_SOLANA_NETWORK=soon-testnet
NEXT_PUBLIC_SOON_EXPLORER_URL=https://explorer.testnet.soo.network

# SOON Devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://rpc.devnet.soo.network/rpc
NEXT_PUBLIC_SOLANA_NETWORK=soon-devnet
NEXT_PUBLIC_SOON_EXPLORER_URL=https://explorer.devnet.soo.network
```

## 🔍 View on Explorer

- **Transaction**: `https://explorer.testnet.soo.network/tx/{signature}`
- **Account**: `https://explorer.testnet.soo.network/address/{pubkey}`
- **Program**: `https://explorer.testnet.soo.network/address/{program_id}`

## 💰 Faucet API

### Request Tokens (cURL)
```bash
curl -X POST https://faucet.testnet.soo.network/api/faucet \
  -H "Content-Type: application/json" \
  -d '{"address": "YOUR_WALLET_ADDRESS"}'
```

### Request Tokens (JavaScript)
```javascript
const response = await fetch('https://faucet.testnet.soo.network/api/faucet', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ address: walletAddress })
});
const data = await response.json();
```

## ⚙️ Anchor Configuration

### Anchor.toml
```toml
[programs.soon-testnet]
odv_escrow = "YOUR_PROGRAM_ID"

[provider]
cluster = "https://rpc.testnet.soo.network/rpc"
wallet = "~/.config/solana/soon-keypair.json"
```

### Deploy Commands
```bash
# Build
anchor build

# Get program ID
solana address -k target/deploy/odv_escrow-keypair.json

# Deploy to SOON testnet
anchor deploy --provider.cluster https://rpc.testnet.soo.network/rpc

# Verify deployment
solana program show YOUR_PROGRAM_ID
```

## 🧪 Testing

### Run Tests on SOON Network
```bash
anchor test --provider.cluster https://rpc.testnet.soo.network/rpc
```

### Check Program Logs
```bash
solana logs --url https://rpc.testnet.soo.network/rpc
```

## 🌐 Network Info

| Feature | SOON Network | Solana Devnet |
|---------|-------------|---------------|
| **Block Time** | ~400ms | ~400ms |
| **Finality** | Faster | Standard |
| **TPS** | High | Moderate |
| **Fees** | ~90% lower | Standard |
| **Compatibility** | 100% SVM | Native |

## 🔑 Key Differences

### SOON vs Solana
- ✅ **Same VM**: Solana programs work without changes
- ✅ **Lower Fees**: Ethereum L2 rollup benefits
- ✅ **Faster Finality**: Optimized consensus
- ✅ **Full Compatibility**: SPL tokens, wallets, tools all work

### What Doesn't Change
- Smart contract code (Rust/Anchor)
- Wallet adapters (Phantom, Solflare)
- SPL token standards
- Program deployment process
- Transaction structure

### What Changes
- RPC endpoint URL
- Explorer URL
- Faucet source

## 📱 Wallet Configuration

### Phantom Wallet
1. Open Phantom
2. Settings → Developer Settings
3. Change Network → Custom RPC
4. Enter: `https://rpc.testnet.soo.network/rpc`
5. Save

### Solflare Wallet
1. Open Solflare
2. Settings → Network
3. Custom → Add Network
4. Name: SOON Testnet
5. RPC: `https://rpc.testnet.soo.network/rpc`
6. Save and switch

## 🛠️ Useful Commands

```bash
# Check network configuration
solana config get

# View account info
solana account YOUR_ADDRESS --url https://rpc.testnet.soo.network/rpc

# Check program info
solana program show YOUR_PROGRAM_ID --url https://rpc.testnet.soo.network/rpc

# Transfer tokens
solana transfer RECIPIENT_ADDRESS AMOUNT --url https://rpc.testnet.soo.network/rpc

# Create token account
spl-token create-account TOKEN_MINT --url https://rpc.testnet.soo.network/rpc
```

## 🐛 Common Issues

### Issue: Insufficient funds
```bash
# Solution: Request more from faucet
curl -X POST https://faucet.testnet.soo.network/api/faucet \
  -H "Content-Type: application/json" \
  -d '{"address": "YOUR_ADDRESS"}'
```

### Issue: Transaction timeout
```bash
# Solution: Increase confirmation time
const signature = await connection.sendTransaction(transaction, {
  maxRetries: 5,
  preflightCommitment: 'confirmed'
});
```

### Issue: Wallet not connecting
```bash
# Solution: Verify RPC endpoint in wallet settings
# Ensure using: https://rpc.testnet.soo.network/rpc
```

## 📚 Resources

- 📖 **Full Migration Guide**: See `SOON_NETWORK_MIGRATION.md`
- 📝 **SOON Docs**: https://docs.soo.network
- 💬 **Discord**: https://discord.gg/soon-network
- 🐙 **GitHub**: https://github.com/soon-network

## ⚡ Performance Tips

1. **Use `confirmed` commitment**: Faster than `finalized`
2. **Batch transactions**: When possible, combine operations
3. **Cache account info**: Reduce RPC calls
4. **Use websockets**: For real-time updates
5. **Implement retry logic**: Handle temporary network issues

## 🎯 Next Steps

1. ✅ Update `.env.local` with SOON RPC
2. ✅ Get test tokens from faucet
3. ✅ Deploy program to SOON testnet
4. ✅ Test wallet connection
5. ✅ Verify transactions on explorer
6. ✅ Update documentation

---

**Need help?** Check the full migration guide or SOON Network documentation!
