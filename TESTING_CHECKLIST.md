# Complete User Flow Testing Checklist

## Setup
**Start fresh:**
```javascript
localStorage.clear()
// Disconnect wallet, use incognito window
```

---

## 🎯 Flow 1: First-Time Backer (New User → Back Project)

### Step 1: Landing & Discovery
- [ ] Go to `/` homepage
- [ ] See hero: "Back Projects with $1"
- [ ] Click "Find Projects"
- [ ] Lands on `/discover`

### Step 2: Connect Wallet
- [ ] Click "Connect Wallet" in header
- [ ] Wallet modal opens
- [ ] Select wallet & approve
- [ ] Header shows wallet address

### Step 3: Get Test USDC
- [ ] If balance = 0, yellow banner shows
- [ ] Click "Get 100 test USDC here"
- [ ] Goes to `/faucet`
- [ ] Enter/connect wallet
- [ ] Click "Request Test USDC"
- [ ] Receive 100 USDC

### Step 4: Browse & Back Project
- [ ] Return to `/discover`
- [ ] Use filters (category, sort, search)
- [ ] Click any project card
- [ ] See project detail page
- [ ] Video/image loads
- [ ] Milestones visible
- [ ] Click "Back this Project" ($1)

### Step 5: Transaction Flow
- [ ] Transaction modal opens
- [ ] "Approve Transaction" step
- [ ] Approve in wallet
- [ ] "Confirming on Blockchain"
- [ ] "Recording Backing"
- [ ] "Success!" with confetti 🎉
- [ ] See TX signature
- [ ] "View on Explorer" works

### Step 6: Post-Backing
- [ ] "What's next?" section shows
- [ ] Click "View Portfolio"
- [ ] Goes to `/portfolio`
- [ ] Backed project appears
- [ ] Stats updated (1 project, $1 spent)

**Pass Criteria:**
- [ ] Entire flow smooth, no errors
- [ ] Balance deducted correctly
- [ ] Project shows in portfolio

---

## 🚀 Flow 2: Creator Journey (Idea → Launch → Funded)

### Step 1: Submit Project
- [ ] Go to `/submit`
- [ ] See 4-step form
- [ ] **Step 1:** Title, category, tagline, image
- [ ] **Step 2:** Description, problem, solution, video
- [ ] **Step 3:** Funding goal, duration
- [ ] **Step 4:** Add 3 milestones
  - [ ] Percentages turn 🟢 green at 100%
  - [ ] Shows "✓ Perfect!" when valid

### Step 2: Blockchain Transaction
- [ ] Click "Submit for Review"
- [ ] Wallet prompts for signature
- [ ] Transaction modal shows steps
- [ ] Success screen shows:
  - [ ] Campaign ID
  - [ ] TX signature
  - [ ] "View in Queue" button
- [ ] Confetti animation 🎉

### Step 3: Admin Approval
- [ ] Admin goes to `/admin`
- [ ] Project appears in queue (pending)
- [ ] Admin clicks "Approve"
- [ ] Status → "live"

### Step 4: Live & Funding
- [ ] Project appears on `/discover`
- [ ] Backers can fund it
- [ ] Creator sees in `/dashboard/creator`
- [ ] Stats update (backers, funds)

### Step 5: Milestone Completion
- [ ] Go to `/dashboard/creator/milestones`
- [ ] Click "Submit Proof" on milestone
- [ ] Enter URL + description
- [ ] Click "Submit Proof"
- [ ] Status → "in_review"
- [ ] Admin approves
- [ ] Status → "approved"
- [ ] Funds unlock for withdrawal

**Pass Criteria:**
- [ ] Project goes live after approval
- [ ] Backers can fund
- [ ] Milestone system works
- [ ] Funds unlock correctly

---

## 🔧 Flow 3: First-Time User Onboarding

### Backer Onboarding
- [ ] Clear `localStorage.clear()`
- [ ] Connect wallet (no backed projects)
- [ ] Go to `/discover`
- [ ] **Auto-redirects** to `/onboarding/backer`
- [ ] Complete 4 steps
- [ ] Click "Explore Projects"
- [ ] Goes to `/discover`
- [ ] Won't show again

### Creator Onboarding
- [ ] Clear `localStorage.clear()`
- [ ] Connect wallet (no projects)
- [ ] Go to `/submit`
- [ ] **Auto-redirects** to `/onboarding/creator`
- [ ] Complete 4 steps (profile, skills, wallet)
- [ ] Click "Submit Your First Project"
- [ ] Goes to `/submit`
- [ ] Won't show again

**Pass Criteria:**
- [ ] Onboarding only shows once
- [ ] Doesn't loop infinitely
- [ ] Redirects work

---

## 🎨 Flow 4: Key UI Features

### Zero Balance Warning
- [ ] Wallet connected with 0 balance
- [ ] Go to `/discover`
- [ ] Yellow banner appears
- [ ] Links to `/faucet`

### Wallet Connection from Backing
- [ ] Wallet disconnected
- [ ] Go to any project
- [ ] Click "Connect Wallet to Fund"
- [ ] Wallet modal opens (not disabled)

### Search & Filters
- [ ] Go to `/discover`
- [ ] Search "project name"
- [ ] Filter by category
- [ ] Sort by "Trending"
- [ ] Results update

### Mobile Responsive
- [ ] Test on mobile viewport (375px)
- [ ] Header adapts
- [ ] Forms usable
- [ ] Wallet button works

---

## 🛡️ Admin Flow

### Project Management
- [ ] Go to `/admin` (admin wallet only)
- [ ] See pending projects
- [ ] Approve project
- [ ] Reject project (with reason)
- [ ] View analytics

### Milestone Review
- [ ] Go to Milestones tab
- [ ] See submitted proofs
- [ ] View proof URL
- [ ] Check backer votes
- [ ] Approve/reject

**Pass Criteria:**
- [ ] Admin controls work
- [ ] Only admin wallet has access

---

## Critical Checks

- [ ] No console errors
- [ ] Transactions confirm on blockchain
- [ ] Data persists after refresh
- [ ] Wallet disconnects properly
- [ ] Modal closes work
- [ ] Loading states show
- [ ] Error messages clear
- [ ] Links/buttons all work
- [ ] Images load
- [ ] Responsive on mobile

---

## Reset for Retesting

```javascript
// Clear all
localStorage.clear()

// Or specific keys
localStorage.removeItem('odv_onboarding_shown')
localStorage.removeItem('odv_show_backer_onboarding')
localStorage.removeItem('odv_backer_onboarding_completed')
localStorage.removeItem('odv_creator_onboarding_completed')
localStorage.removeItem('odv-submit-form')
```
