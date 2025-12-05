# 🔐 ODV Credentials & Secrets

**⚠️ SENSITIVE - DO NOT COMMIT TO PUBLIC REPO**

> Save this file securely (password manager, encrypted storage) and delete from repo.

---

## 🔗 Blockchain / Smart Contract

### Program (Smart Contract)
| Key | Value |
|-----|-------|
| **Program ID** | `4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA` |
| **Network** | SOON Testnet |
| **Upgrade Authority** | `4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw` |

### Test USDC Token
| Key | Value |
|-----|-------|
| **Mint Address** | `3PNhmxDckddYL24zEfrsHLFLXXvrdzBBoZgfRW8rruDs` |
| **Decimals** | 6 |
| **Symbol** | USDC |
| **Network** | SOON Testnet |

### Admin Wallet
| Key | Value |
|-----|-------|
| **Public Key** | `4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw` |
| **Keypair Path** | `~/.config/solana/id.json` |

### Platform Config PDA
| Key | Value |
|-----|-------|
| **Seed** | `platform_config` |
| **Address** | Derived from program |

---

## 🌐 Network Configuration

### SOON Testnet
| Key | Value |
|-----|-------|
| **RPC URL** | `https://rpc.testnet.soo.network/rpc` |
| **WebSocket** | `wss://rpc.testnet.soo.network/rpc` |
| **Explorer** | `https://explorer.testnet.soo.network` |
| **Faucet** | `https://faucet.soo.network/` |

### SOON Devnet (Backup)
| Key | Value |
|-----|-------|
| **RPC URL** | `https://rpc.devnet.soo.network/rpc` |
| **Explorer** | `https://explorer.devnet.soo.network` |

---

## 🗄️ Database (Supabase)

| Key | Value |
|-----|-------|
| **Project URL** | `https://zsfujmvltpumleszcrwh.supabase.co` |
| **Project ID** | `zsfujmvltpumleszcrwh` |
| **Anon Key** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZnVqbXZsdHB1bWxlc3pjcndoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NjY1MjIsImV4cCI6MjA3OTQ0MjUyMn0.Oo17LARoqRirRqtX_RZtouINBzyTRiUv3mSM6e3zNQM` |

### Database Tables
- `projects` - Project data
- `milestones` - Milestone tracking
- `backings` - User backing records
- `users` - User profiles
- `comments` - Project comments
- `notifications` - User notifications
- `transactions` - Blockchain tx records

---

## 🚀 Deployment (Vercel)

| Key | Value |
|-----|-------|
| **Platform** | Vercel |
| **Domain (Custom)** | `onedollarventures.com` (pending DNS) |
| **Branch** | `deployed-soon-testnet-frontend-integrated` |

### Environment Variables (set in Vercel)
```
NEXT_PUBLIC_SOLANA_RPC_URL=https://rpc.testnet.soo.network/rpc
NEXT_PUBLIC_SOLANA_NETWORK=soon-testnet
NEXT_PUBLIC_CLUSTER=soon-testnet
NEXT_PUBLIC_PROGRAM_ID=4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA
NEXT_PUBLIC_USDC_MINT=3PNhmxDckddYL24zEfrsHLFLXXvrdzBBoZgfRW8rruDs
NEXT_PUBLIC_PLATFORM_ADMIN=4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw
NEXT_PUBLIC_SUPABASE_URL=https://zsfujmvltpumleszcrwh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[see above]
```

---

## 📂 GitHub

| Key | Value |
|-----|-------|
| **Repository** | `slubbles/odv` |
| **Main Branch** | `master` |
| **Deployment Branch** | `deployed-soon-testnet-frontend-integrated` |
| **Visibility** | Private (recommended) |

---

## 🔑 Key Files Location

| File | Path | Contains |
|------|------|----------|
| **Wallet Keypair** | `~/.config/solana/id.json` | Private key (NEVER SHARE) |
| **Program Keypair** | `anchor/target/deploy/odv_escrow-keypair.json` | Program upgrade key |
| **IDL** | `src/lib/solana/idl/odv_escrow.json` | Contract interface |
| **Env Local** | `.env.local` | Environment variables |

---

## 🔒 Security Checklist

- [ ] Wallet keypair backed up securely
- [ ] Program keypair backed up securely
- [ ] `.env.local` in `.gitignore`
- [ ] Supabase service role key NOT exposed (only anon key in frontend)
- [ ] Admin wallet has multi-sig (future)
- [ ] This file saved in password manager

---

## 📊 IDL Summary (Contract Interface)

### Instructions (11 total)
1. `initializePlatform` - One-time setup
2. `createCampaign` - Create project
3. `backCampaign` - Back for $1
4. `submitMilestoneProof` - Submit proof
5. `approveMilestone` - Admin approve
6. `rejectMilestone` - Admin reject
7. `releaseMilestone` - Release funds
8. `withdrawFunds` - Creator withdraw
9. `refundCampaign` - Backer refund
10. `pausePlatform` - Emergency pause
11. `unpausePlatform` - Resume

### Error Codes (10 total)
- `InvalidBackingAmount` (6000)
- `CampaignNotActive` (6001)
- `GoalNotReached` (6002)
- `UnauthorizedAdmin` (6003)
- `MilestoneNotApproved` (6004)
- `InvalidMilestoneIndex` (6005)
- `DeadlinePassed` (6006)
- `PlatformPaused` (6007)
- `AlreadyBacked` (6008)
- `NotBacker` (6009)

---

*Last Updated: December 5, 2025*
