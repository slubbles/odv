# Gas Sponsorship Cost Analysis

**Date**: December 11, 2025  
**Network**: SOON Testnet → Mainnet

---

## 💰 Transaction Cost Breakdown

### SOON Network Gas Costs

**On SOON Testnet/Mainnet:**
- Base transaction: ~5,000 compute units
- Token transfer: ~20,000 compute units  
- Program instruction (backing): ~50,000 compute units
- **Total per backing**: ~75,000 compute units

**Cost in SOL:**
- 1 compute unit = ~0.000000001 SOL
- 75,000 compute units = **0.000075 SOL per backing**

**Current SOL Price**: ~$200 USD (December 2025)
- **Cost per backing**: 0.000075 SOL × $200 = **$0.015 USD**
- **Rounded**: ~$0.02 USD per backing transaction

---

## 📊 Cost Projections

### Scenario 1: 1000 Backings (No Revenue)

**Total Gas Cost:**
```
1000 backings × $0.02 = $20 USD
```

**In SOL:**
```
1000 backings × 0.000075 SOL = 0.075 SOL
```

**ROI Calculation (No Platform Fee):**
```
Revenue from 1000 backings: 1000 × $1 = $1,000
Gas costs: $20
Net revenue: $980
ROI: 4,900%
```

### Scenario 2: 1000 Backings (With 5% Platform Fee)

**With Platform Fee:**
```
Platform fee: $1,000 × 5% = $50
Gas costs: $20
Net profit: $30
ROI: 150%
```

### Scenario 3: 10,000 Backings (Scale)

**Costs:**
```
10,000 backings × $0.02 = $200 USD
```

**With 5% Platform Fee:**
```
Revenue: 10,000 × $1 × 5% = $500
Gas costs: $200
Net profit: $300
ROI: 150%
```

---

## 🔥 **Critical Insight: Project Submission Gas**

### Who Pays for What?

| Operation | Gas Required? | Who Should Pay? | Cost |
|-----------|---------------|-----------------|------|
| **Back Project** | ✅ Yes | Platform (sponsored) | $0.02 |
| **Submit Project** | ✅ Yes | Creator (charged) | $0.05-0.10 |
| **Initialize Campaign** | ✅ Yes | Creator (already admin) | N/A |
| **Approve Project** | ✅ Yes | Admin (platform cost) | $0.02 |

### Project Submission Strategy

**Option A: Free Submission (Platform Pays)**
- Gas cost: $0.05 per submission
- 100 submissions/month = $5/month
- **Issue**: Spam submissions, no quality filter

**Option B: $1-5 Submission Fee**
- Charge creators $2-5 to list project
- Covers gas + quality filter
- **Benefit**: Reduces spam, creators committed

**Option C: Submit Free, Pay if Approved**
- Free to submit (platform sponsors gas)
- If approved: Creator pays $5 listing fee
- **Benefit**: No barrier to entry, payment only if quality

---

## 💡 Recommendation

### For Backers: **Platform Sponsors Gas** ✅
- Cost: $0.02 per backing
- User only needs USDC
- Scale: Profitable with 2-5% platform fee

### For Creators: **Charge $3-5 Listing Fee** ✅
- Covers: Gas + admin review time + quality filter
- Alternative: Free submit, $5 if approved
- Prevents spam submissions

---

## 🚀 Implementation Plan

### Phase 1: Setup Relayer Wallet
1. Generate new keypair
2. Fund with 1 SOL (~1333 transactions)
3. Store private key in environment variables
4. Monitor balance via webhook

### Phase 2: Backend Relay Endpoint
```typescript
// POST /api/relay/back-project
// Receives user signature, platform pays gas
```

### Phase 3: Frontend Update
```typescript
// User signs intent (no gas needed)
// Backend submits transaction
```

### Phase 4: Analytics Dashboard
- Track gas spent per day
- Alert if relayer balance < 0.1 SOL
- Show cost per backing

---

## 🧮 ROI Formula

```
Net Profit = (Backings × Platform Fee %) - (Backings × Gas Cost)

Break-even Platform Fee:
Fee % = Gas Cost / Backing Amount
Fee % = $0.02 / $1.00 = 2%

Recommended Fee: 3-5%
Profit per backing: $0.03-0.05 - $0.02 = $0.01-0.03
```

---

## ⚠️ Risks & Mitigations

**Risk 1: SOL Price Volatility**
- Mitigation: Monitor costs, adjust fees quarterly
- Hedge: Keep 3-6 months gas in reserve

**Risk 2: Network Congestion (Higher Gas)**
- Mitigation: SOON network is faster/cheaper than Solana
- Fallback: Increase platform fee if gas > $0.05

**Risk 3: Relayer Wallet Compromise**
- Mitigation: Only fund with what you need
- Security: Regular rotation, hardware wallet for refills

**Risk 4: Running Out of Funds**
- Mitigation: Auto-alert at 0.1 SOL
- Automation: Auto-refill from treasury wallet

---

## 📈 Scale Economics

| Users | Backings/Month | Gas Cost | Platform Fee (3%) | Net Profit |
|-------|----------------|----------|-------------------|------------|
| 100 | 1,000 | $20 | $30 | $10 |
| 500 | 5,000 | $100 | $150 | $50 |
| 1,000 | 10,000 | $200 | $300 | $100 |
| 5,000 | 50,000 | $1,000 | $1,500 | $500 |
| 10,000 | 100,000 | $2,000 | $3,000 | $1,000 |

**Conclusion**: Gas sponsorship is **highly profitable** even with low 3% platform fee.

---

## 🎯 Next Steps

1. ✅ Generate relayer keypair
2. ✅ Fund with 1 SOL testnet
3. ✅ Build relay endpoint
4. ✅ Update frontend flow
5. ✅ Test with real backing
6. ✅ Monitor costs for 100 transactions
7. ✅ Decide on creator listing fee

**Test Budget**: 1 SOL = ~1333 backings to measure real costs
