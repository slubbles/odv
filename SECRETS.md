# 🔐 ODV Secrets & Credentials

**⚠️ SENSITIVE - SAVE SECURELY & DELETE FROM REPO**

> Store this file in a password manager or encrypted storage, then remove from repository.

---

## 🔗 Smart Contract / Blockchain

### Program (Deployed Smart Contract)

| Key | Value |
|-----|-------|
| **Program ID** | `4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA` |
| **Network** | SOON Testnet |
| **Upgrade Authority** | `4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw` |
| **Binary Size** | ~268 KB |
| **IDL Path** | `src/lib/solana/idl/odv_escrow.json` |

### Test USDC Token

| Key | Value |
|-----|-------|
| **Mint Address** | `3PNhmxDckddYL24zEfrsHLFLXXvrdzBBoZgfRW8rruDs` |
| **Decimals** | 6 |
| **Symbol** | USDC |
| **Name** | Test USDC |
| **Network** | SOON Testnet |

### Admin / Platform Wallet

| Key | Value |
|-----|-------|
| **Public Key** | `4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw` |
| **Keypair Path** | `~/.config/solana/id.json` |
| **Role** | Platform Admin, Upgrade Authority |

### Platform Config PDA

| Key | Value |
|-----|-------|
| **Seed** | `platform_config` |
| **Fixed Backing Amount** | 1,000,000 (= $1 USDC) |

---

## 🌐 Network Configuration

### SOON Testnet (Primary)

| Key | Value |
|-----|-------|
| **RPC URL** | `https://rpc.testnet.soo.network/rpc` |
| **WebSocket** | `wss://rpc.testnet.soo.network/rpc` |
| **Explorer** | `https://explorer.testnet.soo.network` |
| **Faucet (SOL)** | `https://faucet.soo.network/` |
| **Chain Type** | SVM Rollup (Solana-compatible) |

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
| **Region** | (check Supabase dashboard) |

### Database Tables

- `projects` - Project data, status, funding
- `milestones` - Milestone tracking with proof
- `backings` / `backers` - User backing records
- `users` - User profiles
- `comments` - Project comments
- `notifications` - User notifications
- `transactions` - Blockchain tx records
- `activity_feed` - Platform activity stream
- `follows` - Social following system
- `messages` - Direct messaging
- `user_sessions` - Auth sessions

---

## 🚀 Deployment (Vercel)

| Key | Value |
|-----|-------|
| **Platform** | Vercel |
| **Production Branch** | `deployed-soon-testnet-frontend-integrated` |
| **Default Branch** | `master` |
| **Domain (Pending)** | `onedollarventures.com` |

### Environment Variables (Copy to Vercel)

```bash
# Blockchain
NEXT_PUBLIC_SOLANA_RPC_URL=https://rpc.testnet.soo.network/rpc
NEXT_PUBLIC_SOLANA_NETWORK=soon-testnet
NEXT_PUBLIC_CLUSTER=soon-testnet
NEXT_PUBLIC_PROGRAM_ID=4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA
NEXT_PUBLIC_USDC_MINT=3PNhmxDckddYL24zEfrsHLFLXXvrdzBBoZgfRW8rruDs
NEXT_PUBLIC_PLATFORM_ADMIN=4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw
NEXT_PUBLIC_SOON_EXPLORER_URL=https://explorer.testnet.soo.network

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://zsfujmvltpumleszcrwh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZnVqbXZsdHB1bWxlc3pjcndoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NjY1MjIsImV4cCI6MjA3OTQ0MjUyMn0.Oo17LARoqRirRqtX_RZtouINBzyTRiUv3mSM6e3zNQM
```

---

## 📂 GitHub

| Key | Value |
|-----|-------|
| **Repository** | `slubbles/odv` |
| **Default Branch** | `master` |
| **Deployment Branch** | `deployed-soon-testnet-frontend-integrated` |
| **Visibility** | Private (recommended) |

---

## 🔑 Key Files Location

| File | Path | Contains |
|------|------|----------|
| **Wallet Keypair** | `~/.config/solana/id.json` | Admin private key (**NEVER SHARE**) |
| **Program Keypair** | `anchor/target/deploy/odv_escrow-keypair.json` | Program upgrade authority |
| **IDL** | `src/lib/solana/idl/odv_escrow.json` | Contract interface definition |
| **Env Local** | `.env.local` | Local environment variables |

---

## 📊 IDL Reference (Smart Contract Interface)

### Instructions (11 Total)

| # | Instruction | Description | Authority |
|---|-------------|-------------|-----------|
| 1 | `initialize_platform` | One-time platform setup | Admin |
| 2 | `update_backing_amount` | Change $1 amount | Admin |
| 3 | `pause_platform` | Emergency stop | Admin |
| 4 | `unpause_platform` | Resume operations | Admin |
| 5 | `initialize` | Create campaign | Creator |
| 6 | `fund` | Back project with $1 | Backer |
| 7 | `submit_milestone_proof` | Submit proof URL | Creator |
| 8 | `approve_milestone` | Approve milestone | Admin |
| 9 | `reject_milestone` | Reject milestone | Admin |
| 10 | `release_milestone` | Release funds to creator | Creator |
| 11 | `refund_campaign` | Refund failed campaign | Backer |

### Instruction Discriminators (for raw calls)

```javascript
const DISCRIMINATORS = {
  initialize_platform: [119, 201, 101, 45, 75, 122, 89, 3],
  update_backing_amount: [243, 169, 199, 94, 160, 143, 167, 221],
  pause_platform: [232, 46, 204, 130, 181, 0, 172, 57],
  unpause_platform: [167, 253, 251, 188, 221, 230, 32, 165],
  initialize: [175, 175, 109, 31, 13, 152, 155, 237],
  fund: [218, 188, 111, 221, 152, 113, 174, 7],
  submit_milestone_proof: [95, 246, 144, 35, 212, 197, 162, 197],
  approve_milestone: [145, 85, 92, 60, 50, 130, 219, 106],
  reject_milestone: [243, 48, 66, 165, 237, 41, 116, 249],
  release_milestone: [56, 2, 199, 164, 184, 108, 167, 222],
  refund_campaign: [232, 19, 109, 7, 229, 33, 157, 226],
};
```

### Error Codes

| Code | Name | Message |
|------|------|---------|
| 6000 | `NoMoreMilestones` | No more milestones to release |
| 6001 | `MilestoneNotApproved` | Milestone is not approved yet |
| 6002 | `MilestoneNotActive` | Milestone is not in active state |
| 6003 | `MilestoneNotInReview` | Milestone is not in review state |
| 6004 | `UnauthorizedAdmin` | Only admin can perform this action |
| 6005 | `UnauthorizedWithdrawal` | Only creator can withdraw funds |
| 6006 | `GoalNotReached` | Cannot release funds until goal is met |
| 6007 | `PlatformPaused` | Platform operations are disabled |
| 6008 | `DeadlineNotReached` | Cannot refund until deadline passes |
| 6009 | `GoalAlreadyReached` | Cannot refund successful campaign |

### Account Structures

**PlatformConfig:**
```typescript
{
  admin: PublicKey,           // Admin wallet
  fixed_backing_amount: u64,  // 1_000_000 = $1 USDC
  total_campaigns: u64,
  total_backers: u64,
  paused: bool,
  bump: u8
}
```

**Campaign:**
```typescript
{
  creator: PublicKey,
  goal: u64,
  raised: u64,
  deadline: i64,              // Unix timestamp
  backer_count: u64,
  current_milestone_index: u8,
  milestones: Vec<Milestone>,
  bump: u8
}
```

**Milestone:**
```typescript
{
  title: string,
  amount: u64,
  status: MilestoneStatus,    // Locked, Active, InReview, Approved, Completed, Disputed
  proof_url: Option<string>,
  submitted_at: Option<i64>,
  votes_approve: u64,
  votes_dispute: u64
}
```

### PDA Seeds

| PDA | Seeds |
|-----|-------|
| Platform Config | `["platform_config"]` |
| Campaign | `["campaign", creator_pubkey]` |
| Campaign Vault | `["campaign_vault", campaign_pubkey]` |

---

## 🔒 Security Checklist

- [ ] Wallet keypair (`~/.config/solana/id.json`) backed up securely
- [ ] Program keypair (`odv_escrow-keypair.json`) backed up securely
- [ ] `.env.local` is in `.gitignore`
- [ ] Supabase service role key NOT exposed (only anon key in frontend)
- [ ] This file saved in password manager
- [ ] This file deleted from repository after saving elsewhere

---

*Last Updated: December 5, 2025*
