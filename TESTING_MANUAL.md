# 🧪 ODV Manual Testing Guide

Step-by-step instructions to test all user flows on the platform.

---

## 📋 Pre-requisites

### 1. Start the Development Server
```bash
cd /workspaces/odv
pnpm install
pnpm dev
```
Open http://localhost:3000 in your browser.

### 2. Install Wallet Extension
- **Phantom**: https://phantom.app/download
- **Solflare**: https://solflare.com/download

### 3. Configure Wallet for SOON Testnet

**For Phantom:**
1. Open Phantom → Settings (gear icon)
2. Developer Settings → Enable "Testnet Mode"
3. Change Network → Add Custom RPC
4. Enter:
   - Name: `SOON Testnet`
   - RPC URL: `https://rpc.testnet.soo.network/rpc`
5. Save and select SOON Testnet

**For Solflare:**
1. Open Solflare → Settings
2. Network → Custom RPC
3. Enter:
   - Name: `SOON Testnet`
   - RPC: `https://rpc.testnet.soo.network/rpc`
4. Save and connect

---

## 🧪 TEST 1: Visitor Flow (No Wallet)

**Goal:** Verify public pages work without wallet connection

### Steps:

| # | Action | Expected Result | ✓ |
|---|--------|-----------------|---|
| 1.1 | Go to http://localhost:3000 | Homepage loads with hero section | ☐ | YES BUT THE 3D ANIMATION BG LOADS SLOW
| 1.2 | Click "Discover Projects" or go to `/discover` | Project listing page loads | ☐ |
| 1.3 | Use search bar, type "test" | Search filters projects (or shows "no results") | ☐ |
| 1.4 | Click category filter (e.g., "Technology") | Projects filter by category | ☐ |
| 1.5 | Click sort dropdown, select "Newest" | Projects reorder | ☐ |
| 1.6 | Click any project card | Project detail page loads at `/project/[id]` | ☐ |
| 1.7 | On project page, view tabs: Story, Milestones, Updates, Comments | All tabs render content | ☐ |
| 1.8 | Click "Back This Project" button | Prompts to connect wallet | ☐ |
| 1.9 | Go to `/creators` | Creators listing page loads | ☐ |
| 1.10 | Go to `/how-it-works` | How it works page loads | ☐ |
| 1.11 | Go to `/about` | About page loads | ☐ |
| 1.12 | Go to `/help` | Help center loads | ☐ |
| 1.13 | Go to `/faucet` | Faucet page loads (shows connect prompt) | ☐ |

---

## 🧪 TEST 2: Backer Flow

**Goal:** Complete the full backer journey

### 2A: Wallet Setup & Faucet

| # | Action | Expected Result | ✓ |
|---|--------|-----------------|---|
| 2.1 | Click "Connect Wallet" in header | Wallet modal opens | ☐ |
| 2.2 | Select Phantom/Solflare | Wallet popup asks to connect | ☐ |
| 2.3 | Approve connection in wallet | Connected! Address shows in header | ☐ |
| 2.4 | Go to `/faucet` | Your wallet address auto-fills | ☐ |
| 2.5 | Click "Request Test USDC" | Loading state appears | ☐ |
| 2.6 | Wait for transaction | Success message with TX link | ☐ |
| 2.7 | Check wallet | 100 Test USDC received | ☐ |

**If USDC not visible in wallet:**
| # | Action | Expected Result | ✓ |
|---|--------|-----------------|---|
| 2.8 | In wallet, click "Import Token" | Token import dialog | ☐ |
| 2.9 | Paste: `3PNhmxDckddYL24zEfrsHLFLXXvrdzBBoZgfRW8rruDs` | Token found | ☐ |
| 2.10 | Confirm import | USDC now visible in wallet | ☐ |

### 2B: Back a Project

| # | Action | Expected Result | ✓ |
|---|--------|-----------------|---|
| 2.11 | Go to `/discover` | See list of projects | ☐ |
| 2.12 | Click an **Active** project | Project detail page | ☐ |
| 2.13 | Click "Back This Project ($1)" | Wallet popup opens | ☐ |
| 2.14 | Review transaction (1 USDC) | Shows correct amount | ☐ |
| 2.15 | Click "Approve" in wallet | Transaction processing | ☐ |
| 2.16 | Wait for confirmation | Success toast notification | ☐ |
| 2.17 | Button changes to "Already Backed ✓" | Cannot back twice | ☐ |

### 2C: Backer Dashboard

| # | Action | Expected Result | ✓ |
|---|--------|-----------------|---|
| 2.18 | Go to `/dashboard/backer` | Backer dashboard loads | ☐ |
| 2.19 | Check stats cards | Shows "1 bet placed", "$1 spent" | ☐ |
| 2.20 | Click "Still Building" tab | Shows the project you backed | ☐ |
| 2.21 | Click "Made It" tab | Empty or funded projects | ☐ |
| 2.22 | Click "My Proof" tab | Shows NFT badges (if any) | ☐ |
| 2.23 | Click project in list | Navigates to project page | ☐ |

### 2D: Wallet Page

| # | Action | Expected Result | ✓ |
|---|--------|-----------------|---|
| 2.24 | Go to `/wallet` | Wallet page loads | ☐ |
| 2.25 | View balance section | Shows SOL balance | ☐ |
| 2.26 | View transactions tab | Shows backing transactions | ☐ |
| 2.27 | Click copy address button | Address copied to clipboard | ☐ |

---

## 🧪 TEST 3: Creator Flow

**Goal:** Create and manage a project

### 3A: Creator Onboarding

| # | Action | Expected Result | ✓ |
|---|--------|-----------------|---|
| 3.1 | Connect wallet (if not connected) | Wallet connected | ☐ |
| 3.2 | Go to `/onboarding/creator` | Creator onboarding page | ☐ |
| 3.3 | Step 1: Fill profile info | Form accepts input | ☐ |
| 3.4 | Click "Continue" | Moves to Step 2 | ☐ |
| 3.5 | Step 2: Fill experience | Form accepts input | ☐ |
| 3.6 | Click "Continue" | Moves to Step 3 | ☐ |
| 3.7 | Step 3: Verify wallet | Wallet info shown | ☐ |
| 3.8 | Click "Complete" | Moves to Step 4, success | ☐ |

### 3B: Create Project

| # | Action | Expected Result | ✓ |
|---|--------|-----------------|---|
| 3.9 | Go to `/submit` | Project submission form | ☐ |
| 3.10 | **Step 1 - Basic Info:** | | |
| | - Title: "Test Project" | Input accepted | ☐ |
| | - Category: Select any | Dropdown works | ☐ |
| | - Tagline: "A test project" | Input accepted | ☐ |
| | - Image URL: any image URL | Input accepted | ☐ |
| 3.11 | Click "Continue" | Moves to Step 2 | ☐ |
| 3.12 | **Step 2 - Story:** | | |
| | - Description: 50+ chars | Input accepted | ☐ |
| | - Problem: 20+ chars | Input accepted | ☐ |
| | - Solution: 20+ chars | Input accepted | ☐ |
| 3.13 | Click "Continue" | Moves to Step 3 | ☐ |
| 3.14 | **Step 3 - Funding:** | | |
| | - Goal: 100 | Input accepted | ☐ |
| | - Duration: 30 days | Dropdown works | ☐ |
| 3.15 | Click "Continue" | Moves to Step 4 | ☐ |
| 3.16 | **Step 4 - Milestones:** | | |
| | - Click "Add Milestone" | New milestone row | ☐ |
| | - Title: "MVP Launch" | Input accepted | ☐ |
| | - Percentage: 50% | Input accepted | ☐ |
| | - Deadline: Future date | Date picker works | ☐ |
| | - Add second milestone (50%) | Total = 100% | ☐ |
| 3.17 | Click "Submit for Review" | Loading state | ☐ |
| 3.18 | Wait for submission | Success page with project ID | ☐ |

### 3C: Creator Dashboard

| # | Action | Expected Result | ✓ |
|---|--------|-----------------|---|
| 3.19 | Go to `/dashboard/creator` | Creator dashboard loads | ☐ |
| 3.20 | View stats cards | Shows project count | ☐ |
| 3.21 | Click "All Projects" tab | Shows your test project | ☐ |
| 3.22 | Click "In Review" tab | Test project shown here | ☐ |
| 3.23 | Project shows "In Review" badge | Status correct | ☐ |

---

## 🧪 TEST 4: Admin Flow

**Goal:** Review and approve projects/milestones

### ⚠️ Important: Admin Wallet Required
You must use the admin wallet to access admin features:
```
Admin Wallet: 4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw
```

If you don't have the admin private key, you can still view admin pages but cannot approve/reject.

### 4A: Admin Project Review

| # | Action | Expected Result | ✓ |
|---|--------|-----------------|---|
| 4.1 | Connect with admin wallet | Wallet connected | ☐ |
| 4.2 | Go to `/admin` | Admin dashboard loads | ☐ |
| 4.3 | View stats cards | Shows pending, approved, rejected counts | ☐ |
| 4.4 | See project queue | List of pending projects | ☐ |
| 4.5 | Click on a pending project | Expand/view details | ☐ |
| 4.6 | Click "Approve" button | Confirmation dialog (if any) | ☐ |
| 4.7 | Confirm approval | Project status → "Active" | ☐ |
| | **OR** | | |
| 4.6b | Click "Reject" button | Rejection dialog opens | ☐ |
| 4.7b | Enter reason and confirm | Project status → "Rejected" | ☐ |

### 4B: Admin Milestone Review

| # | Action | Expected Result | ✓ |
|---|--------|-----------------|---|
| 4.8 | Go to `/admin/milestones` | Milestones page loads | ☐ |
| 4.9 | View stats | Pending, approved, rejected counts | ☐ |
| 4.10 | Filter by "Pending Review" | Shows milestones awaiting review | ☐ |
| 4.11 | Click a milestone | View proof details | ☐ |
| 4.12 | Click "Approve" | Wallet popup (on-chain tx) | ☐ |
| 4.13 | Sign transaction | Milestone approved | ☐ |
| | **OR** | | |
| 4.12b | Click "Reject" | Rejection dialog | ☐ |
| 4.13b | Sign transaction | Milestone reset to Active | ☐ |

### 4C: Admin User Management

| # | Action | Expected Result | ✓ |
|---|--------|-----------------|---|
| 4.14 | Go to `/admin/users` | Users page loads | ☐ |
| 4.15 | Use search bar | Filters users | ☐ |
| 4.16 | View user list | Shows user stats | ☐ |
| 4.17 | Click "View Profile" on any user | User details shown | ☐ |

---

## 🧪 TEST 5: Complete E2E Flow

**Goal:** Full cycle from project creation to funding

### Preparation
You need **2 wallets**:
- **Wallet A**: Creator
- **Wallet B**: Backer (+ Admin if you have admin key)

### Flow Steps

| # | Wallet | Action | Expected | ✓ |
|---|--------|--------|----------|---|
| 5.1 | A | Create project via `/submit` | Project in review | ☐ |
| 5.2 | Admin | Approve project in `/admin` | Project now "Active" | ☐ |
| 5.3 | B | Get USDC from `/faucet` | 100 USDC received | ☐ |
| 5.4 | B | Back project with $1 | Backing successful | ☐ |
| 5.5 | A | Check `/dashboard/creator` | Shows $1 raised, 1 backer | ☐ |
| 5.6 | B | Check `/dashboard/backer` | Shows backed project | ☐ |
| 5.7 | A | Submit milestone proof (if funded) | Milestone in review | ☐ |
| 5.8 | Admin | Approve milestone | Milestone approved | ☐ |
| 5.9 | A | Release funds | Funds transferred | ☐ |

---

## 🧪 TEST 6: Edge Cases

### 6A: Error Handling

| # | Action | Expected Result | ✓ |
|---|--------|-----------------|---|
| 6.1 | Try backing without enough USDC | Error: "Insufficient funds" | ☐ |
| 6.2 | Try backing same project twice | Error: "Already backed" | ☐ |
| 6.3 | Try backing project "In Review" | Button shows "In Review Queue" | ☐ |
| 6.4 | Reject transaction in wallet | Error: "Transaction rejected" | ☐ |
| 6.5 | Disconnect wallet mid-action | Shows connect prompt | ☐ |

### 6B: Responsive Design

| # | Action | Expected Result | ✓ |
|---|--------|-----------------|---|
| 6.6 | View on mobile (< 768px) | Mobile navigation works | ☐ |
| 6.7 | View on tablet (768-1024px) | Layout adjusts properly | ☐ |
| 6.8 | View on desktop (> 1024px) | Full layout visible | ☐ |

---

## 📝 Test Results Summary

| Test Section | Pass | Fail | Notes |
|--------------|------|------|-------|
| 1. Visitor Flow | /13 | | |
| 2. Backer Flow | /27 | | |
| 3. Creator Flow | /23 | | |
| 4. Admin Flow | /17 | | |
| 5. E2E Flow | /9 | | |
| 6. Edge Cases | /8 | | |
| **TOTAL** | /97 | | |

---

## 🐛 Bug Report Template

If you find issues, document them:

```
### Bug #X
- **Page:** [URL]
- **Steps to reproduce:**
  1. 
  2. 
  3. 
- **Expected:** 
- **Actual:** 
- **Screenshot:** [if applicable]
- **Console errors:** [if any]
```

---

## ✅ Testing Complete Checklist

- [ ] All visitor pages load correctly
- [ ] Wallet connects successfully  
- [ ] Faucet dispenses test USDC
- [ ] Project backing works end-to-end
- [ ] Project creation submits to queue
- [ ] Admin can approve/reject projects
- [ ] Admin can approve/reject milestones
- [ ] Dashboards show correct data
- [ ] Error messages are user-friendly
- [ ] Mobile responsive works

---

*Last Updated: December 2024*
