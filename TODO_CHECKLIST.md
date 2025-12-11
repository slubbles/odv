# OneDollarVentures - Implementation Checklist

**Created**: December 11, 2025
**Status**: 1/8 tasks complete

---

## ✅ COMPLETED

### 1. Fix Discover Page - Database Connection
**Status**: ✅ COMPLETED  
**Issue**: Projects not appearing on /discover page  
**Root Cause**: `.env.local` file missing - Supabase not configured  
**Solution**:
```bash
# Step 1: Create environment file
cp .env.local.example .env.local

# Step 2: Get credentials from Supabase Dashboard
# URL: https://zsfujmvltpumleszcrwh.supabase.co/project/_/settings/api

# Step 3: Update .env.local with real credentials
# NEXT_PUBLIC_SUPABASE_URL=https://zsfujmvltpumleszcrwh.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_key_here>

# Step 4: Restart dev server
pnpm dev
```
**Reference**: See `SUPABASE_SETUP_REQUIRED.md`

---

## 🔄 IN PROGRESS

### 2. Remove Analytics from /discover Page
**File**: `src/app/discover/page.tsx` (lines 147-185)  
**Action**: Delete the entire Stats Section:
- "1,247 projects currently building"
- "892 made it"  
- "156 almost there (hours left)"

**Reason**: Design system emphasizes content over vanity metrics

---

## 📋 TODO

### 3. Update Navbar - Explore Dropdown
**File**: `src/components/header.tsx`  
**Action**: Remove "Discover Projects" link from Explore dropdown  
**Reason**: Redundant - already in main navigation

---

### 4. Rename "Creator Dashboard" in Navbar
**File**: `src/components/header.tsx`  
**Action**: Change "Creator Dashboard" → "Your Projects"  
**Location**: Launch a Project dropdown menu  
**Reason**: More direct, action-oriented language per design system

---

### 5. Fix Date Picker on Mobile - /submit Page
**File**: `src/app/submit/page.tsx`  
**Issue**: Date selection not functional on mobile devices  
**Investigation needed**:
- Check date input component responsiveness
- Test on mobile viewports (375px, 414px, 768px)
- Verify date picker library mobile support
- Consider native `<input type="date">` fallback

---

### 6. Unify Admin Controls - Tabbed Interface
**File**: `src/app/admin/page.tsx`  
**Current State**: Multiple admin pages/scattered controls  
**Target State**: Single `/admin` page with tabs:

**Tab 1: Project Approvals**
- List pending projects
- Approve/reject actions
- Bulk operations

**Tab 2: Project Initialization**
- Initialize approved projects on blockchain
- View initialization status
- Retry failed initializations

**Tab 3: Admin Settings**
- Platform configuration
- User management
- System settings

**Implementation**:
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="approvals">
  <TabsList>
    <TabsTrigger value="approvals">Approvals</TabsTrigger>
    <TabsTrigger value="initialize">Initialize</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="approvals">{/* ... */}</TabsContent>
  <TabsContent value="initialize">{/* ... */}</TabsContent>
  <TabsContent value="settings">{/* ... */}</TabsContent>
</Tabs>
```

---

### 7. Create Dedicated Analytics Tab (Admin Only)
**File**: `src/app/admin/page.tsx`  
**Action**: Add 4th tab to admin interface  

**Tab 4: Analytics**
- **User Analytics**: Total users, active users, user growth
- **Action/Events Tracking**: Project submissions, backings, completions
- **Platform Metrics**: Total raised, success rate, average backing time
- **Project Performance**: Top projects, category breakdown, funding velocity

**Data Sources**:
- Supabase `projects`, `backings`, `users` tables
- Blockchain data from SOON Network
- Real-time calculations

**IMPORTANT**: Remove analytics from ALL other pages:
- Remove stats from `/discover` (see task #2)
- Remove stats from `/dashboard`
- Remove stats from homepage (if any)
- **Only** admin can see analytics

---

### 8. Add Admin Settings Configuration
**File**: `src/app/admin/page.tsx` (Settings tab)  
**Suggested Settings**:

**Platform Configuration**:
- Platform fee percentage
- Minimum/maximum funding goals
- Campaign duration limits
- Backing amount ($1 fixed or configurable?)

**User Management**:
- Ban/unban users
- View user profiles
- Moderation controls

**Approval Workflows**:
- Auto-approve criteria
- Review checklist customization
- Notification preferences

**Blockchain Settings** (View only, set via env):
- SOON RPC endpoint
- Program ID
- Admin wallet address

**Notification Settings**:
- Email notification toggles
- Discord webhook integration
- Slack integration

**Implementation Approach**:
1. Create `admin_settings` table in Supabase
2. Build settings form with validation
3. Add save/reset functionality
4. Show current vs default values
5. Add audit log for setting changes

---

## Testing Checklist

After completing tasks, test:

- [ ] Hard refresh discover page - projects appear
- [ ] Mobile view: date picker functional
- [ ] Admin tabs: all navigable and functional
- [ ] Analytics: only visible to admin
- [ ] Navbar: updated text/removed links
- [ ] Responsive: test on mobile, tablet, desktop

---

## Files to Modify

Priority order:
1. `.env.local` - Create with Supabase credentials ✅
2. `src/app/discover/page.tsx` - Remove stats section
3. `src/components/header.tsx` - Update navbar
4. `src/app/submit/page.tsx` - Fix date picker
5. `src/app/admin/page.tsx` - Complete rewrite with tabs
6. Create: `src/components/admin/analytics-dashboard.tsx`
7. Create: `src/components/admin/admin-settings.tsx`

---

## Design System Adherence

All changes follow `DESIGN_SYSTEM.md`:
- **Direct language**: "Your Projects" not "Creator Dashboard"
- **Action-oriented**: Focus on what users DO
- **Minimal**: Remove unnecessary metrics from public pages
- **Builder-first**: Admin tools empower platform management

