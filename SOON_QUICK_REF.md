# 🚀 SOON Testnet Quick Reference

## Network Info
- **RPC**: `https://rpc.testnet.soo.network/rpc`
- **WebSocket**: `wss://rpc.testnet.soo.network/rpc`
- **Explorer**: https://explorer.testnet.soo.network
- **Faucet**: https://faucet.soo.network/

## Quick Commands

### Setup
```bash
# Configure CLI
solana config set --url https://rpc.testnet.soo.network/rpc

# Check config
solana config get

# Get wallet address
solana address
```

### Get Test Tokens
```bash
# Method 1: CLI (max 10 SOL per 10 hours)
solana airdrop 5

# Method 2: Web
# Visit: https://faucet.soo.network/
```

### Deploy Smart Contract
```bash
# Option 1: Automated script
./scripts/deploy-soon-testnet.sh

# Option 2: Manual
cd anchor
anchor clean
anchor build
anchor deploy
```

### Initialize Platform
```bash
# After deployment
npx ts-node anchor/scripts/initialize-platform.ts

# Or use web interface
# http://localhost:3000/admin/initialize
```

### Check Deployment
```bash
# Check program
solana program show YOUR_PROGRAM_ID

# Check balance
solana balance
```

## Program Info
- **Program ID**: `4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA`
- **Network**: SOON Testnet
- **Type**: Anchor (Rust)

## Environment Variables
```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://rpc.testnet.soo.network/rpc
NEXT_PUBLIC_SOLANA_NETWORK=soon-testnet
NEXT_PUBLIC_ODV_PROGRAM_ID=4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA
```

## Explorer Links
- **Your Program**: https://explorer.testnet.soo.network/address/4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA
- **Your Wallet**: https://explorer.testnet.soo.network/address/YOUR_WALLET_ADDRESS

## Troubleshooting

### "Insufficient funds"
```bash
solana airdrop 5
# Or visit: https://faucet.soo.network/
```

### "RPC request failed"
```bash
solana config set --url https://rpc.testnet.soo.network/rpc
```

### "Program ID mismatch"
1. Get ID: `solana address -k anchor/target/deploy/odv_escrow-keypair.json`
2. Update `lib.rs` line 3: `declare_id!("YOUR_ID");`
3. Rebuild: `anchor build`

## Useful Scripts
```bash
# First-time setup
./scripts/setup-soon.sh

# Full deployment
./scripts/deploy-soon-testnet.sh
```

## Key Differences from Solana Devnet
- ✅ Same API/SDK (100% compatible)
- ✅ All Solana wallets work
- ✅ ~90% cheaper fees
- ✅ Faster finality
- ⚠️ Different RPC endpoint
- ⚠️ Different explorer
- ⚠️ Different faucet

## Resources
- **SOON Docs**: https://docs.soo.network/
- **SOON Discord**: https://discord.gg/soon
- **Example dApp**: https://github.com/rkmonarch/soon-app
