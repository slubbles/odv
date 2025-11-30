# Smart Contract User Flow - ODV Platform

**Version**: 2.0 (Security Enhanced)  
**Date**: November 30, 2025  
**Instructions**: 11 total

---

## 🎭 User Roles & Capabilities

### 👑 Platform Admin
- Initialize platform (one-time)
- Update backing amount
- Pause/unpause platform (emergency)
- Approve/reject milestones

### 🎨 Creator
- Create campaigns with milestones
- Submit milestone proofs
- Release approved milestone funds

### 💰 Backer
- Fund campaigns (fixed $1 USDC)
- Request refunds (if campaign fails)

---

## 📍 Complete User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     PLATFORM INITIALIZATION                      │
│                         (One-Time Setup)                         │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │ Admin: initialize_platform│
                    │   - Set admin wallet      │
                    │   - Set $1 backing amount │
                    │   - Initialize counters   │
                    └────────────┬────────────┘
                                 │
┌─────────────────────────────────────────────────────────────────┐
│                       CAMPAIGN CREATION                          │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │ Creator: initialize()    │
                    │   - Set goal & deadline  │
                    │   - Define milestones    │
                    │   - First milestone → Active│
                    │   - Others → Locked      │
                    └────────────┬────────────┘
                                 │
┌─────────────────────────────────────────────────────────────────┐
│                        FUNDING PHASE                             │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │ Backers: fund()          │
                    │   - Transfer $1 USDC     │
                    │   - Increment raised     │
                    │   - Increment backer_count│
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Goal Reached?          │
                    └────────┬──────┬─────────┘
                            YES    NO
                             │      │
                             │      └──────────────────────┐
                             │                             │
┌─────────────────────────────────────────────┐  ┌────────▼────────┐
│         MILESTONE COMPLETION CYCLE           │  │ Deadline Passes?│
│            (Repeats per milestone)           │  └────────┬────────┘
└─────────────────────────────────────────────┘          YES
                             │                             │
                ┌────────────▼────────────┐    ┌───────────▼─────────┐
                │ Creator: submit_milestone_proof│  │ Backers: refund_campaign│
                │   - Upload proof URL     │    │   - Check deadline   │
                │   - Store timestamp      │    │   - Check goal unmet │
                │   - Status: InReview     │    │   - Return $1 USDC   │
                └────────────┬────────────┘    └─────────────────────┘
                             │
                ┌────────────▼────────────┐
                │ Admin Reviews Proof      │
                └────────┬──────┬─────────┘
                      APPROVE  REJECT
                         │      │
          ┌──────────────┘      └──────────────┐
          │                                     │
   ┌──────▼──────┐                   ┌─────────▼────────┐
   │Admin: approve_milestone│         │Admin: reject_milestone│
   │ Status: Approved│                │ Status: Active (retry)│
   └──────┬──────┘                   └──────────────────┘
          │
   ┌──────▼──────┐
   │Creator: release_milestone│
   │ ✅ Check: Creator auth   │
   │ ✅ Check: Goal reached   │
   │ ✅ Check: Not paused     │
   │ - Transfer funds         │
   │ - Status: Completed      │
   │ - Unlock next milestone  │
   └──────┬──────┘
          │
   ┌──────▼──────┐
   │ More Milestones? │
   └──────┬──────┬──────┘
         YES    NO
          │      │
          └──────┘      Campaign Complete! 🎉
      (Loop back)
```

---

## 🔄 Detailed Flow Breakdown

### Phase 1: Platform Setup (Admin Only, One-Time)

**Instruction**: `initialize_platform(fixed_backing_amount)`

```
Input:
  - fixed_backing_amount: 1_000_000 (= $1 USDC)

Output:
  - PlatformConfig PDA created
  - admin: <admin_wallet>
  - fixed_backing_amount: 1_000_000
  - paused: false
  - total_campaigns: 0
  - total_backers: 0

State Changes:
  ✅ Platform is now operational
  ✅ All users can create/back campaigns
```

---

### Phase 2: Campaign Creation (Creator)

**Instruction**: `initialize(goal, deadline, milestones)`

```
Input:
  - goal: 10_000_000_000 (= 10,000 USDC = 10,000 backers)
  - deadline: 1735689600 (Unix timestamp)
  - milestones: [
      { title: "Prototype", amount: 3_000_000_000 },
      { title: "Beta", amount: 4_000_000_000 },
      { title: "Launch", amount: 3_000_000_000 }
    ]

Output:
  - Campaign PDA created
  - creator: <creator_wallet>
  - goal: 10_000_000_000
  - raised: 0
  - backer_count: 0
  - current_milestone_index: 0
  - milestones[0].status: Active
  - milestones[1,2].status: Locked

State Changes:
  ✅ Campaign is live on-chain
  ✅ Backers can now fund it
  ✅ First milestone is active
```

---

### Phase 3: Funding (Backers)

**Instruction**: `fund()`

```
Input:
  - campaign: <campaign_pda>
  - backer_token_account: <backer's USDC account>
  - campaign_vault: <campaign's USDC vault>

Process:
  1. Read fixed_backing_amount from PlatformConfig (1_000_000)
  2. Transfer 1_000_000 USDC from backer to campaign_vault
  3. campaign.raised += 1_000_000
  4. campaign.backer_count += 1

State Changes:
  ✅ $1 USDC moved to campaign vault
  ✅ Campaign raised amount increased
  ✅ Backer count incremented

Example:
  - Backer 1 funds → raised: 1_000_000, backer_count: 1
  - Backer 2 funds → raised: 2_000_000, backer_count: 2
  - ... continues until goal reached
```

**Note**: Fixed $1 amount enforced on-chain. No variable amounts allowed.

---

### Phase 4: Milestone Completion (Iterative)

#### Step 4A: Creator Submits Proof

**Instruction**: `submit_milestone_proof(proof_url)`

```
Input:
  - proof_url: "ipfs://Qm..." or "https://..."

Process:
  1. Check platform not paused
  2. Get current milestone (index 0 = first)
  3. Verify milestone status is Active
  4. Store proof_url in milestone
  5. Store timestamp
  6. Change status: Active → InReview

State Changes:
  ✅ milestone.proof_url: "ipfs://Qm..."
  ✅ milestone.submitted_at: 1735689700
  ✅ milestone.status: InReview
  ⏳ Waiting for admin review
```

---

#### Step 4B: Admin Reviews & Decides

**Option 1: Approve** - `approve_milestone()`

```
Process:
  1. Verify admin signature
  2. Check milestone is InReview
  3. Change status: InReview → Approved

State Changes:
  ✅ milestone.status: Approved
  ✅ Creator can now release funds
```

**Option 2: Reject** - `reject_milestone()`

```
Process:
  1. Verify admin signature
  2. Check milestone is InReview
  3. Change status: InReview → Active

State Changes:
  ⏪ milestone.status: Active
  🔄 Creator must resubmit proof
```

---

#### Step 4C: Creator Releases Funds

**Instruction**: `release_milestone()`

```
Process:
  1. ✅ Security: Check platform not paused
  2. ✅ Security: Verify creator signature
  3. ✅ Security: Verify goal reached (raised >= goal)
  4. Get current milestone
  5. Verify milestone is Approved
  6. Transfer milestone.amount from vault to creator
  7. Change status: Approved → Completed
  8. Increment current_milestone_index
  9. Unlock next milestone (if any)

State Changes:
  ✅ milestone[0].status: Completed
  💰 3_000_000_000 USDC transferred to creator
  ✅ current_milestone_index: 1
  ✅ milestone[1].status: Active (unlocked)

Example:
  Milestone 1: 3,000 USDC released → Creator receives $3,000
  Milestone 2: 4,000 USDC released → Creator receives $4,000
  Milestone 3: 3,000 USDC released → Creator receives $3,000
  Total: $10,000 released over 3 milestones
```

**Critical Security Checks**:
- ❌ Cannot release if not creator
- ❌ Cannot release if goal not reached
- ❌ Cannot release if platform paused
- ❌ Cannot release if milestone not approved

---

#### Step 4D: Repeat for All Milestones

```
Loop:
  While (current_milestone_index < milestones.length):
    1. Creator submits proof
    2. Admin reviews (approve/reject)
    3. If approved: Creator releases funds
    4. Move to next milestone
    
End:
  All milestones completed → Campaign success! 🎉
```

---

### Phase 5A: Campaign Success Path

```
Conditions:
  ✅ raised >= goal
  ✅ All milestones completed
  ✅ Creator received all funds

Result:
  🎉 Campaign successful
  💰 Creator got full funding
  🎁 Backers get NFTs (future feature)
```

---

### Phase 5B: Campaign Failure Path (Refunds)

**Instruction**: `refund_campaign()`

```
Conditions for Refund:
  ❌ raised < goal (underfunded)
  ⏰ current_time > deadline (expired)

Process (per backer):
  1. Check deadline has passed
  2. Check goal was not met
  3. Transfer 1_000_000 USDC back to backer
  
State Changes:
  💸 Each backer calls individually
  💸 Gets their $1 USDC back
  
Example:
  - Campaign goal: 10,000 USDC
  - Raised: 2,500 USDC (2,500 backers)
  - Deadline passes
  - Result: All 2,500 backers get refunded
```

**Note**: Each backer must call `refund_campaign()` individually to claim their refund.

---

## 🚨 Emergency Controls (Admin Only)

### Pause Platform

**Instruction**: `pause_platform()`

```
Purpose: Emergency stop (security incident, bug found, etc.)

Effect:
  ✋ submit_milestone_proof() blocked
  ✋ release_milestone() blocked
  ✅ fund() still works (backers can still back)
  ✅ refund_campaign() still works

State Changes:
  platform_config.paused: true
```

### Unpause Platform

**Instruction**: `unpause_platform()`

```
Purpose: Resume normal operations

Effect:
  ✅ All operations restored

State Changes:
  platform_config.paused: false
```

---

## 📊 State Machine: Milestone Status

```
Locked → Active → InReview → Approved → Completed
                       ↓
                   (reject)
                       ↓
                    Active (retry)
```

**Status Definitions**:
- `Locked`: Future milestone, not yet unlocked
- `Active`: Current milestone, awaiting proof submission
- `InReview`: Proof submitted, awaiting admin review
- `Approved`: Admin approved, awaiting fund release
- `Completed`: Funds released, milestone done
- `Disputed`: (Future feature) Backers dispute completion

---

## 🔒 Security Enforcement Summary

| Operation | Security Checks |
|-----------|----------------|
| **release_milestone** | ✅ Creator signature<br>✅ Goal reached<br>✅ Not paused<br>✅ Milestone approved |
| **submit_milestone_proof** | ✅ Creator signature<br>✅ Not paused<br>✅ Milestone active |
| **approve_milestone** | ✅ Admin signature<br>✅ Milestone in review |
| **reject_milestone** | ✅ Admin signature<br>✅ Milestone in review |
| **refund_campaign** | ✅ Backer signature<br>✅ Deadline passed<br>✅ Goal not met |
| **pause_platform** | ✅ Admin signature |
| **unpause_platform** | ✅ Admin signature |
| **fund** | ✅ Backer signature<br>✅ Sufficient USDC balance |

---

## 💡 Key Design Principles

### 1. **Fixed Backing Amount**
- Every backer contributes exactly $1 USDC (1_000_000 smallest units)
- Enforced on-chain via `platform_config.fixed_backing_amount`
- No variable amounts possible

### 2. **Milestone-Based Release**
- Funds locked in vault until milestones approved
- Sequential unlocking (only one active at a time)
- Creator must prove work before accessing funds

### 3. **Admin Moderation**
- Every milestone proof reviewed by admin
- Quality control before fund release
- Can approve or reject (with resubmission)

### 4. **Goal-Based Funding**
- Funds only release when goal reached
- Kickstarter-style all-or-nothing
- Automatic refunds if goal not met

### 5. **Emergency Controls**
- Admin can pause platform instantly
- Critical operations blocked during pause
- Protects against exploits/bugs

---

## 📈 Example Campaign Walkthrough

**Campaign**: "Build a Mobile App"

### Setup
```
Goal: $5,000 (5,000 backers × $1)
Deadline: 30 days from now
Milestones:
  1. Wireframes & Design: $1,500
  2. MVP Development: $2,000
  3. Beta Testing & Launch: $1,500
```

### Timeline

**Day 1**: Creator calls `initialize()`
- Campaign goes live
- Milestone 1 (Wireframes) is Active

**Days 1-20**: Backers call `fund()` repeatedly
- 5,000 backers contribute $1 each
- raised: $5,000, goal reached! ✅

**Day 21**: Creator completes wireframes
- Calls `submit_milestone_proof("ipfs://wireframes")`
- Milestone 1 status: InReview

**Day 22**: Admin reviews
- Calls `approve_milestone()`
- Milestone 1 status: Approved

**Day 23**: Creator withdraws
- Calls `release_milestone()`
- Receives $1,500 in USDC
- Milestone 1 status: Completed
- Milestone 2 (MVP) unlocked: Active

**Day 30**: Creator completes MVP
- Submits proof, admin approves, creator releases
- Receives $2,000 in USDC
- Milestone 3 (Beta) unlocked

**Day 45**: Creator completes beta & launch
- Submits proof, admin approves, creator releases
- Receives final $1,500 in USDC
- Campaign complete! 🎉

**Total**: Creator received $5,000 over 3 milestones, proven work at each stage.

---

## 🚫 What Can Go Wrong? (And How It's Handled)

### Scenario 1: Creator Tries to Withdraw Without Goal
```
Creator calls: release_milestone()
Result: ❌ Transaction fails
Error: GoalNotReached (6006)
Message: "Goal not reached: Cannot release funds until funding goal is met"
```

### Scenario 2: Non-Creator Tries to Withdraw
```
Random user calls: release_milestone()
Result: ❌ Transaction fails
Error: UnauthorizedWithdrawal (6005)
Message: "Unauthorized: Only creator can withdraw funds"
```

### Scenario 3: Admin Pauses Platform
```
Creator calls: submit_milestone_proof()
Result: ❌ Transaction fails
Error: PlatformPaused (6007)
Message: "Platform is paused: Operations are temporarily disabled"
```

### Scenario 4: Campaign Fails to Reach Goal
```
Backer calls: refund_campaign() after deadline
Result: ✅ Transaction succeeds
Effect: Backer receives $1 USDC back
```

### Scenario 5: Creator Submits Bad Proof
```
Admin calls: reject_milestone()
Result: ✅ Transaction succeeds
Effect: Milestone status → Active (creator must resubmit)
```

---

## 🎯 Compliance with ODV Requirements

| Requirement | Implementation | Status |
|-------------|---------------|--------|
| Fixed $1 backing | `platform_config.fixed_backing_amount` | ✅ |
| Milestone-based funding | Sequential unlock + approval | ✅ |
| Admin moderation | `approve_milestone()` / `reject_milestone()` | ✅ |
| Proof verification | `proof_url` stored on-chain | ✅ |
| Goal validation | Cannot withdraw unless `raised >= goal` | ✅ |
| Refund mechanism | `refund_campaign()` for failed campaigns | ✅ |
| Emergency controls | `pause_platform()` / `unpause_platform()` | ✅ |
| Creator authentication | Signer requirement on withdrawals | ✅ |
| Transparency | All data on-chain, publicly visible | ✅ |

---

## 📝 Summary

**Total Instructions**: 11  
**Security Checks**: 15+  
**Error Codes**: 10  
**Data Structures**: 2 (PlatformConfig, Campaign)  

**Key Strengths**:
- ✅ Strong security (creator auth, goal validation, pause mechanism)
- ✅ Transparent (all proofs and states on-chain)
- ✅ Fair (fixed $1 backing, milestone-based release)
- ✅ Protected (refunds for failed campaigns)
- ✅ Moderated (admin approval required)

**Ready for**: Testnet deployment and integration testing

---

**Next Steps**: Deploy to SOON Network and test complete user flows end-to-end.
