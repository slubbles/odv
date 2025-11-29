# 🧪 ODV Platform - Complete Testing Guide

## ✅ Issues Fixed

1. **Seed Script Error**: Changed `github_username` → `github_handle` to match schema
2. **Wallet Button Styling**: Restored custom red accent color with CSS override

---

## 📋 Step-by-Step Testing Instructions

### **Step 1: Load Seed Data into Supabase**

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project: `OneDollarVentures`

2. **Navigate to SQL Editor**
   - Click **"SQL Editor"** in left sidebar
   - Click **"New query"** button

3. **Copy & Run Seed Script**
   - Open: `/workspaces/odv/src/lib/supabase/seed.sql`
   - Select ALL content (Ctrl+A)
   - Copy (Ctrl+C)
   - Paste into Supabase SQL Editor
   - Click **"Run"** button (or press F5)

4. **Verify Success**
   - You should see at bottom:
     ```
     users: 10
     projects: 12
     milestones: 27
     backers: 30+
     updates: 10
     follows: 7
     notifications: 4
     activity_entries: 7
     ```
   - If you see an error, tables might already exist - that's okay!

---

### **Step 2: Access Your App**

Your dev server is running on **port 3000**.

1. **Open Browser**
   - Go to: http://localhost:3000
   - Or use the "Simple Browser" in VS Code:
     - Press `Ctrl+Shift+P`
     - Type "Simple Browser"
     - Enter: http://localhost:3000

---

### **Step 3: Test Homepage (No Wallet Needed)**

#### What to Check:
- ✅ **3D Background**: Animated cubes, sphere, torus rotating
- ✅ **Hero Text**: "Shark Tank if sharks were $1"
- ✅ **Stats Counter**: Shows "1,247" projects, "$2.0M" raised, "47,000+" builders
- ✅ **Featured Projects Section**: Should show 6 project cards
  - DeFi Dashboard Pro
  - Carbon Credit NFT Marketplace
  - Pixels & Potions
  - MetaArcade
  - Solar Microgrids
  - DecentralChat

#### How to Test:
1. Page loads in ~2-3 seconds
2. Scroll down - projects should have:
   - Images from Unsplash
   - Progress bars showing funding %
   - "Active" badges
   - Backer counts (289, 412, 567, etc.)
3. Check browser console (F12) - **should be NO errors**

---

### **Step 4: Test Wallet Button (Custom Red Styling)**

#### What to Check:
- ✅ **Button Color**: Red/orange accent color (not default purple)
- ✅ **Button Text**: "Select Wallet"
- ✅ **Button Position**: Top right corner, next to notification bell

#### How to Test:
1. **Look at top-right header**
   - Button should be RED/ORANGE (your accent color)
   - NOT purple (Solana's default)

2. **Click "Select Wallet" button**
   - Modal opens with wallet options:
     - Phantom (if installed)
     - Solflare (if installed)
     - More...
   - If no wallets installed, see "Install a Wallet" message

3. **Install Phantom (if needed)**
   - Go to: https://phantom.app
   - Click "Download"
   - Add to Chrome/Edge
   - Create new wallet or import existing
   - **IMPORTANT**: Switch to Devnet in Phantom settings

4. **Connect Wallet**
   - Click "Select Wallet" again
   - Click "Phantom"
   - Approve connection in popup
   - Button changes to show your wallet address (e.g., "ABC1...XYZ9")
   - Button STAYS RED (not purple)

5. **Verify Connected State**
   - Button shows truncated address
   - Click button → dropdown appears with "Disconnect"
   - Button remains RED even when connected

---

### **Step 5: Test Browse Without Wallet**

#### Test Discover Page:
1. **Navigate**: Click "Explore" → "Discover" in header
2. **What You Should See**:
   - Grid of 12 projects
   - Filter dropdown (Technology, Gaming, Social Impact, etc.)
   - Search bar at top
3. **Try Search**:
   - Type "DeFi" → should show DeFi Dashboard Pro
   - Type "Carbon" → should show Carbon Credit NFT
   - Clear search → see all projects again
4. **Try Filter**:
   - Select "Gaming" → should show only Pixels & Potions, MetaArcade
   - Select "Social Impact" → 4 projects
   - Select "All" → 12 projects

#### Test Project Details:
1. **Click any project card** (e.g., "DeFi Dashboard Pro")
2. **What You Should See**:
   - Project title and tagline
   - Creator info: Sarah Chen (avatar, bio, social links)
   - Progress bar: $12,847 / $15,000 (85%)
   - Backer count: 289 backers
   - Deadline: "5 days left"
   - **3 Milestones**:
     - ✅ MVP with 5 wallet integrations (Completed)
     - 🔄 NFT tracking + gas optimizer (Active)
     - ⏳ Tax reporting + mobile app (Pending)
   - **Updates Feed**: 2 updates
     - "MVP is Live! 🎉"
     - "NFT Module in Testing"
   - **Backer Avatars**: 5 visible

3. **WITHOUT Wallet Connected**:
   - "Back This Project" button shows: **"Connect Wallet to Back"**
   - Button is DISABLED
   - This is CORRECT behavior!

---

### **Step 6: Test Creating Project (Requires Wallet)**

1. **Navigate**: Click "Submit Project" in header

2. **WITHOUT Wallet**:
   - Fill out form steps 1-3
   - Step 4 shows yellow warning:
     - ⚠️ "Wallet not connected"
     - "Please connect your wallet to submit the project"
   - Submit button is DISABLED

3. **WITH Wallet Connected**:
   - Connect wallet first (top-right button)
   - Go to `/submit` again
   - Fill out form:
     - **Step 1**: Title, category, tagline
     - **Step 2**: Description
     - **Step 3**: Goal ($5000), Duration (30 days), Add 2 milestones (totaling 100%)
     - **Step 4**: Review summary
   - Submit button is ENABLED
   - Click "Submit Project"
   - Should see success toast
   - Redirects to Creator Dashboard

---

### **Step 7: Test API Endpoints**

Open a terminal and test:

```bash
# 1. Get all active projects (should return 8 projects)
curl -s http://localhost:3000/api/projects?status=active | jq '.projects | length'
# Expected: 8

# 2. Get specific project
curl -s http://localhost:3000/api/projects/aaaaaaaa-aaaa-aaaa-aaaa-000000000001 | jq '.project.title'
# Expected: "DeFi Dashboard Pro"

# 3. Get project with milestones
curl -s http://localhost:3000/api/projects/aaaaaaaa-aaaa-aaaa-aaaa-000000000001 | jq '.project.milestones | length'
# Expected: 3

# 4. Get trending projects
curl -s http://localhost:3000/api/projects?status=active&sort=trending&limit=6 | jq '.projects | length'
# Expected: 6

# 5. Get featured project
curl -s http://localhost:3000/api/projects/featured | jq '.project.title'
# Expected: "Pixels & Potions" (highest funding %)
```

---

### **Step 8: Test Responsive Design**

1. **Open DevTools**: Press F12
2. **Toggle Device Toolbar**: Press Ctrl+Shift+M (or click phone icon)
3. **Test Sizes**:
   - **Mobile (375px)**:
     - Bottom navigation appears
     - Wallet button HIDDEN on mobile
     - Project cards stack vertically
   - **Tablet (768px)**:
     - Projects show in 2 columns
     - Wallet button visible
   - **Desktop (1440px)**:
     - Projects show in 3 columns
     - Full navigation

---

### **Step 9: Verify Console is Clean**

1. **Open Browser Console**: Press F12 → Console tab
2. **Should NOT See**:
   - ❌ "oklch" color errors
   - ❌ 500 API errors
   - ❌ "ENOTFOUND placeholder.supabase.co"
   - ❌ MaxListenersExceeded warnings
3. **Okay to See**:
   - ⚠️ "pino-pretty" warning (optional dependency, doesn't affect functionality)

---

## ✅ Success Checklist

Copy this and check off as you test:

```
SEED DATA:
□ Ran seed.sql in Supabase (10 users, 12 projects created)

HOMEPAGE:
□ 3D background animation renders
□ Featured projects show (6 cards)
□ Stats counter displays correct numbers

WALLET BUTTON:
□ Button is RED/ORANGE (not purple)
□ "Select Wallet" text visible
□ Click opens modal
□ Can connect Phantom
□ Button shows wallet address when connected
□ Button STAYS RED when connected
□ Disconnect works

BROWSING (WITHOUT WALLET):
□ Can view /discover page
□ Can filter by category
□ Can search projects
□ Can click project cards
□ Can view project details
□ Can see milestones, updates, backers
□ "Back This Project" shows "Connect Wallet to Back"

CREATING PROJECT (WITH WALLET):
□ /submit form accessible
□ Without wallet: warning shows, submit disabled
□ With wallet: submit enabled
□ Can fill 4-step form
□ Can add milestones
□ Submit succeeds

API TESTS:
□ /api/projects returns 8 active projects
□ /api/projects/[id] returns project details
□ Projects have milestones array
□ Projects have creators with profiles

RESPONSIVE:
□ Mobile view works (bottom nav)
□ Tablet view works (2 columns)
□ Desktop view works (3 columns)

NO ERRORS:
□ Console is clean (no red errors)
□ Network tab shows all 200 responses
```

---

## 🐛 Troubleshooting

### Problem: Wallet button is still purple

**Solution:**
```bash
# Clear browser cache
# In Chrome/Edge: Ctrl+Shift+Delete → Cached images → Clear

# Hard refresh page
# Press: Ctrl+Shift+R
```

### Problem: No projects showing

**Check Supabase:**
```sql
-- In Supabase SQL Editor:
SELECT title, status FROM projects;
-- Should show 12 projects
```

### Problem: Seed script error "relation already exists"

**Solution:**
```sql
-- Drop and recreate:
TRUNCATE TABLE project_updates, backers, milestones, projects, users CASCADE;
-- Then run seed script again
```

### Problem: Port 3003 not working

**Check server status:**
```bash
# In terminal:
ps aux | grep "next dev"

# If not running, start it:
cd /workspaces/odv
npm run dev
```

---

## 🎉 You're Done!

If all checkboxes are checked, your ODV platform is fully functional:

✅ Database populated with realistic data
✅ Wallet button works with custom RED styling
✅ Browse-first UX (no wallet needed to explore)
✅ Wallet required only for transactions
✅ All pages loading correctly
✅ API endpoints returning data
✅ Console is clean

**Next Steps:**
1. Deploy Solana program to devnet
2. Wire up real transactions
3. Add image upload functionality
4. Implement search/filter backend logic

---

## 🔗 Quick Links

- **App**: http://localhost:3000
- **Supabase**: https://supabase.com/dashboard
- **Phantom Wallet**: https://phantom.app
- **Solana Devnet Faucet**: https://faucet.solana.com

---

**Need Help?** Check the console (F12) for error messages and verify:
1. Supabase credentials in `.env.local`
2. Dev server running on port 3003
3. Seed data loaded successfully
