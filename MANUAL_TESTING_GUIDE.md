# Manual Testing Guide - ODV Platform

**Pre-Launch Testing Checklist**  
**Status:** 2/12 Tests Complete (automated), 10 Manual Tests Pending  
**Target:** Complete before production launch

---

## 🎯 OVERVIEW

This document provides step-by-step instructions for manual testing of the ODV crowdfunding platform. These tests cover critical user flows that cannot be fully automated and require real-world interaction.

### Prerequisites:
- ✅ Production build successful
- ✅ Server running on port 3000
- ✅ Supabase database configured
- ✅ SOON Network Testnet access
- ✅ Multiple test wallets prepared
- ✅ Test USDC tokens available

---

## ✅ COMPLETED AUTOMATED TESTS

### TEST-001: Load Time Testing ✅
**Status:** PASSED  
**Results:**
- Homepage: 12ms
- Discover: 13ms
- Admin: 16ms
- Submit: 14ms
- **All pages load << 3s target** 🎉

### TEST-009: Expired Campaign Behavior ✅
**Status:** PASSED  
**Verified:**
- ✅ "Campaign Ended" button displays correctly
- ✅ Back button disabled for expired campaigns
- ✅ "Expired" badge shows on project cards
- ✅ Export backers API functional (CSV/JSON)
- ✅ Export buttons in admin queue with auth headers

---

## 📱 MANUAL TEST PROCEDURES

### TEST-002: Concurrent Transactions
**Priority:** HIGH (P0)  
**Estimated Time:** 30 minutes

#### Setup:
1. Create 10 different test wallets with USDC
2. Open 10 browser sessions (or use multiple devices)
3. Select a single test project for backing

#### Test Steps:
1. **Simultaneous Backing:**
   - Have all 10 wallets attempt to back the same project at exactly the same time
   - Use different backing amounts (5, 10, 15, 20 USDC)
   
2. **Verification:**
   - Check all transactions succeed without conflicts
   - Verify raised amount increments correctly (sum of all backings)
   - Confirm backer_count matches actual number of backers
   - Check database for duplicate backing records
   - Verify no transactions are stuck in "pending" state

3. **Edge Cases:**
   - Test backing when project is 1 USDC away from goal
   - Verify proper handling when multiple users push past goal simultaneously
   - Check that project status updates to "funded" correctly

#### Expected Results:
- ✅ All transactions complete successfully
- ✅ No duplicate backing records
- ✅ Raised amount = sum of all backings
- ✅ Backer count accurate
- ✅ No race conditions or stuck transactions

#### Pass Criteria:
- 10/10 transactions succeed
- Database consistency maintained
- No errors in server logs

---

### TEST-003: Mobile Wallet Connection
**Priority:** HIGH (P0)  
**Estimated Time:** 45 minutes

#### Devices to Test:
- iOS Safari (iPhone 12+)
- iOS Chrome
- Android Chrome
- Android Firefox
- Phantom Mobile App
- Solflare Mobile App

#### Test Steps:

**1. iOS Safari:**
```
1. Open https://[your-domain]/
2. Tap "Connect Wallet" button (ensure ≥44px touch target)
3. Select Phantom/Solflare
4. Verify deep link to wallet app works
5. Approve connection
6. Verify wallet address displays correctly
7. Test disconnect and reconnect
```

**2. Phantom Mobile App:**
```
1. Open Phantom app
2. Navigate to browser tab
3. Enter platform URL
4. Test automatic wallet detection
5. Verify transaction signing flow
6. Test back button navigation
7. Verify session persistence
```

**3. Connection Edge Cases:**
```
- Test connection with no wallet installed
- Test connection with multiple wallets installed
- Test switching wallets mid-session
- Test connection timeout scenarios
- Verify error messages are mobile-friendly
```

#### Expected Results:
- ✅ Wallet connects on first attempt
- ✅ Deep linking works (app opens)
- ✅ Connection persists across page navigation
- ✅ Disconnect works properly
- ✅ Error messages display correctly on mobile

---

### TEST-004: Mobile Project Submission
**Priority:** HIGH (P1)  
**Estimated Time:** 40 minutes

#### Test on:
- iPhone (iOS 16+)
- Android phone (Android 12+)
- Tablet (iPad/Android tablet)

#### Test Steps:

**1. Form Accessibility:**
```
1. Navigate to /submit on mobile device
2. Verify all form fields are accessible
3. Test scrolling through entire form
4. Verify keyboard doesn't obscure input fields
5. Check that all labels are readable
```

**2. Image Upload:**
```
1. Tap "Upload Image" button
2. Test camera capture (if on phone)
3. Test gallery selection
4. Verify image preview displays
5. Test image removal and re-upload
6. Check file size validation works
```

**3. Milestone Creation:**
```
1. Tap "Add Milestone" button (verify touch target ≥44px)
2. Fill in milestone title, percentage, deadline
3. Test date picker on mobile
4. Verify percentage validation works
5. Test removing milestones
6. Verify "Total: 100%" indicator visible
```

**4. Form Validation:**
```
1. Try submitting with empty required fields
2. Verify validation toasts display properly
3. Test funding goal validation (minimum $10)
4. Test milestone percentage totals (must equal 100%)
5. Verify deadline validation (must be future date)
```

**5. Submission Flow:**
```
1. Fill complete valid form
2. Tap "Submit Project" button
3. Verify wallet signature prompt appears
4. Approve transaction
5. Check progress modal displays correctly
6. Verify success message shows
7. Check redirect to dashboard works
```

#### Expected Results:
- ✅ All form fields accessible and functional
- ✅ Image upload works (camera + gallery)
- ✅ Milestones can be added/removed easily
- ✅ Validation messages clear and visible
- ✅ Touch targets meet 44px minimum
- ✅ Keyboard navigation works properly
- ✅ Form persists on page refresh (localStorage)

---

### TEST-005: Mobile Backing Flow
**Priority:** HIGH (P0)  
**Estimated Time:** 30 minutes

#### Test Steps:

**1. Project Discovery:**
```
1. Open /discover on mobile
2. Scroll through project cards
3. Verify cards display properly (responsive layout)
4. Tap on a project card
5. Verify navigation to project detail page
```

**2. Project Detail View:**
```
1. Scroll through project details
2. Check progress bar displays correctly
3. Verify milestone section readable
4. Test "Back This Project" button visibility
5. Verify button stays visible while scrolling
```

**3. Backing Modal:**
```
1. Tap "Back This Project" button
2. Verify modal opens (no layout issues)
3. Enter backing amount (test keyboard input)
4. Verify amount validation works (min $5)
5. Check that calculation shows correct percentage of goal
6. Tap "Continue" button
```

**4. Transaction Signing:**
```
1. Verify wallet signature prompt appears
2. Approve transaction on mobile wallet
3. Watch progress modal update through steps:
   - Approving transaction...
   - Confirming transaction...
   - Recording backing...
   - Success!
4. Verify modal auto-closes after 5 seconds
5. Check manual close button works
```

**5. Post-Backing Verification:**
```
1. Verify button changes to "Already Backed"
2. Check project raised amount updates
3. Navigate to /portfolio
4. Verify backed project appears in list
5. Check transaction history shows backing
```

#### Expected Results:
- ✅ All buttons/inputs have ≥44px touch targets
- ✅ Modal fits properly on small screens
- ✅ Amount input keyboard works correctly
- ✅ Progress modal displays all steps clearly
- ✅ Auto-close timer works (5 seconds)
- ✅ Portfolio updates immediately

---

### TEST-006: Admin Approval Workflow
**Priority:** HIGH (P0)  
**Estimated Time:** 35 minutes

#### Prerequisites:
- Admin wallet: `4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw`
- At least 3 projects in queue status

#### Test Steps:

**1. Admin Access:**
```
1. Connect with non-admin wallet
2. Try accessing /admin
3. Verify redirect or access denied
4. Disconnect wallet
5. Connect with admin wallet
6. Navigate to /admin
7. Verify access granted
```

**2. Queue Tab Review:**
```
1. Click "Queue" tab
2. Verify list of pending projects displays
3. Check project details are visible:
   - Title, creator, funding goal
   - Description preview
   - Category, deadline
4. Verify filters work (category dropdown)
5. Test search functionality
```

**3. Project Review:**
```
1. Click "Review Details" on a project
2. Verify modal opens with full details
3. Review all project information:
   - Complete description
   - Milestones breakdown
   - Creator information
4. Verify images load properly
5. Check video URL opens correctly
```

**4. Approval Flow:**
```
1. Click "Approve" button
2. Verify confirmation modal appears
3. Confirm approval
4. Check success toast displays
5. Verify project moves from queue to active
6. Check project visible on /discover page
7. Verify creator receives notification
```

**5. Middleware Security:**
```
1. Open DevTools > Network tab
2. Approve another project
3. Check API request headers:
   - Verify x-wallet-address header present
   - Confirm request goes through middleware
4. Try calling /api/admin/* without header (using curl):
   curl -X POST http://localhost:3000/api/admin/projects/[id]/approve
5. Verify request is rejected (401/403)
```

#### Expected Results:
- ✅ Only admin wallet can access /admin routes
- ✅ Middleware blocks unauthorized API calls
- ✅ Approval updates database correctly
- ✅ Project becomes visible to public
- ✅ Creator notification sent
- ✅ Audit log records admin action

---

### TEST-007: Admin Rejection Workflow
**Priority:** MEDIUM (P1)  
**Estimated Time:** 25 minutes

#### Test Steps:

**1. Rejection Flow:**
```
1. Navigate to /admin > Queue tab
2. Select a project to reject
3. Click "Reject" button
4. Verify rejection reason modal appears
5. Enter rejection reason (required field)
6. Submit rejection
```

**2. Creator Notification:**
```
1. Connect as project creator
2. Navigate to /notifications
3. Verify rejection notification displays
4. Check that rejection reason is included
5. Verify notification links to dashboard
```

**3. Creator Dashboard View:**
```
1. Stay connected as creator
2. Navigate to /dashboard/creator
3. Find rejected project
4. Verify status shows "rejected"
5. Check rejection reason is visible
6. Verify "Edit & Resubmit" option exists
```

**4. Public Visibility:**
```
1. Disconnect wallet (guest view)
2. Navigate to /discover
3. Verify rejected project is NOT visible
4. Try direct URL: /project/[rejected-id]
5. Verify access denied or 404
```

#### Expected Results:
- ✅ Rejection requires reason (validation works)
- ✅ Creator receives notification
- ✅ Project status updates to "rejected"
- ✅ Rejected projects not visible publicly
- ✅ Creator can view rejection reason
- ✅ Resubmission option available

---

### TEST-008: Milestone Review Flow
**Priority:** HIGH (P1)  
**Estimated Time:** 40 minutes

#### Prerequisites:
- Funded project with milestones
- Creator wallet for submission
- Admin wallet for review

#### Test Steps:

**1. Creator Milestone Submission:**
```
1. Connect as project creator
2. Navigate to /dashboard/creator/milestones
3. Select next pending milestone
4. Click "Submit for Review"
5. Fill submission form:
   - Progress description (required)
   - Evidence links (optional)
   - Supporting documents
6. Submit for review
7. Verify status changes to "under_review"
```

**2. Admin Notification:**
```
1. Switch to admin wallet
2. Navigate to /admin > Milestones tab
3. Verify new submission appears in list
4. Check notification indicator shows new item
```

**3. Admin Review:**
```
1. Click "Review" on milestone
2. Verify modal shows:
   - Milestone details (title, percentage, deadline)
   - Creator's submission (description, links)
   - Project information
3. Review submission quality
4. Test "Request Changes" button (if needed)
```

**4. Milestone Approval:**
```
1. Click "Approve Milestone" button
2. Verify confirmation modal
3. Confirm approval
4. Watch for blockchain transaction:
   - Fund release transaction initiated
   - Creator receives percentage of raised funds
5. Verify transaction signature returned
6. Check explorer link opens correctly
```

**5. Post-Approval Verification:**
```
1. Switch back to creator wallet
2. Navigate to /dashboard/creator/earnings
3. Verify funds received in wallet balance
4. Check milestone status shows "approved"
5. Verify next milestone now active
6. Check notification sent to creator
```

**6. Backer Visibility:**
```
1. Connect as a backer wallet
2. Navigate to backed project page
3. Scroll to Milestones section
4. Verify approved milestone shows checkmark
5. Check date of approval visible
6. Verify progress bar updates
```

#### Expected Results:
- ✅ Creator can submit milestone evidence
- ✅ Admin receives review notification
- ✅ Approval releases correct percentage of funds
- ✅ Blockchain transaction succeeds
- ✅ Creator wallet balance updates
- ✅ Milestone status updates for all users
- ✅ Next milestone becomes active

---

### TEST-010: Network Disconnection
**Priority:** HIGH (P0)  
**Estimated Time:** 30 minutes

#### Test Setup:
1. Open Chrome DevTools > Network tab
2. Enable network throttling
3. Prepare to simulate disconnection

#### Test Scenarios:

**1. Disconnection During Project Submission:**
```
1. Fill out complete project submission form
2. Click "Submit Project"
3. As soon as wallet signature appears, enable "Offline" in DevTools
4. Approve transaction in wallet
5. Observe behavior:
   - Does progress modal show error?
   - Is transaction still pending?
   - Does retry logic activate?
6. Re-enable network after 10 seconds
7. Verify:
   - Transaction completes or shows clear error
   - No stuck "loading" states
   - User can retry if failed
```

**2. Disconnection During Backing:**
```
1. Navigate to project page
2. Click "Back This Project"
3. Enter amount and confirm
4. Approve wallet signature
5. Disable network immediately after approval
6. Wait 15 seconds
7. Re-enable network
8. Verify:
   - Progress modal handles disconnection
   - Error message is clear
   - "Retry" button appears
   - Transaction doesn't duplicate on retry
```

**3. Disconnection During Page Load:**
```
1. Disable network
2. Try navigating to /discover
3. Verify offline message/fallback displays
4. Re-enable network
5. Verify page loads automatically
6. Check that no broken states occur
```

**4. Transaction Confirmation Timeout:**
```
1. Enable "Slow 3G" throttling
2. Submit a backing transaction
3. Observe progress modal during slow confirmation
4. Verify:
   - Loading states don't hang forever
   - Timeout message appears after reasonable delay
   - User can check transaction status manually
   - Explorer link available even if confirmation slow
```

#### Expected Results:
- ✅ Clear error messages for network issues
- ✅ Retry logic activates automatically
- ✅ No stuck loading states
- ✅ No duplicate transactions on retry
- ✅ Transaction signatures preserved
- ✅ User can manually verify via explorer link

---

### TEST-011: Multiple Tabs Consistency
**Priority:** MEDIUM (P2)  
**Estimated Time:** 20 minutes

#### Note:
PERF-005 (cross-tab sync) was deferred as a future enhancement. This test documents current expected behavior.

#### Test Steps:

**1. Wallet Connection:**
```
1. Open platform in Tab A
2. Connect wallet
3. Open platform in Tab B (same browser)
4. Verify:
   - Tab B shows disconnected state initially
   - Refreshing Tab B connects wallet
   - Document: No automatic cross-tab sync yet
```

**2. Backing a Project:**
```
1. Tab A: Navigate to project and back it
2. Observe Tab B (same project page)
3. Verify:
   - Raised amount doesn't update automatically in Tab B
   - Refreshing Tab B shows updated amount
   - No data corruption occurs
```

**3. Project Submission:**
```
1. Tab A: Start filling project submission form
2. Tab B: Navigate to same /submit page
3. Verify:
   - localStorage form persistence works independently
   - Submitting from one tab doesn't break the other
   - No conflicting campaign IDs generated
```

**4. Admin Actions:**
```
1. Tab A: Admin approves a project
2. Tab B: Still viewing queue tab
3. Verify:
   - Tab B doesn't automatically update
   - Refreshing Tab B shows updated queue
   - No errors occur from stale data
```

#### Current Behavior:
- 🟡 **No automatic cross-tab synchronization**
- ✅ **Refreshing tab loads latest data correctly**
- ✅ **No data corruption from multiple tabs**
- ✅ **localStorage works independently per tab**

#### Future Enhancement (PERF-005):
- Use BroadcastChannel API for tab sync
- Real-time updates across tabs
- Stale data warnings

---

### TEST-012: Campaign ID Race Conditions
**Priority:** HIGH (P0)  
**Estimated Time:** 30 minutes

#### Test Scenarios:

**1. Sequential Submissions:**
```
1. Open /submit in Tab A
2. Fill out Project A
3. Before submitting, open /submit in Tab B
4. Fill out Project B
5. Submit both projects rapidly (< 2 seconds apart)
6. Verify:
   - Both projects get unique campaign IDs
   - No duplicate IDs in database
   - Campaign ID counter increments correctly
```

**2. Simultaneous API Calls:**
```
1. Use curl/Postman to create 5 project submissions simultaneously:
   
   for i in {1..5}; do
     curl -X POST http://localhost:3000/api/projects \
       -H "Content-Type: application/json" \
       -d @test-project-$i.json &
   done
   wait

2. Verify:
   - All 5 projects created successfully
   - Campaign IDs are sequential and unique
   - No conflicts in database
```

**3. Campaign ID Function Testing:**
```
1. Review getNextCampaignId() implementation
2. Verify it uses blockchain program state
3. Test edge cases:
   - First campaign (ID should be 0)
   - After 100 campaigns
   - After database reset (should match blockchain state)
```

**4. Database Consistency:**
```
1. After multiple submissions, run query:
   
   SELECT campaign_id, COUNT(*) as count
   FROM projects
   WHERE campaign_id IS NOT NULL
   GROUP BY campaign_id
   HAVING COUNT(*) > 1;

2. Verify: No results (no duplicate campaign IDs)

3. Check sequence:
   
   SELECT campaign_id
   FROM projects
   WHERE campaign_id IS NOT NULL
   ORDER BY campaign_id;

4. Verify: Sequential with no gaps
```

#### Expected Results:
- ✅ Campaign IDs are always unique
- ✅ getNextCampaignId() properly synchronized
- ✅ No race conditions from concurrent submissions
- ✅ Database constraints prevent duplicates
- ✅ Blockchain state is source of truth

---

## 📝 TESTING REPORT TEMPLATE

For each test, document the following:

```markdown
### TEST-XXX: [Test Name]
**Date Tested:** YYYY-MM-DD
**Tester:** [Name]
**Environment:** Production / Staging / Local
**Browser/Device:** [Details]

#### Results:
- [ ] PASS
- [ ] FAIL

#### Details:
[Describe what worked, what failed, any issues encountered]

#### Screenshots:
[Attach relevant screenshots]

#### Issues Found:
1. [Issue description]
2. [Issue description]

#### Notes:
[Any additional observations]
```

---

## 🎯 COMPLETION CRITERIA

Before production launch, the following must be true:

### Critical (Must Pass):
- ✅ TEST-001: Load times (COMPLETE)
- ⏳ TEST-002: Concurrent transactions
- ⏳ TEST-003: Mobile wallet connection
- ⏳ TEST-005: Mobile backing flow
- ⏳ TEST-006: Admin approval workflow
- ✅ TEST-009: Expired campaigns (COMPLETE)
- ⏳ TEST-010: Network disconnection
- ⏳ TEST-012: Campaign ID race conditions

### Important (Should Pass):
- ⏳ TEST-004: Mobile project submission
- ⏳ TEST-007: Admin rejection workflow
- ⏳ TEST-008: Milestone review flow

### Nice to Have (Can Document Issues):
- ⏳ TEST-011: Multiple tabs consistency (known limitation)

---

## 🚀 POST-TESTING ACTIONS

Once all critical tests pass:

1. **Document Findings:**
   - Create bug reports for any issues found
   - Prioritize fixes (P0, P1, P2)
   - Update issue tracker

2. **Performance Monitoring:**
   - Set up production monitoring
   - Configure error tracking (Sentry/similar)
   - Enable analytics

3. **Beta Launch:**
   - Deploy to production
   - Enable small group of beta testers
   - Monitor closely for first 48 hours

4. **Gather Feedback:**
   - Create feedback form
   - Monitor user reports
   - Track common issues

5. **Iterative Improvements:**
   - Address P0 issues immediately
   - Plan P1 fixes for next sprint
   - Document P2 enhancements for future

---

## 📞 SUPPORT

**For testing questions:**
- Review TESTING_FEEDBACK_FIXES.md
- Check ADMIN_SECURITY_COMPLETE.md
- Reference MOBILE_RESPONSIVE_AUDIT.md

**Test environment:**
- Local: http://localhost:3000
- Staging: [Your staging URL]
- Production: [Your production URL]

**Admin wallet:**
- `4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw`

---

**Good luck with testing! 🎉**
