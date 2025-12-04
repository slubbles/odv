# UI Refinement Plan - OneDollarVentures

**Created:** December 3, 2025  
**Updated:** December 4, 2025  
**Based on:** User feedback from E2E testing session  
**Priority:** Critical before launch  
**Status:** ✅ Phase 1-4 Complete, Phase 5 In Progress

---

## Table of Contents

1. [Issue Summary](#issue-summary)
2. [Priority Classification](#priority-classification)
3. [Detailed Issues & Solutions](#detailed-issues--solutions)
4. [Implementation Plan](#implementation-plan)
5. [Pages to Delete](#pages-to-delete)
6. [New Features Required](#new-features-required)

---

## Issue Summary

| # | Issue | Severity | Category | Status |
|---|-------|----------|----------|--------|
| 1 | Wallet address font inconsistent with design system | Medium | Design System | ⏳ |
| 2 | Milestone deadline needs calendar picker with future-date validation | High | UX/Form | ✅ |
| 3 | Progress stepper text misaligned (Basic Info, Details, Funding, Review) | Medium | UI Bug | ✅ |
| 4 | Milestones should show by default (not require "Add Milestone" click) | High | UX | ✅ |
| 5 | Admin page shows 0 projects despite queue having items | Critical | Bug | ✅ |
| 6 | Navbar dropdowns feel too tight | Low | UI Polish | ✅ |
| 7 | Mock/placeholder data exists in codebase | Critical | Code Quality | ✅ |
| 8 | `/discover` and `/projects` serve same purpose - confusing | High | IA/UX | ✅ |
| 9 | `/projects` page links broken (uses numeric IDs, not UUIDs) | Critical | Bug | ✅ |
| 10 | Unnecessary pages exist - need cleanup | Medium | IA | ✅ |
| 11 | Admin pages not visible in navbar (only admin wallet should see) | High | Navigation/Security | ✅ |
| 12 | `/dashboard/creator` - milestones not shown or interactable | High | Bug | ✅ |
| 13 | `/admin/milestones` is static, no action buttons | High | Bug | ✅ |
| 14 | `/wallet` should be a user profile page | Medium | Feature Change | ⏳ (Keep separate) |
| 15 | Missing sidebar navigation for relevant pages | Medium | Navigation | ✅ |
| 16 | Dashboard needs better investor/backer UX | Medium | UX | ⏳ |

---

## Priority Classification

### 🔴 Critical (Must fix before any testing) - ✅ ALL COMPLETE
1. **Issue #7** - Remove mock/placeholder data ✅
2. **Issue #9** - Fix `/projects` page broken links ✅
3. **Issue #5** - Admin page API returning 500 error ✅

### 🟠 High Priority (Core functionality) - ✅ ALL COMPLETE
4. **Issue #4** - Show milestone form by default
5. **Issue #2** - Calendar picker for milestone dates
6. **Issue #8** - Consolidate `/discover` and `/projects` ✅
7. **Issue #11** - Admin navigation with wallet guard ✅
8. **Issue #12** - Fix creator dashboard milestones ✅
9. **Issue #13** - Make admin milestones page functional ✅

### 🟡 Medium Priority (Polish) - Mostly Complete
10. **Issue #1** - Wallet font consistency ⏳
11. **Issue #3** - Progress stepper alignment ✅
12. **Issue #10** - Delete unnecessary pages ✅
13. **Issue #14** - Transform `/wallet` to profile ⏳ (Keeping separate - wallet has distinct purpose)
14. **Issue #15** - Add sidebar navigation ✅
15. **Issue #16** - Improve backer dashboard ⏳

### 🟢 Low Priority (Nice to have) - Complete
16. **Issue #6** - Navbar dropdown spacing ✅

---

## Detailed Issues & Solutions

### Issue #1: Wallet Address Font Inconsistent

**Problem:** Connected wallet address displays with different font than design system specifies.

**Location:** `src/components/wallet-button.tsx`

**Solution:**
- Use `font-mono` class for wallet addresses as per DESIGN_SYSTEM.md
- Ensure consistent font-family across all wallet address displays

**Code Pattern:**
```tsx
<span className="font-mono text-sm">{truncateAddress(publicKey.toString())}</span>
```

---

### Issue #2: Milestone Deadline Needs Calendar Picker

**Problem:** 
- Current deadline input is plain text (`dd/mm/yyyy`)
- No date picker popup
- No validation for future dates only

**Location:** `src/app/submit/page.tsx`

**Solution:**
1. Replace text input with shadcn Calendar/DatePicker component
2. Add `minDate` constraint to today's date
3. Format display consistently

**Implementation:**
```tsx
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Minimum date = tomorrow
const minDate = new Date()
minDate.setDate(minDate.getDate() + 1)

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">{deadline || "Select date"}</Button>
  </PopoverTrigger>
  <PopoverContent>
    <Calendar
      mode="single"
      selected={deadline}
      onSelect={setDeadline}
      disabled={(date) => date < minDate}
    />
  </PopoverContent>
</Popover>
```

---

### Issue #3: Progress Stepper Text Misaligned

**Problem:** Step labels (Basic Info, Details, Funding, Review) not aligned with circles in progress component.

**Location:** `src/app/submit/page.tsx` - progress stepper component

**Solution:** 
- Center text under each step circle
- Use consistent spacing with `text-center` on labels
- Ensure responsive alignment

---

### Issue #4: Milestones Should Show by Default

**Problem:** User must click "Add Milestone" to see milestone form, but milestones are required.

**Location:** `src/app/submit/page.tsx`

**Solution:**
- Initialize `formData.milestones` with one empty milestone by default
- Show milestone form immediately on Funding step
- Keep "Add Milestone" for additional milestones

**Code:**
```tsx
const [formData, setFormData] = useState({
  // ... other fields
  milestones: [{ title: "", percentage: 0, deadline: "" }] // Start with one
})
```

---

### Issue #5: Admin Page API Returning 500 Error

**Problem:** `/api/admin/projects?status=pending` returns 500 error, causing admin page to show 0 projects.

**Root Cause:** The admin page queries for `status=pending` but database uses `status=queue` for pending projects.

**Location:** 
- `src/app/admin/page.tsx` - sends `status=pending`
- `src/lib/hooks/use-admin-queue.ts` - hook that makes API call
- `src/app/api/admin/projects/route.ts` - API handler

**Solution:**
- Map "pending" to "queue" in API
- Or update admin UI to use "queue" status
- Fix the API error being thrown

---

### Issue #6: Navbar Dropdowns Too Tight

**Problem:** Dropdown menu items feel cramped/tight.

**Location:** `src/components/header.tsx`

**Solution:**
- Add `py-2` padding to DropdownMenuContent
- Add `py-1.5` to DropdownMenuItem
- Increase gap between items

---

### Issue #7: Mock/Placeholder Data in Codebase

**Problem:** Mock database and placeholder data exist, should be removed.

**Locations to clean:**
1. `src/lib/mock-db.ts` - Delete entire file
2. `src/app/api/admin/projects/[id]/route.ts` - Remove mock mode check
3. `src/app/projects/page.tsx` - Uses hardcoded mock data (CRITICAL!)

**Solution:**
1. Delete `src/lib/mock-db.ts`
2. Remove all `isMockMode` conditionals in API routes
3. Refactor `/projects/page.tsx` to use real API data like `/discover/page.tsx`

---

### Issue #8: `/discover` and `/projects` Serve Same Purpose

**Problem:** Two pages for browsing projects creates confusion.

**Analysis:**
- `/discover` - Client-side, uses `useProjects` hook, fetches real data ✅
- `/projects` - Server-side, uses HARDCODED mock data ❌

**Solution:**
- **DELETE `/projects` page entirely**
- Update any links pointing to `/projects` → `/discover`
- `/discover` becomes the single project browsing page

---

### Issue #9: `/projects` Page Links Use Numeric IDs

**Problem:** Project cards link to `/project/1`, `/project/2` etc, but database uses UUIDs.

**Root Cause:** `/projects/page.tsx` uses hardcoded mock data with numeric IDs.

**Solution:** 
- Delete `/projects` page (see Issue #8)
- This eliminates the broken links

---

### Issue #10: Unnecessary Pages to Delete

**Pages to Audit:**

| Page | Purpose | Decision |
|------|---------|----------|
| `/projects` | Duplicate of `/discover` | **DELETE** |
| `/admin/page-old.tsx` | Old admin page backup | **DELETE** |
| `/portfolio/activity` | Placeholder | Audit if functional |
| `/portfolio/following` | Placeholder | Audit if functional |
| `/creators` | Creator directory | Keep if functional |
| `/onboarding/*` | Onboarding flows | Keep but audit |

---

### Issue #11: Admin Pages Need Navigation + Security

**Problem:** 
- Admin pages not visible in navbar
- No way to navigate to admin without typing URL
- Any wallet can currently access admin pages

**Solution:**

1. **Add Admin Menu to Header** (conditional on wallet):
```tsx
// In header.tsx, after wallet is connected
{isAdminWallet && (
  <DropdownMenu>
    <DropdownMenuTrigger>Admin</DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem href="/admin">Queue Review</DropdownMenuItem>
      <DropdownMenuItem href="/admin/milestones">Milestones</DropdownMenuItem>
      <DropdownMenuItem href="/admin/analytics">Analytics</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)}
```

2. **Admin Wallet Check:**
```tsx
const ADMIN_WALLET = "4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw"
const isAdminWallet = publicKey?.toString() === ADMIN_WALLET
```

3. **AdminGuard Component** - Already exists at `src/components/admin/admin-guard.tsx`
   - Ensure all admin pages use this wrapper
   - Return redirect for non-admin wallets

---

### Issue #12: Creator Dashboard Milestones Not Shown

**Problem:** `/dashboard/creator` doesn't show project milestones or allow milestone management.

**Location:** `src/app/dashboard/creator/page.tsx`

**Solution:**
1. Fetch milestones for each project from API
2. Display milestone progress within project cards
3. Add "Submit Proof" action button for active milestones
4. Link to milestone detail/submit page

---

### Issue #13: Admin Milestones Page Static

**Problem:** `/admin/milestones` displays data but has no working action buttons.

**Location:** `src/app/admin/milestones/page.tsx`

**Current State:**
- Fetches milestones from API ✅
- Displays milestone cards ✅
- Approve/Reject buttons exist but may not be functional ❓

**Solution:**
1. Verify `handleApprove` and `handleReject` functions work
2. Ensure API endpoints `/api/admin/milestones/[id]/approve` and `/reject` work
3. Add visual feedback on action success/failure
4. Show proof/evidence in expandable section

---

### Issue #14: `/wallet` Should Be User Profile Page

**Problem:** `/wallet` page currently shows wallet balance and transactions, should be expanded to full user profile.

**Location:** `src/app/wallet/page.tsx`

**Solution:**
1. Rename route to `/profile` or keep `/wallet` with expanded functionality
2. Add sections:
   - Profile info (editable)
   - Backed projects summary
   - Created projects summary
   - Transaction history
   - NFT badges (future)
3. Reference existing `/profile/page.tsx` - may need consolidation

---

### Issue #15: Add Sidebar Navigation

**Problem:** No sidebar for contextual navigation on dashboard/admin pages.

**Solution:**
1. Create `<DashboardSidebar>` component
2. Use for:
   - `/dashboard/*` pages
   - `/admin/*` pages
3. Show relevant links based on context

**Sidebar for Creator Dashboard:**
- Overview
- My Projects
- Milestones
- Earnings
- Messages
- Analytics

**Sidebar for Admin:**
- Queue Review
- Active Projects
- Milestones
- Users
- Analytics
- Settings

---

### Issue #16: Improve Backer Dashboard UX

**Problem:** Dashboard view not optimized for investors/backers finding projects to back.

**Location:** `src/app/dashboard/backer/page.tsx`

**Solution:**
1. Show recommended projects based on backed categories
2. Highlight projects close to funding goal
3. Show milestone updates from backed projects
4. Add quick-back feature for $1 increments

---

## Implementation Plan

### Phase 1: Critical Bug Fixes (Day 1)
1. ✅ Fix admin API 500 error (status mapping)
2. Delete `src/app/projects/page.tsx` (mock data page)
3. Delete `src/lib/mock-db.ts` ✅
4. Update all `/projects` links → `/discover` ✅
5. Remove mock mode checks from APIs ✅

### Phase 2: Core UX Fixes (Day 2) ✅ COMPLETE
1. Add calendar date picker to milestone form ✅ (Added min date validation)
2. Show default milestone on submit page ✅
3. Fix progress stepper alignment ✅
4. Fix admin milestones page actions ✅ (Already had working actions)
5. Add milestone display to creator dashboard ✅ (New milestones page with real data)

### Phase 3: Navigation & Security (Day 3) ✅ COMPLETE
1. Add admin menu to header (wallet-gated) ✅
2. Create dashboard sidebar component ✅
3. Ensure AdminGuard works on all admin pages ✅
4. Update header dropdown spacing ✅

### Phase 4: Page Consolidation (Day 4) ✅ COMPLETE
1. Audit and delete unnecessary pages ✅
2. Consolidate `/wallet` and `/profile` ⏳ (Kept separate - distinct purposes)
3. Clean up route structure ✅
4. Update all internal links ✅

### Phase 5: Polish (Day 5) 🔄 IN PROGRESS
1. Wallet address font consistency ⏳
2. Improve backer dashboard ⏳
3. Final design system compliance check ⏳
4. Mobile responsiveness verification ⏳

---

## Pages Deleted ✅

| File Path | Reason | Status |
|-----------|--------|--------|
| `src/app/projects/page.tsx` | Uses mock data, duplicate of `/discover` | ✅ Deleted |
| `src/app/projects/loading.tsx` | Associated loading file | ✅ Deleted |
| `src/app/admin/page-old.tsx` | Backup file, not needed | ✅ Deleted |
| `src/lib/mock-db.ts` | Mock database, production should use Supabase | ✅ Deleted |

## Files Modified ✅

| File Path | Changes | Status |
|-----------|---------|--------|
| `src/app/submit/page.tsx` | Default milestone, min date validation, stepper alignment | ✅ |
| `src/components/header.tsx` | Admin menu (wallet-gated), dropdown spacing | ✅ |
| `src/components/mobile-nav.tsx` | Admin section for admin wallet | ✅ |
| `src/app/admin/page.tsx` | Fixed API status mapping, added sidebar | ✅ |
| `src/app/admin/milestones/page.tsx` | Fixed field names (deadline, proof_url) | ✅ |
| `src/app/dashboard/creator/page.tsx` | Added sidebar navigation | ✅ |
| `src/app/dashboard/creator/milestones/page.tsx` | Real data with submit proof dialog | ✅ |
| `src/app/dashboard/backer/page.tsx` | Added sidebar navigation | ✅ |
| `src/app/api/admin/projects/route.ts` | Status mapping, column fixes | ✅ |
| `src/app/api/admin/milestones/route.ts` | Field name mapping | ✅ |

## New Files Created ✅

| File Path | Purpose |
|-----------|---------|
| `src/components/dashboard-sidebar.tsx` | Contextual sidebar for dashboard/admin pages |
| `src/app/api/creator/milestones/route.ts` | API for creator's milestones |

---

## New Features Required

1. **Calendar Date Picker** - For milestone deadline selection
2. **Dashboard Sidebar** - Contextual navigation component
3. **Admin Menu in Header** - Wallet-gated admin navigation
4. **Milestone Actions in Creator Dashboard** - Submit proof UI
5. **Enhanced Profile Page** - Comprehensive user profile

---

## Success Criteria

- [ ] No mock/placeholder data in production code
- [ ] All admin pages protected by wallet check
- [ ] Admin can access all admin pages from navbar
- [ ] Creator can see and manage milestones from dashboard
- [ ] Admin can approve/reject milestones with working buttons
- [ ] Single project browsing page (no duplicate routes)
- [ ] Calendar picker for all date inputs
- [ ] Design system compliance verified
- [ ] All navigation links functional

---

**Next Step:** Confirm this plan, then begin Phase 1 implementation.
