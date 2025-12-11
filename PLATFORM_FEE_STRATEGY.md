# Gas Sponsorship & Platform Fee Strategy

**Date**: December 11, 2025

---

## 🔑 **Private Key Formats**

### Relayer Wallet Public Key:
```
G69hBDyPLCb29s4WVe6AcoiiJyjNHxAkhx2PYwzLeR6g
```

### Private Key Formats:

**1. Base58 (RECOMMENDED - Solana Standard):**
```
Use bs58 library to decode the byte array
```

**2. Base64 (Current):**
```
LviCL5eJL8sXTPpJ0pM57jq/lP5MBgMBqz4CnXAO15jgMQlr0ee2VwhM28CuVRfy5s6n4oIKApvkCHO4UG/AQQ==
```

**3. Byte Array (for Anchor/Rust):**
```json
[46,248,130,47,151,137,47,203,23,76,250,73,210,147,57,238,58,191,148,254,76,6,3,1,171,62,2,157,112,14,215,152,224,49,9,107,209,231,182,87,8,76,219,192,174,85,23,242,230,206,167,226,130,10,2,155,228,8,115,184,80,111,192,65]
```

---

## 💸 **Who Pays Gas for What?**

| Operation | Gas Cost | Who Pays? | Solution |
|-----------|----------|-----------|----------|
| **Back Project** | $0.02 | Platform ✅ | Relayer sponsors |
| **Submit Project** | $0.05 | Platform ✅ | Free submissions, sponsor gas |
| **Initialize Campaign** | $0.10 | Admin ✅ | Admin operation (after approval) |
| **Approve Project** | $0.02 | Admin ✅ | Admin operation |

**Key Decision**: **Platform sponsors ALL gas fees** for better UX

---

## 💰 **Revenue Model: 1% Platform Fee**

### Current Smart Contract Status

**Good News**: Smart contract has **NO platform fee deduction** in fund() instruction!

```rust
// Current: All $1 goes to campaign
pub fn fund(ctx: Context<Fund>, campaign_id: u64) -> Result<()> {
    // Transfer full backing_amount to campaign vault
    // NO platform fee deduction
}
```

**This means**: Fee collection happens **OFF-CHAIN** (in database/Stripe)

### Advantage: **NO SMART CONTRACT REDEPLOYMENT NEEDED!**

You can adjust platform fee % from admin panel without touching blockchain:
- Store fee % in Supabase: `admin_settings` table
- Deduct fee when transferring funds to creators
- Change any time: 1% → 2% → 0.5% → whatever

---

## 🎯 **Recommended Flow**

### Flow 1: Project Submission (FREE)

```
1. Creator submits project
   ├─ Frontend: Save to database (status: pending)
   ├─ Gas: $0 (no blockchain yet)
   └─ Cost to platform: $0

2. Admin reviews
   ├─ Approve/Reject in database
   └─ Gas: $0

3. Admin clicks "Initialize on Blockchain"
   ├─ Admin wallet pays gas: $0.10
   ├─ Campaign goes live
   └─ Status: active
```

**Result**: Zero cost for creators, zero spam incentive removed (admin still reviews)

### Flow 2: User Backs Project

```
1. User clicks "Back $1"
   ├─ User signs message (no gas)
   ├─ Backend relayer pays gas: $0.02
   ├─ Full $1 goes to campaign vault
   └─ Record in database

2. Database tracks:
   ├─ Project ID
   ├─ Backer wallet
   ├─ Amount: $1
   ├─ Platform fee (calculated): $0.01 (1%)
   └─ Net to creator: $0.99
```

### Flow 3: Creator Withdraws Funds

```
1. Milestone approved
2. Creator requests withdrawal
3. Smart contract releases funds
4. Platform deducts 1% fee:
   ├─ If raised $1000
   ├─ Platform fee: $10 (1%)
   ├─ Creator receives: $990
   └─ Fee sent to platform treasury wallet
```

---

## 🔧 **Implementation: No Smart Contract Changes Needed!**

### Option A: Fee During Withdrawal (Recommended)

**Smart Contract**: Already supports withdrawal to any address
**Backend**: Calculate fee during withdrawal
- Creator earned: $1000
- Platform fee (1%): $10
- Transfer $990 to creator
- Keep $10 in platform vault

### Option B: Fee During Backing

**Not recommended** - complicates blockchain logic
- Would need smart contract update
- Less flexible

---

## 📊 **1% Fee Math**

### Scenario: 1000 Backings

```
Raised: 1000 × $1 = $1,000

Platform Costs:
├─ Backing gas: 1000 × $0.02 = $20
├─ Submission gas: Free (admin pays on approve)
└─ Total costs: $20

Platform Revenue:
└─ 1% fee: $1,000 × 1% = $10

Net Profit: $10 - $20 = -$10 (LOSS)
```

### Scenario: 10,000 Backings (Break-even point)

```
Raised: 10,000 × $1 = $10,000

Platform Costs:
├─ Backing gas: 10,000 × $0.02 = $200
└─ Total costs: $200

Platform Revenue:
└─ 1% fee: $10,000 × 1% = $100

Net Profit: $100 - $200 = -$100 (STILL LOSS!)
```

### Scenario: 50,000 Backings (Profitable)

```
Raised: 50,000 × $1 = $50,000

Platform Costs:
├─ Backing gas: 50,000 × $0.02 = $1,000
└─ Total costs: $1,000

Platform Revenue:
└─ 1% fee: $50,000 × 1% = $500

Net Profit: $500 - $1,000 = -$500 (STILL LOSS!)
```

---

## ⚠️ **IMPORTANT: 1% Fee is NOT PROFITABLE**

### Break-Even Analysis

```
Platform Fee % = Gas Cost / Backing Amount
Break-even = $0.02 / $1.00 = 2%

At 1% fee: You LOSE money on every backing
At 2% fee: Break-even (no profit)
At 3% fee: 1% profit margin
At 5% fee: 3% profit margin
```

### Recommendation: **Start with 3% fee**

- Covers gas costs
- 1% profit margin
- Still affordable for creators
- Adjustable from admin panel

---

## 🎮 **Admin Panel Fee Configuration**

### Database Schema:

```sql
CREATE TABLE admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT -- admin wallet address
);

INSERT INTO admin_settings (setting_key, setting_value) VALUES
('platform_fee_percentage', '3.0'),
('gas_sponsorship_enabled', 'true'),
('max_submissions_per_day', '100');
```

### Admin UI:

```tsx
<Input 
  type="number" 
  label="Platform Fee (%)" 
  value={platformFeePercent}
  onChange={(e) => updatePlatformFee(e.target.value)}
  min="0"
  max="10"
  step="0.1"
/>
```

**Changes take effect immediately** - no blockchain deployment needed!

---

## ✅ **Final Recommendation**

1. **Gas Sponsorship**: Platform pays ALL gas (better UX)
2. **Platform Fee**: Start with **3%** (covers costs + small profit)
3. **Adjustable**: Store in database, change from admin panel
4. **No Smart Contract Changes**: Fee happens during withdrawal
5. **Monitor**: Track actual gas costs, adjust fee accordingly

Want me to implement the admin settings page with fee configuration?
