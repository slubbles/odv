# ODV Platform Testing Guide

## ✅ Fixes Applied

### 1. **Wallet Connection Button - FIXED**
- ✅ Replaced static button with `WalletMultiButton` from Solana wallet adapter
- ✅ Now functional - opens wallet selection modal
- ✅ Shows connected wallet address when connected
- ✅ Auto-detects Phantom and Solflare wallets

### 2. **Authentication Flow - Browse-First Approach**

We've implemented **Option 1: Browse-First** (like Kickstarter):

```
✓ Browse projects (NO wallet required)
✓ View details (NO wallet required) 
✓ Search & discover (NO wallet required)
✓ Read updates (NO wallet required)

✗ Back a project → Wallet required
✗ Create project → Wallet required
✗ Post updates → Wallet required
```

**Why this approach?**
- Lower barrier to entry
- Better SEO (Google can crawl content)
- Users explore before committing
- Industry standard for crowdfunding

---

## 🧪 Testing Steps

### Step 1: Load Seed Data

**In Supabase SQL Editor:**

```sql
-- Run the seed script
-- File: src/lib/supabase/seed.sql
```

This adds:
- 10 users (5 creators, 5 backers)
- 12 projects (varied stages: active, funded, draft)
- 27 milestones
- 30+ backing transactions
- Project updates, follows, notifications

**Or copy-paste from:** `/workspaces/odv/src/lib/supabase/seed.sql`

---

### Step 2: Start Dev Server

```bash
cd /workspaces/odv
npm run dev
```

Server runs at: `http://localhost:3000`

---

### Step 3: Test Without Wallet (Browse-First)

#### Homepage (`/`)
- ✅ 3D background animation
- ✅ Featured projects carousel
- ✅ Stats counter (should show real numbers now)
- ✅ Navigation works

#### Discover Page (`/discover`)
- ✅ Grid of active projects
- ✅ Filter by category dropdown
- ✅ Search bar (enter "DeFi" or "Carbon")
- ✅ Project cards clickable

#### Project Details (`/project/[id]`)
Click any project card:
- ✅ Project description, images, video
- ✅ Funding progress bar
- ✅ Milestones list
- ✅ Updates feed
- ✅ Backer avatars
- ❌ "Back This Project" button shows "Connect Wallet to Back" (correct!)

#### Browse Other Pages
- `/creators` - List of creators
- `/stats` - Platform statistics
- `/about` - About page
- `/how-it-works` - How it works

**All should work WITHOUT wallet connection.**

---

### Step 4: Test Wallet Connection

#### Install Wallet Extension
Choose one:
- **Phantom**: https://phantom.app (recommended for Solana)
- **Solflare**: https://solflare.com

#### Connect Wallet
1. Click "Connect Wallet" button (top right)
2. Modal opens with wallet options
3. Select your wallet
4. Approve connection
5. Button changes to show your wallet address (truncated)

#### Verify Connection
- Header shows: `ABC...XYZ` (your wallet address)
- Clicking shows dropdown: Disconnect option

---

### Step 5: Test Creating a Project (Requires Wallet)

1. **Connect wallet first**
2. Navigate to `/submit`
3. Fill out the 4-step form:
   - **Step 1**: Title, category, tagline, image URL
   - **Step 2**: Description, video URL (optional)
   - **Step 3**: Funding goal, duration, milestones
   - **Step 4**: Review and submit

4. Click "Submit Project"
5. Should see success toast
6. Redirects to `/dashboard/creator`

**Without wallet:** Submit button is disabled with warning message.

---

### Step 6: Test Backing a Project (Requires Wallet)

#### Get Devnet SOL (Required for Transactions)

In terminal:
```bash
# Replace YOUR_WALLET_ADDRESS with your actual address from Phantom
solana airdrop 2 YOUR_WALLET_ADDRESS --url https://api.devnet.solana.com
```

Or use Phantom's built-in airdrop:
1. Switch to Devnet in settings
2. Click "Receive" → "Airdrop"

#### Back a Project
1. Go to any active project (e.g., "DeFi Dashboard Pro")
2. Click "Back This Project" button
3. Wallet popup appears requesting approval
4. Approve transaction
5. Success toast appears
6. Button changes to "Already Backed" (with checkmark)

**Without wallet:** Button shows "Connect Wallet to Back" and is disabled.

---

### Step 7: Test Dashboard Pages

#### Backer Dashboard (`/dashboard/backer`)
**Requires wallet connection**
- Shows projects you've backed
- Investment summary
- Activity history

#### Creator Dashboard (`/dashboard/creator`)
**Requires wallet connection**
- Shows projects you've created
- Funding stats
- Milestone management

**Without wallet:** Redirects or shows empty state.

---

### Step 8: Test API Endpoints

```bash
# Projects list (should return 12 projects)
curl http://localhost:3000/api/projects?status=active

# Specific project
curl http://localhost:3000/api/projects/aaaaaaaa-aaaa-aaaa-aaaa-000000000001

# Categories
curl http://localhost:3000/api/projects/categories

# Featured project
curl http://localhost:3000/api/projects/featured

# Project stats
curl http://localhost:3000/api/projects/aaaaaaaa-aaaa-aaaa-aaaa-000000000001/stats
```

All should return JSON with real data (not empty arrays).

---

## ✅ Expected Results

### Working Features
- ✅ Homepage loads with real projects
- ✅ Discover page shows 12 projects
- ✅ Project cards display correctly
- ✅ Wallet connection button works
- ✅ Browse all pages without wallet
- ✅ Submit form requires wallet
- ✅ Back button requires wallet
- ✅ Project details show milestones, updates, backers

### Known Limitations (Not Bugs)
- 🔶 Solana program not deployed (transactions use placeholder)
- 🔶 Some API routes not implemented yet
- 🔶 Image uploads not configured (using URLs)
- 🔶 Real-time notifications not working yet

---

## 🐛 What to Check For

### Console Errors (Should be NONE)
Open DevTools (F12) → Console tab:
- ❌ No "oklch" color errors
- ❌ No "MaxListenersExceeded" warnings
- ❌ No 500 API errors
- ❌ No Supabase connection errors

### Network Tab
Check API responses:
- ✅ All `/api/*` routes return 200 status
- ✅ JSON responses have data (not empty)
- ✅ Supabase queries succeed

### Browser Compatibility
Test in:
- Chrome/Edge (Chromium)
- Firefox
- Safari (if available)

### Responsive Design
Toggle device toolbar (Ctrl+Shift+M):
- Mobile (375px) - Bottom nav appears
- Tablet (768px)
- Desktop (1440px)

---

## 🚀 Next Steps (Future)

### Still TODO:
1. **Deploy Solana Program**
   - Build Anchor program (`/anchor/programs/odv_escrow`)
   - Deploy to devnet
   - Update `NEXT_PUBLIC_ODV_PROGRAM_ID` in `.env.local`
   - Wire up real transactions

2. **Implement Missing API Routes**
   - `/api/users/[wallet]` - User profiles
   - `/api/notifications` - Notifications
   - `/api/search` - Advanced search
   - `/api/activity-feed` - Global activity

3. **Add Storage Buckets (Supabase)**
   - `project-images` (public)
   - `milestone-proofs` (public)
   - `user-avatars` (public)

4. **Real-time Features**
   - Live funding updates
   - Notification bell live updates
   - Activity feed realtime

---

## 🎯 Testing Checklist

Copy this for your testing:

```
□ Seed data loaded in Supabase
□ Dev server running on localhost:3000
□ Homepage loads without errors
□ Can browse projects WITHOUT wallet
□ Wallet button opens modal
□ Can connect Phantom/Solflare
□ Button shows wallet address when connected
□ Can view project details
□ "Back" button requires wallet (correct)
□ Can access /submit page
□ Submit form requires wallet (correct)
□ Project cards show real data
□ Milestones display correctly
□ No console errors
□ API returns 200 status codes
□ Mobile view works (bottom nav)
```

---

## 📞 Troubleshooting

### Wallet button still not working?
```bash
# Restart dev server
pkill -f "next dev"
npm run dev
```

### Projects not showing?
Check Supabase SQL Editor:
```sql
SELECT COUNT(*) FROM projects WHERE status = 'active';
-- Should return: 8
```

### API errors?
Verify `.env.local`:
```bash
cat .env.local | grep SUPABASE
```

### Clear Next.js cache
```bash
rm -rf .next
npm run dev
```

---

## 🎉 Success Criteria

Your platform is working correctly if:

1. ✅ You can browse projects without connecting wallet
2. ✅ Wallet button opens modal and connects successfully
3. ✅ Create/Back features require wallet (and show warnings without it)
4. ✅ All pages load without errors
5. ✅ API returns real data from seed script
6. ✅ Console is clean (no errors)

**This is the industry-standard flow for web3 crowdfunding platforms!** 🚀
