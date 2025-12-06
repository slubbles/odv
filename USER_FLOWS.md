# 🔄 OneDollarVentures (ODV) - User Flows Guide

Complete user journey documentation for all platform users.

---

## 📋 Table of Contents

1. [Platform Overview](#platform-overview)
2. [General User (Visitor)](#general-user-visitor)
3. [Backer Flow](#backer-flow)
4. [Creator Flow](#creator-flow)
5. [Admin Flow](#admin-flow)
6. [Smart Contract Interactions](#smart-contract-interactions)
7. [Error Handling](#error-handling)

---

## 🌐 Platform Overview

OneDollarVentures (ODV) is a Web3 crowdfunding platform where users can:
- **Backers**: Support projects with exactly $1 USDC
- **Creators**: Launch projects with milestone-based funding
- **Admins**: Review and approve projects/milestones

### Key Features
- Fixed $1 backing amount (on-chain enforced)
- Milestone-based fund release
- NFT badges for backers
- Automatic refunds for failed campaigns
- SOON Testnet (Solana L2) integration

---

## 👤 General User (Visitor)

### No Wallet Required Actions

```
┌─────────────────────────────────────────────────────────────┐
│                    VISITOR JOURNEY                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. BROWSE PLATFORM                                         │
│     └── Visit homepage (/)                                  │
│         ├── View featured projects                          │
│         ├── Read platform info                              │
│         └── Access "How It Works" (/how-it-works)           │
│                                                             │
│  2. DISCOVER PROJECTS                                       │
│     └── Go to /discover                                     │
│         ├── Search projects by keyword                      │
│         ├── Filter by category                              │
│         │   └── Technology, Art & Design, Gaming,           │
│         │       Social Impact, Food & Beverage, etc.        │
│         ├── Filter by status (Active, Completed, etc.)      │
│         └── Sort by (Trending, Newest, Ending Soon)         │
│                                                             │
│  3. VIEW PROJECT DETAILS                                    │
│     └── Click any project → /project/[id]                   │
│         ├── View project description                        │
│         ├── See funding progress                            │
│         ├── View milestones                                 │
│         ├── Read comments                                   │
│         └── See backer count                                │
│                                                             │
│  4. EXPLORE CREATORS                                        │
│     └── Go to /creators                                     │
│         └── Browse creator profiles                         │
│                                                             │
│  5. READ PLATFORM INFO                                      │
│     ├── /about - About the platform                         │
│     ├── /terms - Terms of service                           │
│     ├── /privacy - Privacy policy                           │
│     ├── /community-guidelines - Community rules             │
│     └── /help - Help center                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 💰 Backer Flow

### Complete Backer Journey

```
┌─────────────────────────────────────────────────────────────┐
│                    BACKER JOURNEY                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  STEP 1: WALLET SETUP                                       │
│  ═══════════════════                                        │
│                                                             │
│  1.1 Configure Wallet for SOON Testnet                      │
│      ├── Open Phantom/Solflare wallet                       │
│      ├── Go to Settings → Developer Settings                │
│      ├── Add custom network:                                │
│      │   ├── Name: SOON Testnet                             │
│      │   ├── RPC: https://rpc.testnet.soo.network/rpc       │
│      │   └── Chain ID: soon-testnet                         │
│      └── Switch to SOON Testnet network                     │
│                                                             │
│  1.2 Connect Wallet                                         │
│      ├── Click "Connect Wallet" in header                   │
│      ├── Select wallet provider (Phantom/Solflare)          │
│      └── Approve connection request                         │
│                                                             │
│  STEP 2: GET TEST USDC                                      │
│  ════════════════════════                                   │
│                                                             │
│  2.1 Visit Faucet (/faucet)                                 │
│      ├── Wallet auto-fills if connected                     │
│      ├── Or manually enter wallet address                   │
│      └── Click "Request Test USDC"                          │
│                                                             │
│  2.2 Add USDC Token to Wallet (if not visible)              │
│      ├── In wallet, click "Import Token"                    │
│      ├── Enter mint address:                                │
│      │   3PNhmxDckddYL24zEfrsHLFLXXvrdzBBoZgfRW8rruDs        │
│      └── Confirm token addition                             │
│                                                             │
│  2.3 Faucet Details                                         │
│      ├── Amount: 100 Test USDC per request                  │
│      ├── Cooldown: 24 hours between requests                │
│      └── Network: SOON Testnet only                         │
│                                                             │
│  STEP 3: BACK A PROJECT                                     │
│  ═══════════════════════                                    │
│                                                             │
│  3.1 Find Project to Back                                   │
│      ├── Browse /discover                                   │
│      ├── Use search/filters                                 │
│      └── Click project to view details                      │
│                                                             │
│  3.2 Execute Backing                                        │
│      ├── On project page (/project/[id])                    │
│      ├── Click "Back This Project" button                   │
│      │   └── Button shows "$1" fixed amount                 │
│      ├── Wallet popup appears                               │
│      ├── Review transaction details                         │
│      │   ├── Amount: 1 USDC (1,000,000 base units)          │
│      │   └── Destination: Campaign vault                    │
│      └── Click "Approve" in wallet                          │
│                                                             │
│  3.3 After Backing                                          │
│      ├── Success toast notification                         │
│      ├── Transaction recorded on-chain                      │
│      ├── Backing recorded in database                       │
│      ├── Receive NFT badge (Bronze Founder)                 │
│      └── Button changes to "Already Backed ✓"               │
│                                                             │
│  STEP 4: TRACK BACKED PROJECTS                              │
│  ═════════════════════════════                              │
│                                                             │
│  4.1 Backer Dashboard (/dashboard/backer)                   │
│      ├── Stats Overview:                                    │
│      │   ├── Total bets placed                              │
│      │   ├── Total spent                                    │
│      │   ├── NFTs collected                                 │
│      │   └── Active projects backed                         │
│      │                                                      │
│      ├── Tabs:                                              │
│      │   ├── "Still Building" - Active projects             │
│      │   ├── "Made It" - Successfully funded                │
│      │   └── "My Proof" - NFT badges earned                 │
│      │                                                      │
│      └── For each project:                                  │
│          ├── Funding progress                               │
│          ├── Days remaining                                 │
│          └── Link to project page                           │
│                                                             │
│  STEP 5: REFUND (If Campaign Fails)                         │
│  ═════════════════════════════════                          │
│                                                             │
│  5.1 Eligibility                                            │
│      ├── Campaign deadline has passed                       │
│      └── Funding goal was NOT reached                       │
│                                                             │
│  5.2 Claim Refund                                           │
│      ├── Visit project page                                 │
│      ├── "Claim Refund" button appears                      │
│      ├── Sign transaction in wallet                         │
│      └── $1 USDC returned to your wallet                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Backer Dashboard Features

| Tab | Content | Actions |
|-----|---------|---------|
| Still Building | Active backed projects | View progress, visit project |
| Made It | Successfully funded projects | View final status |
| My Proof | NFT badges earned | View badge details |

---

## 🎨 Creator Flow

### Complete Creator Journey

```
┌─────────────────────────────────────────────────────────────┐
│                    CREATOR JOURNEY                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  STEP 1: SETUP & ONBOARDING                                 │
│  ══════════════════════════                                 │
│                                                             │
│  1.1 Connect Wallet                                         │
│      ├── Click "Connect Wallet" in header                   │
│      └── Use Phantom or Solflare on SOON Testnet            │
│                                                             │
│  1.2 Complete Onboarding (/onboarding/creator)              │
│      ├── Step 1: Profile                                    │
│      │   ├── Display name                                   │
│      │   ├── Bio                                            │
│      │   └── Website (optional)                             │
│      │                                                      │
│      ├── Step 2: Experience                                 │
│      │   ├── Previous projects                              │
│      │   └── Skills/expertise                               │
│      │                                                      │
│      ├── Step 3: Payment                                    │
│      │   └── Wallet verification                            │
│      │                                                      │
│      └── Step 4: Complete                                   │
│          └── Profile ready                                  │
│                                                             │
│  STEP 2: CREATE PROJECT                                     │
│  ═══════════════════════                                    │
│                                                             │
│  2.1 Start New Project (/submit)                            │
│      │                                                      │
│      ├── Step 1: Basic Info                                 │
│      │   ├── Project title *                                │
│      │   ├── Category * (dropdown)                          │
│      │   ├── Tagline * (short description)                  │
│      │   └── Cover image URL                                │
│      │                                                      │
│      ├── Step 2: Story                                      │
│      │   ├── Full description *                             │
│      │   ├── Problem you're solving *                       │
│      │   ├── Your solution *                                │
│      │   └── Demo video URL (optional)                      │
│      │                                                      │
│      ├── Step 3: Funding                                    │
│      │   ├── Funding goal * (in USD)                        │
│      │   └── Campaign duration * (14-90 days)               │
│      │                                                      │
│      └── Step 4: Milestones                                 │
│          ├── Add milestone(s):                              │
│          │   ├── Title *                                    │
│          │   ├── Percentage of funds *                      │
│          │   └── Deadline *                                 │
│          │                                                  │
│          └── Note: Percentages must total 100%              │
│                                                             │
│  2.2 Submit for Review                                      │
│      ├── Review all information                             │
│      ├── Click "Submit for Review"                          │
│      └── Project enters admin queue                         │
│                                                             │
│  STEP 3: WAIT FOR APPROVAL                                  │
│  ═════════════════════════                                  │
│                                                             │
│  3.1 Project Status: "In Review"                            │
│      ├── Visible in creator dashboard                       │
│      ├── Cannot receive backing yet                         │
│      └── Admin will review within 24-48 hours               │
│                                                             │
│  3.2 Possible Outcomes                                      │
│      ├── APPROVED → Status: "Active"                        │
│      │   └── Campaign goes live, can receive backing        │
│      │                                                      │
│      └── REJECTED → Status: "Rejected"                      │
│          ├── Reason provided                                │
│          └── Can edit and resubmit                          │
│                                                             │
│  STEP 4: CAMPAIGN LIVE                                      │
│  ═════════════════════                                      │
│                                                             │
│  4.1 Monitor Progress (/dashboard/creator)                  │
│      ├── View funding progress                              │
│      ├── See backer count                                   │
│      ├── Track days remaining                               │
│      └── Read backer comments                               │
│                                                             │
│  4.2 Campaign Outcomes                                      │
│      │                                                      │
│      ├── SUCCESS (Goal Reached)                             │
│      │   ├── Status → "Funded"                              │
│      │   └── Proceed to milestone delivery                  │
│      │                                                      │
│      └── FAILED (Goal Not Reached by Deadline)              │
│          ├── Status → "Failed"                              │
│          └── Backers can claim refunds                      │
│                                                             │
│  STEP 5: MILESTONE DELIVERY                                 │
│  ═════════════════════════                                  │
│                                                             │
│  5.1 Complete Milestone Work                                │
│      └── Do the actual work described in milestone          │
│                                                             │
│  5.2 Submit Proof                                           │
│      ├── Go to project management page                      │
│      ├── Click "Submit Proof" for active milestone          │
│      ├── Provide proof URL (IPFS, GitHub, demo link)        │
│      ├── Sign transaction (on-chain proof submission)       │
│      └── Milestone status → "In Review"                     │
│                                                             │
│  5.3 Wait for Admin Review                                  │
│      │                                                      │
│      ├── APPROVED                                           │
│      │   ├── Milestone status → "Approved"                  │
│      │   └── Can release funds                              │
│      │                                                      │
│      └── REJECTED                                           │
│          ├── Milestone status → "Active" (reset)            │
│          ├── Feedback provided                              │
│          └── Resubmit with better proof                     │
│                                                             │
│  STEP 6: WITHDRAW FUNDS                                     │
│  ═══════════════════════                                    │
│                                                             │
│  6.1 Release Milestone Funds                                │
│      ├── Milestone must be "Approved"                       │
│      ├── Click "Release Funds"                              │
│      ├── Sign transaction in wallet                         │
│      └── USDC transferred to your wallet                    │
│                                                             │
│  6.2 Fund Release Schedule                                  │
│      ├── Only approved milestones can be released           │
│      ├── Funds released sequentially (Milestone 1, 2, etc.) │
│      └── Next milestone unlocks after current completes     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Creator Dashboard Features

| Tab | Content | Actions |
|-----|---------|---------|
| All Projects | All created projects | View, edit |
| Live | Active campaigns | Monitor, share |
| In Review | Pending approval | Wait |
| Shipped | Completed projects | View history |
| Drafts | Unsubmitted projects | Continue editing |

### Project Statuses Explained

| Status | Meaning | Can Receive Backing? |
|--------|---------|---------------------|
| `draft` | Not submitted yet | No |
| `queue`/`pending` | Awaiting admin review | No |
| `active` | Live campaign | Yes ✓ |
| `funded` | Goal reached | No |
| `completed` | All milestones done | No |
| `failed` | Deadline passed, goal not met | No |
| `rejected` | Admin rejected | No |

---

## 🛡️ Admin Flow

### Complete Admin Journey

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN JOURNEY                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  REQUIREMENTS                                               │
│  ════════════                                               │
│  Admin Wallet: 4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw │
│  Must be connected to access admin pages                    │
│                                                             │
│  STEP 1: ACCESS ADMIN PANEL                                 │
│  ═══════════════════════════                                │
│                                                             │
│  1.1 Connect Admin Wallet                                   │
│      ├── Connect wallet with admin address                  │
│      └── AdminGuard component verifies authority            │
│                                                             │
│  1.2 Navigate to Admin (/admin)                             │
│      ├── View admin dashboard                               │
│      └── See overview stats                                 │
│                                                             │
│  STEP 2: PROJECT REVIEW                                     │
│  ═══════════════════════                                    │
│                                                             │
│  2.1 Review Queue (/admin or /admin/queue-review)           │
│      ├── Stats:                                             │
│      │   ├── Pending count                                  │
│      │   ├── Approved count                                 │
│      │   ├── Rejected count                                 │
│      │   └── Approval rate %                                │
│      │                                                      │
│      ├── Filter by:                                         │
│      │   ├── Status                                         │
│      │   ├── Category                                       │
│      │   └── Date submitted                                 │
│      │                                                      │
│      └── Sort by:                                           │
│          ├── Newest                                         │
│          ├── Oldest                                         │
│          └── Category                                       │
│                                                             │
│  2.2 Review Individual Project                              │
│      ├── View full project details                          │
│      ├── Check creator profile                              │
│      ├── Verify milestones are reasonable                   │
│      └── Review funding goal                                │
│                                                             │
│  2.3 Take Action                                            │
│      │                                                      │
│      ├── APPROVE                                            │
│      │   ├── Click "Approve" button                         │
│      │   ├── Project status → "Active"                      │
│      │   ├── Creator notified                               │
│      │   └── Campaign goes live                             │
│      │                                                      │
│      └── REJECT                                             │
│          ├── Click "Reject" button                          │
│          ├── Provide rejection reason                       │
│          ├── Project status → "Rejected"                    │
│          └── Creator notified with feedback                 │
│                                                             │
│  2.4 Bulk Actions                                           │
│      ├── Select multiple projects                           │
│      ├── Bulk Approve selected                              │
│      └── Bulk Reject selected (with reason)                 │
│                                                             │
│  STEP 3: MILESTONE REVIEW                                   │
│  ═════════════════════════                                  │
│                                                             │
│  3.1 Milestones Queue (/admin/milestones)                   │
│      ├── View milestones pending review                     │
│      ├── Filter by status:                                  │
│      │   ├── All                                            │
│      │   ├── Pending Review                                 │
│      │   ├── Approved                                       │
│      │   └── Rejected                                       │
│      │                                                      │
│      └── Stats:                                             │
│          ├── Pending review count                           │
│          ├── Overdue count                                  │
│          ├── On track count                                 │
│          ├── Approved count                                 │
│          └── Rejected count                                 │
│                                                             │
│  3.2 Review Milestone Proof                                 │
│      ├── View proof URL submitted by creator                │
│      ├── Check if work matches milestone description        │
│      └── Verify quality meets standards                     │
│                                                             │
│  3.3 Take Action (On-Chain Transaction)                     │
│      │                                                      │
│      ├── APPROVE MILESTONE                                  │
│      │   ├── Click "Approve"                                │
│      │   ├── Sign transaction in wallet                     │
│      │   │   └── Calls approve_milestone instruction        │
│      │   ├── Milestone status → "Approved"                  │
│      │   └── Creator can release funds                      │
│      │                                                      │
│      └── REJECT MILESTONE                                   │
│          ├── Click "Reject"                                 │
│          ├── Provide feedback                               │
│          ├── Sign transaction in wallet                     │
│          │   └── Calls reject_milestone instruction         │
│          ├── Milestone status → "Active" (reset)            │
│          └── Creator must resubmit proof                    │
│                                                             │
│  STEP 4: USER MANAGEMENT                                    │
│  ═════════════════════════                                  │
│                                                             │
│  4.1 Users Page (/admin/users)                              │
│      ├── Search users by name/email                         │
│      ├── Filter by role (Creator/Backer)                    │
│      ├── View user stats:                                   │
│      │   ├── Projects created                               │
│      │   ├── Projects backed                                │
│      │   ├── Total raised                                   │
│      │   └── Total backed                                   │
│      └── View/manage user profiles                          │
│                                                             │
│  STEP 5: PLATFORM ANALYTICS                                 │
│  ═══════════════════════════                                │
│                                                             │
│  5.1 Analytics Page (/admin/analytics)                      │
│      ├── Platform-wide metrics                              │
│      ├── Funding trends                                     │
│      ├── User growth                                        │
│      └── Category performance                               │
│                                                             │
│  5.2 Activity Log (/admin/activity)                         │
│      ├── Recent platform activity                           │
│      ├── Project launches                                   │
│      ├── Backings                                           │
│      └── Milestone completions                              │
│                                                             │
│  STEP 6: EMERGENCY CONTROLS                                 │
│  ═══════════════════════════                                │
│                                                             │
│  6.1 Platform Pause (Smart Contract)                        │
│      ├── Can pause all platform operations                  │
│      ├── Calls pause_platform instruction                   │
│      └── Prevents new backings/withdrawals                  │
│                                                             │
│  6.2 Unpause Platform                                       │
│      ├── Resume normal operations                           │
│      └── Calls unpause_platform instruction                 │
│                                                             │
│  STEP 7: INITIALIZE PLATFORM (One-Time)                     │
│  ═══════════════════════════════════════                    │
│                                                             │
│  7.1 Platform Initialization (/admin/initialize)            │
│      ├── Only needed once on fresh deployment               │
│      ├── Calls initialize_platform instruction              │
│      └── Sets admin wallet and backing amount               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Admin Sidebar Navigation

| Page | Path | Description |
|------|------|-------------|
| Dashboard | `/admin` | Overview & project queue |
| Queue Review | `/admin/queue-review` | Project approval queue |
| Milestones | `/admin/milestones` | Milestone reviews |
| Users | `/admin/users` | User management |
| Analytics | `/admin/analytics` | Platform metrics |
| Activity | `/admin/activity` | Activity log |
| Schedule | `/admin/schedule` | Scheduled tasks |
| Initialize | `/admin/initialize` | Platform setup |

---

## ⛓️ Smart Contract Interactions

### Transaction Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                 ON-CHAIN TRANSACTIONS                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  BACKER TRANSACTIONS                                        │
│  ═══════════════════                                        │
│                                                             │
│  1. fund (Back Project)                                     │
│     ├── Signer: Backer wallet                               │
│     ├── Amount: 1,000,000 (1 USDC, 6 decimals)              │
│     ├── From: Backer's USDC token account                   │
│     ├── To: Campaign vault PDA                              │
│     └── Updates: campaign.raised, campaign.backer_count     │
│                                                             │
│  2. refund_campaign (Claim Refund)                          │
│     ├── Signer: Backer wallet                               │
│     ├── Requires: deadline passed + goal not met            │
│     ├── From: Campaign vault                                │
│     └── To: Backer's USDC token account                     │
│                                                             │
│  CREATOR TRANSACTIONS                                       │
│  ════════════════════                                       │
│                                                             │
│  3. initialize (Create Campaign)                            │
│     ├── Signer: Creator wallet                              │
│     ├── Creates: Campaign PDA                               │
│     └── Sets: goal, deadline, milestones                    │
│                                                             │
│  4. submit_milestone_proof                                  │
│     ├── Signer: Creator wallet                              │
│     ├── Input: proof_url (IPFS/URL)                         │
│     └── Updates: milestone.status → InReview                │
│                                                             │
│  5. release_milestone                                       │
│     ├── Signer: Creator wallet                              │
│     ├── Requires: milestone.status == Approved              │
│     ├── From: Campaign vault                                │
│     ├── To: Creator's USDC token account                    │
│     └── Amount: milestone.amount                            │
│                                                             │
│  ADMIN TRANSACTIONS                                         │
│  ═══════════════════                                        │
│                                                             │
│  6. initialize_platform (One-time)                          │
│     ├── Signer: Admin wallet                                │
│     ├── Creates: PlatformConfig PDA                         │
│     └── Sets: admin, fixed_backing_amount                   │
│                                                             │
│  7. approve_milestone                                       │
│     ├── Signer: Admin wallet                                │
│     ├── Requires: milestone.status == InReview              │
│     └── Updates: milestone.status → Approved                │
│                                                             │
│  8. reject_milestone                                        │
│     ├── Signer: Admin wallet                                │
│     ├── Requires: milestone.status == InReview              │
│     └── Updates: milestone.status → Active (reset)          │
│                                                             │
│  9. pause_platform                                          │
│     ├── Signer: Admin wallet                                │
│     └── Updates: platform_config.paused → true              │
│                                                             │
│  10. unpause_platform                                       │
│      ├── Signer: Admin wallet                               │
│      └── Updates: platform_config.paused → false            │
│                                                             │
│  11. update_backing_amount                                  │
│      ├── Signer: Admin wallet                               │
│      └── Updates: platform_config.fixed_backing_amount      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### PDA (Program Derived Addresses)

| PDA | Seeds | Purpose |
|-----|-------|---------|
| Platform Config | `["platform_config"]` | Global settings |
| Campaign | `["campaign", creator_pubkey]` | Campaign data |
| Campaign Vault | `["campaign_vault", campaign_pda]` | USDC escrow |

---

## ⚠️ Error Handling

### Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `Wallet not connected` | No wallet connected | Connect Phantom/Solflare |
| `User rejected` | User cancelled transaction | Try again, click approve |
| `Insufficient funds` | Not enough USDC | Get test USDC from faucet |
| `Already backed` | User already backed this project | Cannot back twice |
| `Platform paused` | Admin paused operations | Wait for admin to unpause |
| `Goal not reached` | Trying to release before funded | Wait for goal to be met |
| `Deadline not reached` | Trying to refund early | Wait for campaign deadline |
| `Unauthorized` | Wrong wallet for action | Use correct wallet |
| `Milestone not approved` | Trying to release unapproved | Wait for admin approval |

### Smart Contract Error Codes

| Code | Name | Description |
|------|------|-------------|
| 6000 | `NoMoreMilestones` | All milestones completed |
| 6001 | `MilestoneNotApproved` | Cannot release unapproved milestone |
| 6002 | `MilestoneNotActive` | Milestone not in active state |
| 6003 | `MilestoneNotInReview` | Cannot approve/reject non-reviewed milestone |
| 6004 | `UnauthorizedAdmin` | Only admin can do this |
| 6005 | `UnauthorizedWithdrawal` | Only creator can withdraw |
| 6006 | `GoalNotReached` | Goal must be reached first |
| 6007 | `PlatformPaused` | Platform is paused |
| 6008 | `DeadlineNotReached` | Wait for deadline to pass |
| 6009 | `GoalAlreadyReached` | Cannot refund successful campaign |

---

## 📍 Quick Reference: Page Routes

### Public Pages
| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/discover` | Browse projects |
| `/project/[id]` | Project details |
| `/creators` | Browse creators |
| `/how-it-works` | Platform guide |
| `/about` | About page |
| `/help` | Help center |
| `/faucet` | Test USDC faucet |

### Authenticated Pages
| Route | User Type | Description |
|-------|-----------|-------------|
| `/dashboard` | Any | Auto-redirect based on role |
| `/dashboard/backer` | Backer | Backed projects |
| `/dashboard/creator` | Creator | Created projects |
| `/submit` | Creator | Create new project |
| `/profile` | Any | User profile |
| `/wallet` | Any | Wallet & transactions |
| `/notifications` | Any | Notifications |
| `/settings` | Any | Account settings |

### Admin Pages
| Route | Description |
|-------|-------------|
| `/admin` | Admin dashboard |
| `/admin/queue-review` | Project review queue |
| `/admin/milestones` | Milestone reviews |
| `/admin/users` | User management |
| `/admin/analytics` | Platform analytics |
| `/admin/activity` | Activity log |
| `/admin/initialize` | Platform setup |

---

## 🔗 Related Documentation

- `DESIGN_SYSTEM.md` - UI/UX design guidelines
- `SECRETS.md` - Credentials and configuration
- `PROJECT_DOCS.md` - Technical documentation
- `README.md` - Quick start guide

---

*Last Updated: December 2024*
