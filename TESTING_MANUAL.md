# ODV Testing Manual

**Version:** 1.0  
**Network:** SOON Testnet  
**Last Updated:** December 13, 2025

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Test Environment Setup](#test-environment-setup)
3. [Creator Flow Testing](#creator-flow-testing)
4. [Backer Flow Testing](#backer-flow-testing)
5. [Admin Flow Testing](#admin-flow-testing)
6. [Mobile Testing](#mobile-testing)
7. [Edge Cases & Error Handling](#edge-cases--error-handling)
8. [Performance Testing](#performance-testing)
9. [Known Issues](#known-issues)

---

## Prerequisites

### Required Tools
- ✅ Web3 wallet (Phantom, Backpack, or Solana-compatible)
- ✅ SOON Testnet SOL (for gas fees)
- ✅ Test USDC tokens (from `/faucet` page)
- ✅ Desktop browser (Chrome, Firefox, Brave recommended)
- ✅ Mobile device for mobile testing

### Network Configuration
- **Network:** SOON Testnet
- **RPC:** `https://rpc.testnet.soo.network/rpc`
- **Explorer:** `https://explorer.testnet.soo.network`
- **Chain ID:** SOON Testnet

### Test Accounts
Create at least 3 test wallets:
1. **Creator Wallet** - For submitting projects
2. **Backer Wallet** - For funding projects
3. **Admin Wallet** - `4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw`

---

## Test Environment Setup

### 1. Get Test USDC
**Steps:**
1. Navigate to `/faucet`
2. Connect wallet
3. Click "Request 10 USDC"
4. Wait for transaction confirmation (~400ms)

**Expected Result:**
- ✅ Toast notification: "10 USDC sent successfully!"
- ✅ Wallet balance increases by 10 USDC
- ✅ Can request again after 24 hours

**Possible Errors:**
- ❌ "Rate limit exceeded" - Wait 24 hours
- ❌ "Insufficient SOL for gas" - Get SOL from faucet first
- ❌ "Network error" - Check RPC connection

### 2. Verify Wallet Connection
**Steps:**
1. Click "Connect Wallet" in header
2. Select wallet provider (Phantom/Backpack)
3. Approve connection

**Expected Result:**
- ✅ Header shows truncated wallet address (e.g., `4GCC...FxRw`)
- ✅ Green connected indicator appears
- ✅ Profile avatar displays
- ✅ Balance shows in dropdown

---

## Creator Flow Testing

### Test 1: Project Submission (Happy Path)

**Steps:**
1. Navigate to `/submit` or click "Launch Your Project"
2. Connect wallet (if not connected)
3. Fill out form:
   - **Title:** "Test Project Alpha"
   - **Category:** "DeFi"
   - **Tagline:** "Revolutionary DeFi protocol"
   - **Description:** "This is a test project for ODV platform validation"
   - **Problem:** "Current DeFi lacks X"
   - **Solution:** "We solve it with Y"
   - **Image URL:** `https://via.placeholder.com/800x600`
   - **Video URL:** (optional) `https://youtube.com/watch?v=test`
   - **Funding Goal:** `1000` (USD)
   - **Duration:** `30` (days)
4. Add 3 milestones:
   - Milestone 1: "MVP Launch" - 40% - 10 days from now
   - Milestone 2: "Beta Testing" - 30% - 20 days from now
   - Milestone 3: "Public Release" - 30% - 30 days from now
5. Click "Submit for Review"
6. Approve transaction in wallet

**Expected Result:**
- ✅ Toast: "Initializing campaign on blockchain..."
- ✅ Transaction signature appears
- ✅ Toast: "Campaign initialized on blockchain!"
- ✅ Toast: "Project submitted for review!"
- ✅ 🎉 **Confetti animation** appears for 3 seconds
- ✅ Success screen shows:
  - Project title
  - Status: "In Review Queue"
  - Campaign ID number
  - Transaction signature with link to explorer
  - "View in Queue" button
- ✅ Project appears in admin queue with status "pending"

**Possible Errors:**
- ❌ "Milestone percentages must total 100%" - Adjust percentages
- ❌ "Minimum funding goal is $100" - Increase goal
- ❌ "All milestones must have a deadline" - Add missing dates
- ❌ "Campaign ID conflict. Please try again." - Rare race condition, retry
- ❌ "User rejected transaction" - Transaction cancelled, no charge
- ❌ "Insufficient SOL for gas" - Get more SOL from faucet

### Test 2: Project Submission (Validation Errors)

**Test 2a: Missing Required Fields**
1. Leave title empty, try to submit
   - **Expected:** Toast "Please fill in all required fields"

**Test 2b: Invalid Funding Goal**
1. Set goal to `50` (below $100 minimum)
   - **Expected:** Toast "Minimum funding goal is $100"

**Test 2c: Milestone Percentage Mismatch**
1. Set milestones to total 95%
   - **Expected:** Toast "Milestone percentages must total 100% (currently 95%)"

**Test 2d: Missing Milestone Deadline**
1. Leave one milestone deadline empty
   - **Expected:** Toast "All milestones must have a deadline"

### Test 3: View Project After Submission

**Steps:**
1. After successful submission, click "View in Queue"
2. Or navigate to `/admin` (if admin) → Queue tab

**Expected Result (Creator View):**
- ✅ Project shows status badge: "In Review Queue"
- ✅ Cannot back own project
- ✅ Edit button not available (project in queue)

**Expected Result (Admin View):**
- ✅ Project appears at top of queue (newest first)
- ✅ Shows all details: title, category, goal, milestones
- ✅ "Approve" and "Reject" buttons visible
- ✅ Campaign ID displays

---

## Backer Flow Testing

### Test 4: Back Active Project (Happy Path)

**Prerequisites:**
- Project must be approved by admin (status: "active")
- Backer wallet has ≥1 USDC

**Steps:**
1. Navigate to `/discover` or `/project/[id]`
2. Find an approved project (green "Active" badge)
3. Click "Back this Project" button
4. Approve transaction in wallet (1 USDC transfer)
5. Wait for transaction modal to complete all steps:
   - Approving transaction...
   - Confirming on blockchain...
   - Recording in database...
   - Success! 🎉

**Expected Result:**
- ✅ Transaction progress modal shows each step
- ✅ 🎉 **Confetti animation** appears on success
- ✅ Modal shows:
   - Green checkmark icon
   - "Transaction Successful!"
   - Transaction signature
   - "View on Explorer" button
- ✅ Button changes to "Already Funded" (green checkmark)
- ✅ Project stats update:
   - Backers count +1
   - Funded amount +$1
   - Progress bar increases
- ✅ Activity feed shows new backing event
- ✅ Creator receives notification (if notifications enabled)

**Possible Errors:**
- ❌ "Not enough funds in your wallet" - Get more USDC from faucet
- ❌ "Campaign not initialized" - Project not properly deployed
- ❌ "User rejected transaction" - Transaction cancelled
- ❌ "Transaction succeeded on blockchain but failed to record" - Check explorer, refresh page
- ❌ "Already backed this project" - One backing per wallet

### Test 5: Backing Restrictions

**Test 5a: Double Backing Prevention**
1. Try to back same project twice from same wallet
   - **Expected:** Button shows "Already Funded" (disabled)

**Test 5b: Back Own Project**
1. Creator tries to back their own project
   - **Expected:** (Current: allowed, but shouldn't count in some contexts)

**Test 5c: Back Queue Project**
1. Try to back project still in review queue
   - **Expected:** Button shows "In Review Queue" (disabled)

**Test 5d: Back Completed Project**
1. Try to back project with status "completed"
   - **Expected:** Button shows "Campaign Ended" (disabled)

**Test 5e: Wallet Not Connected**
1. Try to back without connecting wallet
   - **Expected:** Button shows "Connect Wallet to Fund" (disabled)

### Test 6: View Backed Projects

**Steps:**
1. Navigate to `/portfolio`
2. View "Funded Projects" section

**Expected Result:**
- ✅ All backed projects display with:
   - Project thumbnail
   - Title and category
   - Funding progress bar
   - Current status (Active, Completed, etc.)
   - Link to project page
- ✅ If no projects: "No projects backed yet" message
- ✅ Sorting works (newest first)

---

## Admin Flow Testing

### Test 7: Admin Dashboard Access

**Prerequisites:**
- Must be logged in with admin wallet: `4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw`

**Steps:**
1. Connect admin wallet
2. Verify "Admin" dropdown appears in header
3. Click "Admin" → "Admin Dashboard"
4. Navigate to `/admin`

**Expected Result:**
- ✅ Admin dropdown only visible to admin wallet
- ✅ Non-admin users: dropdown not visible
- ✅ Dashboard shows 4 tabs:
   - Queue (with pending count badge)
   - Milestones
   - Analytics
   - Users
- ✅ Default tab: Queue

### Test 8: Queue Review & Approval

**Steps:**
1. Navigate to `/admin` → Queue tab
2. Find pending project (yellow badge)
3. Click "Approve" button
4. Confirm approval in modal

**Expected Result:**
- ✅ Toast: "Project approved successfully!"
- ✅ Project status changes to "active" (green badge)
- ✅ Project appears on `/discover` page
- ✅ Backers can now fund the project
- ✅ Approved count badge updates
- ✅ Creator receives notification (if implemented)
- ✅ Project card moves to "Approved" section

**Possible Errors:**
- ❌ "Campaign ID not found" - Blockchain initialization failed
- ❌ "Failed to update status" - Database connection issue

### Test 9: Queue Review & Rejection

**Steps:**
1. Navigate to `/admin` → Queue tab
2. Find pending project
3. Click "Reject" button
4. Enter rejection reason: "Incomplete project description"
5. Confirm rejection

**Expected Result:**
- ✅ Rejection modal appears
- ✅ Toast: "Project rejected"
- ✅ Project status changes to "rejected" (red badge)
- ✅ Project does NOT appear on `/discover`
- ✅ Rejected count updates
- ✅ Creator can see rejection reason (future: notification)
- ✅ Project moves to "Rejected" section

### Test 10: Bulk Queue Actions

**Steps:**
1. Navigate to `/admin` → Queue tab
2. Check multiple projects (checkbox)
3. Click "Bulk Approve" or "Bulk Reject"

**Expected Result:**
- ✅ All selected projects update simultaneously
- ✅ Toast shows count: "3 projects approved"
- ✅ Stats update for all projects
- ✅ Selection clears after action

### Test 11: Milestone Review

**Steps:**
1. Navigate to `/admin` → Milestones tab
2. Find project with "Milestone Completed" status
3. Review proof of completion (link, screenshot, video)
4. Click "Approve Milestone"

**Expected Result:**
- ✅ Milestone status changes to "approved"
- ✅ Funds for that milestone become available for withdrawal
- ✅ Project progress updates
- ✅ Creator can withdraw milestone funds
- ✅ Activity feed logs milestone approval

### Test 12: Analytics Dashboard

**Steps:**
1. Navigate to `/admin` → Analytics tab

**Expected Result:**
- ✅ Platform stats cards show:
   - Total Projects
   - Total Funding
   - Total Backers
   - Active Campaigns
- ✅ Charts render:
   - Funding over time (line chart)
   - Projects by category (pie chart)
   - Top projects (bar chart)
- ✅ Recent activity feed displays
- ✅ All data refreshes on page load

### Test 13: User Management

**Steps:**
1. Navigate to `/admin` → Users tab
2. View list of all users (backers + creators)
3. Search for specific user by wallet address

**Expected Result:**
- ✅ User list displays with:
   - Wallet address (truncated)
   - Projects created count
   - Projects backed count
   - Total funded amount
   - Join date
- ✅ Search filters work
- ✅ Can view user profile
- ✅ Can ban/suspend users (if implemented)

---

## Mobile Testing

### Test 14: Mobile Navigation

**Devices to Test:**
- iPhone (Safari, Chrome)
- Android (Chrome, Firefox)
- Tablet (iPad, Android)

**Steps:**
1. Open site on mobile browser
2. Test responsive header
3. Open mobile menu (hamburger)

**Expected Result:**
- ✅ Logo centered on mobile
- ✅ Profile avatar on LEFT side
- ✅ Wallet button on RIGHT side (compact, shows address)
- ✅ Hamburger menu accessible
- ✅ Mobile menu slides in smoothly
- ✅ All navigation links work
- ✅ Touch targets ≥44px (accessibility)

### Test 15: Mobile Wallet Connection

**Steps:**
1. Click "Connect Wallet" on mobile
2. Select wallet (Phantom mobile app)
3. Approve connection

**Expected Result:**
- ✅ Wallet deeplink opens Phantom app
- ✅ Connection approved in app
- ✅ Returns to browser automatically
- ✅ Wallet connected (green dot indicator)
- ✅ Avatar + address display correctly
- ✅ Balance dropdown works on tap

### Test 16: Mobile Project Submission

**Steps:**
1. Navigate to `/submit` on mobile
2. Fill out entire form (scroll test)
3. Add milestones
4. Submit and approve transaction

**Expected Result:**
- ✅ Form fields fully visible (no overflow)
- ✅ Date pickers work on mobile
- ✅ Keyboard doesn't hide inputs
- ✅ Submit button always accessible
- ✅ Transaction modal fits screen
- ✅ Confetti animation displays properly

### Test 17: Mobile Project Backing

**Steps:**
1. Navigate to `/project/[id]` on mobile
2. Scroll to "Back this Project" button
3. Click and approve transaction

**Expected Result:**
- ✅ Button visible (not cut off)
- ✅ Transaction modal responsive
- ✅ Progress steps clear on small screen
- ✅ Confetti animation works on mobile
- ✅ Success state displays fully

---

## Edge Cases & Error Handling

### Test 18: Network Disconnection

**Steps:**
1. Start backing a project
2. Turn off WiFi/data mid-transaction
3. Wait for timeout

**Expected Result:**
- ❌ Toast: "Network error. Please check your connection."
- ✅ Transaction does NOT complete
- ✅ No funds deducted from wallet
- ✅ Can retry after reconnecting

### Test 19: Wallet Disconnection During Flow

**Steps:**
1. Connect wallet
2. Navigate to project page
3. Disconnect wallet from browser extension
4. Try to back project

**Expected Result:**
- ✅ Button shows "Connect Wallet to Fund"
- ✅ Toast: "Wallet connection lost. Reconnect and try again."
- ✅ No transaction attempted

### Test 20: Insufficient Funds

**Steps:**
1. Empty wallet of all USDC (send to another wallet)
2. Try to back a project (requires 1 USDC)

**Expected Result:**
- ❌ Transaction fails in wallet
- ❌ Toast: "Not enough funds in your wallet. Add more and try again."
- ✅ No database record created
- ✅ Link to faucet provided (if testnet)

### Test 21: Race Condition - Campaign ID Conflict

**Steps:**
1. Two creators submit projects simultaneously (within 1 second)
2. Both try to claim same campaign ID

**Expected Result:**
- ✅ First transaction succeeds
- ❌ Second transaction fails with: "Campaign ID conflict. Please try again."
- ✅ Second creator can retry immediately
- ✅ New campaign ID assigned on retry

### Test 22: Database Recording Failure

**Steps:**
1. Simulate database downtime (for dev testing only)
2. Complete a backing transaction
3. Transaction succeeds on blockchain but DB fails

**Expected Result:**
- ✅ Transaction succeeds on-chain (funds transferred)
- ❌ Toast: "Transaction succeeded but we couldn't record it. Check explorer to verify, then refresh page."
- ✅ Transaction signature displayed
- ✅ Link to blockchain explorer provided
- ✅ Auto-refresh after 10 seconds
- ✅ After refresh, system syncs from blockchain

### Test 23: Browser Back Button During Transaction

**Steps:**
1. Start backing a project
2. While transaction modal is open, click browser back button

**Expected Result:**
- ✅ Modal stays open (locked during transaction)
- ✅ Transaction completes or fails gracefully
- ✅ After transaction, back button works normally

### Test 24: Multiple Tabs/Windows

**Steps:**
1. Open same project in 2 browser tabs
2. Back project in Tab 1
3. Try to back same project in Tab 2

**Expected Result:**
- ✅ Tab 1: Backing succeeds
- ✅ Tab 2: Button shows "Already Funded" after refresh
- ✅ No duplicate database entries
- ✅ Project stats consistent across tabs

### Test 25: Expired Campaigns

**Steps:**
1. Find project with deadline passed
2. Try to back the project

**Expected Result:**
- ✅ Button shows "Campaign Ended" (disabled)
- ✅ Project shows "Expired" or "Failed" status
- ✅ Option to refund backers (if goal not met)

---

## Performance Testing

### Test 26: Load Time Testing

**Steps:**
1. Clear browser cache
2. Navigate to homepage with network throttling (Slow 3G)
3. Measure time to interactive

**Expected Result:**
- ✅ Hero section loads < 1 second
- ✅ Above-the-fold content visible < 2 seconds
- ✅ Full page interactive < 3 seconds
- ✅ Images lazy load below fold
- ✅ No layout shift (CLS < 0.1)

### Test 27: Concurrent Transactions

**Steps:**
1. 10 users simultaneously back same project
2. Monitor for race conditions

**Expected Result:**
- ✅ All 10 transactions succeed
- ✅ Backer count increments correctly (10 total)
- ✅ Funded amount = $10
- ✅ No duplicate backer records
- ✅ All transactions visible on blockchain

### Test 28: Large Project List

**Steps:**
1. Navigate to `/discover` with 100+ projects
2. Scroll through list
3. Filter by category
4. Search for project

**Expected Result:**
- ✅ Initial load shows first 20 projects
- ✅ Infinite scroll loads more on scroll
- ✅ No lag or freezing
- ✅ Filters apply instantly
- ✅ Search debounced (300ms delay)

---

## Known Issues

### Current Limitations

1. **One Backing Per Wallet** (By Design)
   - Each wallet can only back a project once
   - **Workaround:** Use multiple wallets to back more

2. **No Milestone Auto-Release** (Requires Admin)
   - Milestones need manual admin approval
   - **Future:** Community voting for approval

3. **No Refund Button** (Manual Process)
   - Failed projects require admin to process refunds
   - **Future:** Automatic refunds if deadline passes without goal met

4. **No Edit After Submission** (Blockchain Immutable)
   - Cannot edit project details after blockchain initialization
   - **Workaround:** Contact admin to reject and resubmit

5. **Testnet Only** (Not Production Ready)
   - Currently on SOON Testnet
   - Real money NOT at risk
   - **Future:** Mainnet launch Q4 2025

### Reported Bugs (In Progress)

- [ ] Confetti animation doesn't play on some mobile browsers (iOS Safari)
- [ ] Transaction modal sometimes doesn't auto-close after success
- [ ] Admin queue filter "All" doesn't show rejected projects
- [ ] Portfolio page doesn't update immediately after backing (needs refresh)

---

## Test Checklist

Copy this checklist for each testing session:

### Creator Tests
- [ ] Submit project (happy path)
- [ ] Submit with validation errors
- [ ] View submitted project in queue
- [ ] Complete milestone and submit proof
- [ ] Withdraw milestone funds

### Backer Tests
- [ ] Connect wallet
- [ ] Get test USDC from faucet
- [ ] Back active project
- [ ] View backed projects in portfolio
- [ ] Verify transaction on blockchain explorer

### Admin Tests
- [ ] Access admin dashboard
- [ ] Approve project from queue
- [ ] Reject project with reason
- [ ] Approve milestone completion
- [ ] View analytics dashboard
- [ ] Manage users

### Mobile Tests
- [ ] Navigation works on mobile
- [ ] Wallet connection on mobile
- [ ] Submit project on mobile
- [ ] Back project on mobile
- [ ] Confetti displays on mobile

### Edge Cases
- [ ] Network disconnection handling
- [ ] Insufficient funds error
- [ ] Double backing prevention
- [ ] Browser back button during transaction
- [ ] Multiple tabs consistency

---

## Reporting Issues

When you find a bug, report it with:

1. **Title:** Short description (e.g., "Confetti doesn't play on iOS Safari")
2. **Steps to Reproduce:** Exact steps to trigger the bug
3. **Expected Result:** What should happen
4. **Actual Result:** What actually happened
5. **Environment:** 
   - Browser + version
   - Device (desktop/mobile/tablet)
   - Wallet used (Phantom/Backpack)
   - Network (SOON Testnet)
6. **Screenshots/Videos:** If visual bug
7. **Console Errors:** Open DevTools → Console, copy errors

**Submit issues to:** GitHub Issues or Discord #bugs channel

---

## Success Criteria

A release is ready for production when:

- ✅ All Creator Flow tests pass
- ✅ All Backer Flow tests pass
- ✅ All Admin Flow tests pass
- ✅ Mobile tests pass on iOS + Android
- ✅ No critical bugs in edge cases
- ✅ Performance metrics met (< 3s load time)
- ✅ Zero blockchain transaction failures (100% success rate)
- ✅ Smart contracts audited by security firm
- ✅ 100+ successful test transactions on testnet

---

**Happy Testing! 🚀**
