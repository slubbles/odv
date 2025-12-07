# 🧪 ODV Manual Testing Guide

This guide provides step-by-step instructions to manually verify all core user flows of the OneDollarVentures platform.

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
| 1.1 | Go to http://localhost:3000 | Homepage loads with hero section | ☐ |
| 1.2 | Click "Discover Projects" or go to `/discover` | Project listing page loads | ☐ |
| 1.3 | Use search bar, type "test" | Search filters projects (or shows "no results") | ☐ |
| 1.4 | Click category filter (e.g., "Technology") | Projects filter by category | ☐ |
| 1.5 | Click sort dropdown, select "Newest" | Projects reorder | ☐ |
| 1.6 | Click any project card | Project detail page loads at `/project/[id]` | ☐ |
| 1.7 | On project page, view tabs: Story, Milestones, Updates, Comments | All tabs render content | ☐ |
| 1.8 | Click "Fund This Project" button | Prompts to connect wallet | ☐ |
| 1.9 | Go to `/creators` | Creators listing page loads | ☐ |
| 1.10 | Go to `/how-it-works` | How it works page loads | ☐ |
| 1.11 | Go to `/about` | About page loads | ☐ |
| 1.12 | Go to `/help` | Help center loads | ☐ |
| 1.13 | Go to `/faucet` | Faucet page loads (shows connect prompt) | ☐ |

---

## 🧪 TEST 2: Backer Flow (Fund a Project)

**Goal:** Complete the full funding journey

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

### 2B: Fund a Project

| # | Action | Expected Result | ✓ |
|---|--------|-----------------|---|
| 2.11 | Go to `/discover` | See list of projects | ☐ |
| 2.12 | Click an **Active** project | Project detail page | ☐ |
| 2.13 | Click "Fund This Project ($1)" | Wallet popup opens | ☐ |
| 2.14 | Review transaction (1 USDC) | Shows correct amount | ☐ |
| 2.15 | Click "Approve" in wallet | Transaction processing | ☐ |
| 2.16 | Wait for confirmation | Success toast notification | ☐ |
| 2.17 | Button changes to "Already Funded ✓" | Cannot fund twice | ☐ |

### 2C: Verify Portfolio

| # | Action | Expected Result | ✓ |
|---|--------|-----------------|---|
| 2.18 | Go to "Fund Projects" -> "Funded Projects" | Funded project appears in list | ☐ |
| 2.19 | Go to "Fund Projects" -> "Backer Dashboard" | Stats updated (Total Spent: $1) | ☐ |

---

## 🧪 TEST 3: Creator Flow (Submit Project)

**Goal:** Create a new project

| # | Action | Expected Result | ✓ |
|---|--------|-----------------|---|
| 3.1 | Click "Launch a Project" -> "Start a Project" | Submission wizard loads | ☐ |
| 3.2 | Step 1: Basic Info | Fill title, tagline, category | ☐ |
| 3.3 | Step 2: Story | Fill description, problem, solution | ☐ |
| 3.4 | Step 3: Media | Add image URL (use placeholder) | ☐ |
| 3.5 | Step 4: Milestones | Add at least 2 milestones | ☐ |
| 3.6 | Review & Submit | Summary page loads | ☐ |
| 3.7 | Click "Submit for Review" | Success message | ☐ |
| 3.8 | Go to "Launch a Project" -> "Creator Dashboard" | Project shows as "Pending" | ☐ |

---

## 🧪 TEST 4: Admin Flow (Review Project)

**Note:** Requires Admin Wallet (`4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw`)

| # | Action | Expected Result | ✓ |
|---|--------|-----------------|---|
| 4.1 | Connect Admin Wallet | "Admin" menu appears in header | ☐ |
| 4.2 | Go to `/admin` | Queue review page loads | ☐ |
| 4.3 | Find pending project | Project from Test 3 appears | ☐ |
| 4.4 | Click "Review" | Review modal opens | ☐ |
| 4.5 | Click "Approve" | Success message | ☐ |
| 4.6 | Go to `/discover` | Project now appears as "Active" | ☐ |

---

## 🧪 TEST 5: Mobile Responsiveness

**Goal:** Verify UI on mobile screens

| # | Action | Expected Result | ✓ |
|---|--------|-----------------|---|
| 5.1 | Resize browser to mobile width | Mobile layout activates | ☐ |
| 5.2 | Check Header | Hamburger menu appears | ☐ |
| 5.3 | Open Mobile Menu | Menu slides in with subheaders | ☐ |
| 5.4 | Check Project Cards | Cards stack vertically | ☐ |
| 5.5 | Check "Fund" button | Visible and clickable on mobile | ☐ |
