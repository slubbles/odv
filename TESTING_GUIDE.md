# ODV Testing Manual - Backing & Submitting Projects

## 🎯 Testing Checklist

### 1. Testing Project Submission

#### Steps:
1. **Navigate to Submit Page**
   - Go to `/submit` or click "Launch a Project"
   - Make sure your wallet is connected

2. **Fill Out Project Form**
   - Title: "My Test Project"
   - Tagline: Short description
   - Category: Select any
   - Goal: e.g., 100 USDC
   - Description: Full description
   - Add at least 1 milestone

3. **Submit Project**
   - Click "Submit Project"
   - Wait for transaction signature (should be quick, database-only)
   - You should see success message

4. **Expected Results:**
   - ✅ Project appears in admin dashboard with "pending" status
   - ✅ No wallet popup (database operation only)
   - ✅ Redirect to project page

5. **If Errors Occur:**
   - **"Required fields missing"** → Fill all required fields
   - **"Database error"** → Check console logs, may need to fix Supabase connection
   - **"Wallet not connected"** → Reconnect wallet

---

### 2. Testing Admin Approval (Initialize Campaign on Blockchain)

#### Steps:
1. **Go to Admin Dashboard**
   - Navigate to `/admin`
   - You should see pending project

2. **Approve Project**
   - Click "Approve" button
   - **WALLET POPUP SHOULD APPEAR** (blockchain transaction)
   - Approve transaction in wallet

3. **Expected Results:**
   - ✅ Wallet popup appears (OKX/Phantom/etc)
   - ✅ Transaction creates campaign on SOON blockchain
   - ✅ Project status changes to "active"
   - ✅ Database updates with:
     - `campaign_id` (e.g., 4, 5, 6...)
     - `campaign_pda` (blockchain address)
     - `initialize_tx` (transaction signature)

4. **If Errors Occur:**
   - **"Transaction failed"** → Check console logs for error code
   - **"Insufficient funds"** → Get SOON testnet tokens from faucet
   - **"User rejected"** → You cancelled, try again
   - **Custom Error 6000-6010** → Smart contract validation error, check logs

---

### 3. Testing Backing (Funding a Project)

#### Steps:
1. **Navigate to Active Project**
   - Go to `/project/[id]`
   - Make sure project status is "active"
   - Confirm campaign_id is NOT null (check database if unsure)

2. **Click "Back This Project"**
   - Button should be enabled (not grayed out)
   - Should show "Back for $1 USDC"

3. **Approve Transaction**
   - **WALLET POPUP APPEARS**
   - Transaction shows:
     - Sending 1 USDC
     - To: Campaign vault address
   - Click "Confirm"

4. **Expected Results:**
   - ✅ Wallet popup appears
   - ✅ Transaction succeeds
   - ✅ Success modal: "You're In! 🎉"
   - ✅ Project `raised` amount increases by $1
   - ✅ Project `backers_count` increases by 1
   - ✅ Your wallet appears in backers list
   - ✅ NFT badge may be shown (future feature)

5. **If Errors Occur:**

   **A. "Campaign Not Initialized" (Button Disabled)**
   - Project's `campaign_id` is null in database
   - Admin needs to approve project first
   - Check database: `SELECT campaign_id FROM projects WHERE id = '[project-id]'`

   **B. Error 102: ConstraintSeeds**
   - ❌ OLD ISSUE (should be fixed now with latest deployment)
   - Means PDA derivation mismatch
   - If still happening: Check console logs for campaign_id value
   - Verify campaign_pda in database matches computed PDA

   **C. "Insufficient funds" / "Insufficient SOL"**
   - Not enough USDC in wallet
   - Get test USDC: `/faucet` page or use create-test-usdc script
   - Or not enough SOL for gas fees (need ~0.01 SOL)

   **D. "Transaction execution unsuccessful"**
   - Check console for specific error
   - Common causes:
     - Wrong network (should be SOON Testnet)
     - Smart contract paused
     - Invalid token account

   **E. "Unknown transaction" (OKX Warning)**
   - Normal for testnet/new programs
   - Means OKX can't decode transaction details
   - Safe to proceed if you trust the app

   **F. Custom Error 6001: "Goal Not Reached"**
   - Trying to release milestone before goal reached
   - Not applicable for backing

   **G. Custom Error 6002: "Platform Paused"**
   - Admin paused the platform
   - Contact platform admin

---

### 4. Debugging Tools

#### Check Project Status in Database:
```sql
SELECT 
  id, 
  title, 
  status, 
  campaign_id, 
  campaign_pda, 
  initialize_tx,
  raised,
  backers_count
FROM projects 
WHERE id = 'YOUR-PROJECT-ID-HERE';
```

#### Check Console Logs:
Open browser DevTools (F12) and look for:
- `[BackProjectButton]` - Button click handling
- `[useBackProject]` - Transaction flow
- `[getCampaignPDA]` - PDA computation
- `[createFundCampaignTransaction]` - Transaction creation

#### Check Transaction on Explorer:
- SOON Explorer: `https://explorer.testnet.soo.network/tx/[signature]`
- Or check console for transaction signature

---

### 5. Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Can't back own project | You're the creator | Use different wallet to test |
| Button disabled | Project not initialized | Admin needs to approve first |
| Error 102 | ~~PDA mismatch~~ | Fixed in latest deployment |
| No USDC | Empty wallet | Use faucet at `/faucet` |
| Network error | Wrong RPC | Ensure SOON Testnet selected |
| Simulation failed | Smart contract error | Check console for error code |

---

### 6. Test Scenarios to Cover

#### Happy Path:
1. ✅ Submit project → Success
2. ✅ Admin approve → Campaign initialized
3. ✅ User backs project → Raised increases
4. ✅ Multiple backers → Count increases
5. ✅ Goal reached → Can release milestone

#### Edge Cases:
1. ⚠️ Back with 0 USDC → Should fail
2. ⚠️ Back same project twice → Should succeed (different transactions)
3. ⚠️ Back before approval → Button disabled
4. ⚠️ Creator backs own project → Allowed (but test with different wallet)
5. ⚠️ Back expired project → Should fail

---

### 7. Expected Console Output (Successful Backing)

```javascript
[BackProjectButton] ⚡ Starting backing flow with params: {
  projectId: "f03c223a-bbb4-4045-9ecf-9d6f6d71fa7b",
  campaignId: 4,
  creatorWallet: "4GCC5vqQ...",
}

[useBackProject] ⚡ STARTING BACK PROJECT {
  amount: 1,
  campaignId: 4,
  projectId: "f03c223a-bbb4-4045-9ecf-9d6f6d71fa7b"
}

[getCampaignPDA] 🧮 Computing PDA with seeds: {
  seed: "campaign",
  creator: "4GCC5vqQ...",
  campaignId: 4,
  campaignIdBuffer: "0400000000000000"
}

[getCampaignPDA] ✅ PDA computed: {
  pda: "2evNg9hPQbQX7FzGj9eZgWMXe3VwRZSYnmfAhj6X85fs",
  bump: 254
}

[createFundCampaignTransaction] ✅ Campaign exists on-chain

[useBackProject] Transaction created successfully
[useBackProject] Step 2: Simulating transaction...
[useBackProject] Step 3: Waiting for wallet signature...
[useBackProject] Step 4: Sending transaction...
[useBackProject] ✅ Transaction confirmed: 5xyz...

✅ SUCCESS: Project backed successfully!
```

---

### 8. Quick Reference

**Smart Contract Program ID:**
```
2NZKEk8zk47UAc27f7DScFgxpqyy22VptWVwBUjFfQxC
```

**SOON Testnet RPC:**
```
https://rpc.testnet.soo.network/rpc
```

**Deployment Status:**
- ✅ Latest deployment: Dec 11, 2025
- ✅ Error 102 fix deployed
- ✅ Campaign PDA validation added

**Test Wallets:**
- Creator wallet: `4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw`
- For backing tests: Create separate wallet or use different browser/extension

---

### 9. Getting Help

If you encounter issues:

1. **Check console logs** (F12 → Console tab)
2. **Check database** (Run SQL query to verify campaign_id)
3. **Check transaction** (Copy signature, check on explorer)
4. **Verify network** (Should be SOON Testnet)
5. **Check wallet balance** (Need SOL + USDC)

**Common Error Codes:**
- `102` = ConstraintSeeds violation (PDA mismatch) - FIXED
- `6000` = Unauthorized
- `6001` = Goal not reached
- `6002` = Platform paused
- `6003` = Deadline passed
- `6004` = Milestone not approved

---

## ✅ Test Complete Checklist

Before marking testing complete, verify:

- [ ] Project submission works
- [ ] Admin approval initializes campaign on blockchain
- [ ] Database stores campaign_id, campaign_pda, initialize_tx
- [ ] Backing button enabled for active projects
- [ ] Backing transaction succeeds
- [ ] Raised amount updates in database
- [ ] Backers count increases
- [ ] Multiple backers can back same project
- [ ] Console logs show correct PDA computation
- [ ] No Error 102 occurs

---

**Last Updated:** December 11, 2025  
**Smart Contract Version:** v0.1.0 (with Error 102 fix)
