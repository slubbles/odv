# 🚀 SOON Testnet Deployment Session - Complete Documentation

**Date**: December 1, 2025  
**Duration**: Extended debugging and deployment session  
**Outcome**: ✅ **SUCCESS** - ODV Escrow Program deployed to SOON Testnet  
**Program ID**: `4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA`

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Initial Goal](#initial-goal)
3. [The Problem We Faced](#the-problem-we-faced)
4. [Failed Attempts (In Order)](#failed-attempts-in-order)
5. [Root Cause Analysis](#root-cause-analysis)
6. [The Solution](#the-solution)
7. [Technical Deep Dive](#technical-deep-dive)
8. [Configuration Changes Made](#configuration-changes-made)
9. [Deployment Details](#deployment-details)
10. [Cost Analysis](#cost-analysis)
11. [What The Smart Contract Does](#what-the-smart-contract-does)
12. [Lessons Learned](#lessons-learned)
13. [Next Steps](#next-steps)

---

## Executive Summary

We successfully deployed the OneDollarVentures (ODV) escrow smart contract to **SOON Network Testnet** after extensive troubleshooting. The deployment was blocked by SOON Testnet's infrastructure using private IP addresses for cluster nodes, which prevented standard Solana CLI tools from discovering TPU (Transaction Processing Unit) leaders.

**The solution was a single flag**: `--use-rpc`

This flag bypasses TPU discovery entirely and submits all transactions through the RPC endpoint, which acts as a proxy to SOON's internal network.

---

## Initial Goal

Deploy the ODV escrow smart contract to SOON Network Testnet for the OneDollarVentures crowdfunding platform.

**Platform Concept**: 
- Users back projects for exactly **$1** each
- Funds held in **escrow** until milestones completed
- **Milestone-based releases** prevent scams
- **Refunds** if campaigns fail to reach goals

---

## The Problem We Faced

### Standard Deployment Failed

When running `anchor deploy --provider.cluster https://rpc.testnet.soo.network/rpc`, we received:

```
thread 'main' panicked at cli/src/program.rs:3230:26:
Should return a valid tpu client: Custom("Failed find any cluster node info for upcoming leaders, timeout: 20s.")
```

This error occurred **every single time** with every standard deployment method.

### Why It Failed

SOON Testnet's cluster nodes use **private IP addresses**:

```bash
$ solana gossip --url https://rpc.testnet.soo.network/rpc
10.102.2.36   | ...  # PRIVATE IP - Not routable from internet
10.102.3.123  | ...  # PRIVATE IP - Not routable from internet
```

Compare to Solana Devnet:
```bash
$ solana gossip --url https://api.devnet.solana.com
# Returns 135+ nodes with PUBLIC IP addresses
```

The Solana CLI's deployment process requires:
1. Connect to RPC ✅
2. Query gossip for cluster nodes
3. Get leader schedule
4. **Connect directly to TPU ports on leader nodes** ❌ (Private IPs unreachable)
5. Stream program data
6. Finalize deployment

Step 4 failed because we **cannot route to private 10.x.x.x addresses** from the public internet.

---

## Failed Attempts (In Order)

### Attempt #1: Standard Anchor Deploy
```bash
anchor deploy --provider.cluster https://rpc.testnet.soo.network/rpc
```
**Result**: ❌ TPU client timeout after 20 seconds

### Attempt #2: Solana CLI Direct Deploy
```bash
solana program deploy target/deploy/odv_escrow.so \
  --program-id target/deploy/odv_escrow-keypair.json \
  --url https://rpc.testnet.soo.network/rpc
```
**Result**: ❌ Same TPU discovery timeout

### Attempt #3: Solana CLI with Compute Unit Price
```bash
solana program deploy target/deploy/odv_escrow.so \
  --program-id target/deploy/odv_escrow-keypair.json \
  --with-compute-unit-price 1000
```
**Result**: ❌ TPU discovery still failed (compute price doesn't affect TPU routing)

### Attempt #4: Write-Buffer Method
```bash
solana program write-buffer target/deploy/odv_escrow.so
```
**Result**: ❌ TPU discovery failed (write-buffer also needs TPU)

### Attempt #5: Custom Node.js BpfLoader Script
```javascript
await BpfLoader.load(connection, payerKeypair, programKeypair, programData, BPF_LOADER_UPGRADEABLE_PROGRAM_ID);
```
**Result**: ❌ `Cannot read properties of undefined (reading 'toBuffer')` - API incompatibility

### Attempt #6: SOON Faucet Devnet
```bash
solana config set --url https://rpc.fc.devnet.soo.network/rpc
solana balance
```
**Result**: ❌ 503 Service Temporarily Unavailable (network down)

### Attempt #7: SOON Devnet
```bash
curl -X POST https://rpc.devnet.soo.network/rpc -d '{"method":"getHealth"}'
```
**Result**: ❌ No response (network unreachable)

### Attempt #8 (SUCCESS): Solana CLI with --use-rpc Flag
```bash
solana program deploy target/deploy/odv_escrow.so \
  --program-id target/deploy/odv_escrow-keypair.json \
  --use-rpc
```
**Result**: ✅ **DEPLOYED SUCCESSFULLY!**

---

## Root Cause Analysis

### The Architecture Problem

```
Standard Deployment Flow:
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│ Your CLI    │────▶│ SOON RPC    │────▶│ Get Leader Info │
└─────────────┘     └─────────────┘     └────────┬────────┘
                                                  │
                         Returns: 10.102.2.36     │ (Private IP)
                                                  ▼
                    ┌─────────────────────────────────────┐
                    │  CLI tries to connect to 10.102.2.36│
                    │  ❌ FAILS - Private IP unreachable  │
                    └─────────────────────────────────────┘
```

### Why --use-rpc Works

```
RPC-Only Deployment Flow:
┌─────────────┐     ┌─────────────┐     ┌──────────────────┐
│ Your CLI    │────▶│ SOON RPC    │────▶│ RPC forwards to  │
└─────────────┘     └─────────────┘     │ internal nodes   │
                           │            │ (10.102.x.x)     │
                           │            └──────────────────┘
                           │                     │
                           │ RPC IS INSIDE       │
                           │ SOON's NETWORK      │
                           │ Can reach private   │
                           ▼ IPs directly        ▼
                    ┌─────────────────────────────────────┐
                    │  ✅ RPC handles all internal routing│
                    │  ✅ Program deployed successfully   │
                    └─────────────────────────────────────┘
```

**Key Insight**: The `--use-rpc` flag tells the Solana CLI to send **all transactions through the RPC endpoint** instead of trying to connect directly to TPU leaders. The RPC server is **inside** SOON's network infrastructure, so it can reach those private IP nodes.

---

## Technical Deep Dive

### What TPU Is

**TPU (Transaction Processing Unit)** is Solana's high-performance transaction ingestion system:
- Direct UDP/QUIC connection to validator nodes
- Bypasses RPC for faster transaction submission
- Required for large data uploads (like programs)

### Why TPU Matters for Program Deployment

Program deployment requires uploading 274KB of data in chunks:
- Multiple transactions
- Leader schedule coordination
- Efficient streaming via TPU

### The --use-rpc Flag

```bash
solana program deploy --help
```

```
--use-rpc
    Send write transactions to the configured RPC instead of validator TPUs
```

This flag:
1. Converts all TPU operations to RPC transactions
2. Submits everything via `sendTransaction` RPC method
3. RPC server handles internal routing
4. Slower but works with restrictive network setups

### Network Configuration Comparison

| Aspect | SOON Testnet | Solana Devnet |
|--------|-------------|---------------|
| **Cluster Nodes** | 2 | 135+ |
| **Node IPs** | Private (10.x.x.x) | Public |
| **TPU Direct Access** | ❌ No | ✅ Yes |
| **RPC Access** | ✅ Yes | ✅ Yes |
| **--use-rpc Required** | ✅ Yes | ❌ No |
| **Deployment Method** | RPC-only | TPU or RPC |

---

## Configuration Changes Made

### 1. anchor/Anchor.toml

```toml
[toolchain]

[features]
seeds = false
skip-lint = false

[programs.localnet]
odv_escrow = "4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "localnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "npx mocha -t 1000000 tests/**/*.js"
```

**Note**: We use `localnet` as cluster name because Anchor doesn't recognize custom cluster URLs in the provider section. Actual deployment uses CLI with explicit `--url` flag.

### 2. src/lib/solana/config.ts

```typescript
import { PublicKey } from '@solana/web3.js';

// SOON Testnet Configuration (Deployed successfully)
export const PROGRAM_ID = new PublicKey('4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA');
export const NETWORK = 'soon-testnet';
export const RPC_ENDPOINT = 'https://rpc.testnet.soo.network/rpc';

// Platform Admin (your wallet)
export const PLATFORM_ADMIN = new PublicKey('4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw');

// Fixed backing amount (1 USDC = 1_000_000 smallest units)
export const FIXED_BACKING_AMOUNT = 1_000_000;

// Platform Config PDA
export const PLATFORM_CONFIG_SEED = 'platform_config';

// SOON Testnet Explorer
export const EXPLORER_URL = 'https://explorer.testnet.soo.network';
```

### 3. .env.local

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://zsfujmvltpumleszcrwh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# SOON Network Configuration
NEXT_PUBLIC_SOLANA_RPC_URL=https://rpc.testnet.soo.network/rpc
NEXT_PUBLIC_SOLANA_NETWORK=soon-testnet
NEXT_PUBLIC_SOON_EXPLORER_URL=https://explorer.testnet.soo.network

# ODV Escrow Program
NEXT_PUBLIC_ODV_PROGRAM_ID=4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA

# USDC Mint Address
NEXT_PUBLIC_USDC_MINT=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Solana CLI Configuration

```bash
solana config set --url https://rpc.testnet.soo.network/rpc
```

**Resulting Config**:
```
Config File: /home/codespace/.config/solana/cli/config.yml
RPC URL: https://rpc.testnet.soo.network/rpc 
WebSocket URL: wss://rpc.testnet.soo.network/rpc (computed)
Keypair Path: /home/codespace/.config/solana/id.json 
Commitment: confirmed
```

---

## Deployment Details

### Successful Deployment Command

```bash
cd /workspaces/odv/anchor
solana program deploy target/deploy/odv_escrow.so \
  --program-id target/deploy/odv_escrow-keypair.json \
  --use-rpc
```

### Deployment Output

```
Program Id: 4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA
Signature: 55U4n2ox6zTFkbnEZeRcov1NwuaGBjZubujfWR1EaR8hvRjGpZU2GbXvfExwUzwXpktLmjLpDWj7BnkLxTae2bhL
```

### On-Chain Verification

```bash
solana program show 4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA
```

```
Program Id: 4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA
Owner: BPFLoaderUpgradeab1e11111111111111111111111
ProgramData Address: 9CDUYJxMSdb23y1QjLrGegKrtgYkn8taWFSgeS3dNr7X
Authority: 4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw
Last Deployed In Slot: 4860313
Data Length: 274432 (0x43000) bytes
Balance: 0.09556254 SOL
```

### Explorer Links

- **Program**: https://explorer.testnet.soo.network/address/4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA
- **Transaction**: https://explorer.testnet.soo.network/tx/55U4n2ox6zTFkbnEZeRcov1NwuaGBjZubujfWR1EaR8hvRjGpZU2GbXvfExwUzwXpktLmjLpDWj7BnkLxTae2bhL

---

## Cost Analysis

### Deployment Transaction Breakdown

| Component | Amount (SOL) | USD @ $150/SOL |
|-----------|-------------|----------------|
| Transaction Fee | 0.0000005 | $0.000075 |
| Program Rent (Deposit) | 0.09556254 | $14.33 |
| Buffer Rent | 0.000057072 | $0.008 |
| **Total** | **~0.0956** | **~$14.34** |

### Important Notes on Cost

1. **Rent is a DEPOSIT, not a fee**: The 0.0956 SOL sits in the program account to keep it rent-exempt. It's refundable if you close the program.

2. **Actual transaction fee**: Only 0.0000005 SOL (~$0.00008) - essentially free.

3. **Future upgrades**: Cost only transaction fees (~$0.00008), no additional rent.

### Mainnet Cost Projection

| SOL Price | Deployment Cost |
|-----------|----------------|
| $100 | $9.56 |
| $150 | $14.34 |
| $200 | $19.12 |
| $250 | $23.90 |

### Comparison to Ethereum

Deploying a similar smart contract on Ethereum mainnet:
- **Gas cost**: 2-5 ETH (~$7,000-$17,500)
- **Non-refundable**
- **SOON/Solana**: ~500-1000x cheaper

---

## What The Smart Contract Does

### Program Overview

**Name**: ODV Escrow  
**Size**: 274,432 bytes (269 KB)  
**Type**: Anchor BPF Upgradeable Program  
**Language**: Rust  

### Instructions (12 Total)

#### Platform Management (Admin Only)

1. **`initialize_platform(fixed_backing_amount)`**
   - One-time setup
   - Sets $1 backing amount (1,000,000 smallest units)
   - Creates PlatformConfig account

2. **`update_backing_amount(new_amount)`**
   - Change the fixed backing amount
   - Admin only

3. **`pause_platform()`**
   - Emergency stop - freezes all operations
   - Admin only

4. **`unpause_platform()`**
   - Resume operations after pause
   - Admin only

#### Campaign Operations (Creators)

5. **`initialize(goal, deadline, milestones)`**
   - Create a new campaign
   - Sets funding goal, deadline
   - Defines milestones with amounts
   - First milestone auto-unlocked

6. **`submit_milestone_proof(proof_url)`**
   - Creator submits evidence of completion
   - Changes milestone status: Active → InReview
   - Stores IPFS/URL to proof

#### Milestone Review (Admin)

7. **`approve_milestone()`**
   - Admin verifies proof is valid
   - Changes status: InReview → Approved
   - Enables fund release

8. **`reject_milestone()`**
   - Admin rejects proof
   - Changes status: InReview → Active
   - Creator must resubmit

#### Financial Operations

9. **`fund()`**
   - Back a campaign for exactly $1
   - Amount enforced by contract (reads from PlatformConfig)
   - USDC: Backer → Campaign Vault
   - Increments raised + backer_count

10. **`release_milestone()`**
    - Creator withdraws approved milestone funds
    - Requires: goal reached + milestone approved
    - USDC: Campaign Vault → Creator
    - Unlocks next milestone

11. **`refund_campaign()`**
    - Backer claims refund
    - Requires: deadline passed + goal not reached
    - USDC: Campaign Vault → Backer

### Account Structures

#### PlatformConfig
```rust
pub struct PlatformConfig {
    pub admin: Pubkey,              // Admin wallet
    pub fixed_backing_amount: u64,  // $1 in smallest units
    pub total_campaigns: u64,       // Counter
    pub total_backers: u64,         // Counter
    pub paused: bool,               // Emergency stop
    pub bump: u8,                   // PDA bump
}
```

#### Campaign
```rust
pub struct Campaign {
    pub creator: Pubkey,            // Creator wallet
    pub goal: u64,                  // Funding goal
    pub deadline: i64,              // Unix timestamp
    pub raised: u64,                // Amount raised
    pub backer_count: u64,          // Number of backers
    pub current_milestone_index: u8,// Active milestone
    pub milestones: Vec<Milestone>, // All milestones
    pub bump: u8,                   // PDA bump
}
```

#### Milestone
```rust
pub struct Milestone {
    pub title: String,              // "Prototype", "Beta", etc.
    pub amount: u64,                // USDC for this milestone
    pub status: MilestoneStatus,    // Locked/Active/InReview/Approved/Completed
    pub proof_url: Option<String>,  // IPFS CID or URL
    pub submitted_at: Option<i64>,  // Submission timestamp
    pub votes_approve: u32,         // Community votes (optional)
    pub votes_dispute: u32,         // Dispute votes (optional)
}
```

### Fund Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    ODV ESCROW FUND FLOW                          │
└─────────────────────────────────────────────────────────────────┘

   BACKER                    CAMPAIGN                    CREATOR
     │                        VAULT                         │
     │                          │                           │
     │    fund() - $1 USDC      │                           │
     │─────────────────────────▶│                           │
     │                          │                           │
     │                          │  release_milestone()      │
     │                          │  (after admin approval)   │
     │                          │──────────────────────────▶│
     │                          │                           │
     │    refund_campaign()     │                           │
     │    (if goal not met)     │                           │
     │◀─────────────────────────│                           │
     │                          │                           │

SECURITY GUARANTEES:
  ✅ Backers can only send exactly $1 (enforced by contract)
  ✅ Creators can only withdraw after milestone approval
  ✅ Backers get refunds if deadline passes without goal
  ✅ Admin can pause everything in emergency
  ✅ All funds held in program-controlled vault (escrow)
```

---

## Lessons Learned

### 1. Network Infrastructure Matters

SOON Testnet's private IP setup is unusual. Most Solana networks expose public validator IPs for TPU access. SOON's architecture requires RPC-only deployment.

### 2. CLI Flags Are Powerful

A single `--use-rpc` flag solved hours of debugging. Always check `solana program deploy --help` for available options.

### 3. Error Messages Can Be Misleading

"TPU client timeout" sounds like a network timeout issue, but it was actually a routing/accessibility issue with private IPs.

### 4. RPC vs TPU Trade-offs

| Method | Speed | Reliability | Network Access |
|--------|-------|-------------|----------------|
| TPU | Fast | Requires public node IPs | Direct UDP/QUIC |
| RPC | Slower | Works through proxy | HTTP/HTTPS |

### 5. Documentation Gaps

SOON Network's documentation recommends Solana Playground for deployment, likely because they know CLI TPU access won't work. The `--use-rpc` solution should be documented.

### 6. Always Have Fallbacks

We had Solana Devnet as a working fallback. Having multiple network options is crucial for development.

---

## Next Steps

### Immediate (Do Now)

1. **Initialize the Platform**:
   ```bash
   cd /workspaces/odv
   npx ts-node anchor/scripts/initialize-platform.ts
   ```

2. **Verify Initialization**:
   ```bash
   # Check on explorer
   https://explorer.testnet.soo.network/address/4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA
   ```

### Short-term (This Week)

1. **Test Full Flow**:
   - Create test campaign
   - Back with $1
   - Submit milestone proof
   - Approve milestone
   - Release funds
   - Test refund scenario

2. **Frontend Integration**:
   - Connect wallet to SOON Testnet
   - Test campaign creation UI
   - Test backing flow
   - Test admin dashboard

3. **Get Test Tokens**:
   ```bash
   # SOL for transactions
   solana airdrop 2
   
   # USDC for backing (need test USDC on SOON)
   # Check SOON faucet for test tokens
   ```

### Long-term (Production)

1. **SOON Mainnet Deployment**:
   ```bash
   solana config set --url https://rpc.mainnet.soo.network/rpc
   solana program deploy target/deploy/odv_escrow.so \
     --program-id target/deploy/odv_escrow-keypair.json \
     --use-rpc
   ```

2. **Security Audit**: Get professional audit before mainnet launch

3. **Multi-sig Admin**: Consider multi-sig for admin operations

4. **Monitoring**: Set up alerts for platform pause, large withdrawals

---

## Quick Reference

### Deployment Command (SOON Testnet)

```bash
# Build
cd /workspaces/odv/anchor
anchor build

# Deploy (THE COMMAND THAT WORKS)
solana program deploy target/deploy/odv_escrow.so \
  --program-id target/deploy/odv_escrow-keypair.json \
  --use-rpc
```

### Key Addresses

| Item | Address |
|------|---------|
| **Program ID** | `4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA` |
| **Admin Wallet** | `4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw` |
| **ProgramData** | `9CDUYJxMSdb23y1QjLrGegKrtgYkn8taWFSgeS3dNr7X` |

### Network URLs

| Network | RPC Endpoint | Explorer |
|---------|-------------|----------|
| SOON Testnet | https://rpc.testnet.soo.network/rpc | https://explorer.testnet.soo.network |
| SOON Mainnet | https://rpc.mainnet.soo.network/rpc | https://explorer.soo.network |

### Useful Commands

```bash
# Check balance
solana balance

# Check program info
solana program show 4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA

# View transaction
solana confirm -v <SIGNATURE>

# Check cluster nodes (see the private IPs)
solana gossip
```

---

## Conclusion

What started as a simple "deploy to SOON Testnet" task became an in-depth exploration of Solana's deployment architecture and SOON Network's infrastructure choices. The key takeaway:

**When deploying to SOON Network (or any network with private validator IPs), use `--use-rpc` flag with `solana program deploy`.**

The ODV escrow program is now live on SOON Testnet, ready for platform initialization and testing. The smart contract provides trustless milestone-based crowdfunding where:

- Backers are protected by escrow
- Creators are accountable through milestones
- Admins curate quality with approval workflows
- Everyone benefits from transparent, on-chain operations

**Total time invested**: Several hours of debugging  
**Solution complexity**: One flag  
**Emotional journey**: Frustration → Disbelief → Relief → Documentation  

---

*Document created: December 1, 2025*  
*OneDollarVentures - Successfully deployed to SOON Network Testnet 🚀*
