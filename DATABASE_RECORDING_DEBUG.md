# Database Recording Debug Guide

## Issue Summary
- ✅ Transaction succeeds on blockchain
- ✅ Success modal shows with TX proof  
- ❌ After refresh, stats don't update
- ❌ Button still shows "Back this Project" (should be "Already Funded")
- ❌ Can back project multiple times

**Root Cause:** Database recording is failing silently

---

## Debugging Steps

### 1. Check Browser Console (F12)

After clicking "Back this Project", you should see:

```
[useBackProject] Step 1: Creating transaction...
[useBackProject] Transaction created successfully
[useBackProject] Step 2: Simulating transaction...
[useBackProject] Step 3: Waiting for wallet signature...
[useBackProject] Transaction signed! Signature: 5KxH2m...
[useBackProject] Step 4: Confirming on blockchain...
[useBackProject] ✅ Blockchain confirmation successful!
[useBackProject] Step 5: Recording in database...
[useBackProject] Verifying transaction... 5KxH2m...
```

**IF YOU SEE AN ERROR HERE**, that's the problem!

Common errors:
- `❌ Verification failed`
- `❌ Failed to record backing`
- `❌ RPC increment error`

### 2. Check Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Filter by `verify-transaction`
4. Look for POST request to `/api/verify-transaction`
5. Click on it and check **Response** tab

**Expected Response:**
```json
{
  "success": true,
  "backing": {
    "id": "...",
    "project_id": "...",
    "wallet_address": "...",
    ...
  }
}
```

**Error Response Examples:**
```json
{
  "error": "Failed to record backing",
  "details": "new row violates row-level security policy",
  "code": "42501"
}
```

### 3. Check Vercel Logs (Production)

If deployed to Vercel:

1. Go to https://vercel.com/slubbles/odv
2. Click on **Logs** tab
3. Click "Back this Project" on your site
4. Look for logs starting with `[Verify Transaction]`

**What to look for:**
```
[Verify Transaction] Request received
[Verify Transaction] Supabase admin client available: true
[Verify Transaction] Request data: { signature: '5KxH2m...', projectId: '...', ... }
[Verify Transaction] Connecting to blockchain...
[Verify Transaction] Transaction verified on blockchain
[Verify Transaction] Checking for duplicates...
[Verify Transaction] No duplicate found, proceeding with insertion
[Verify Transaction] Recording backing in database...
[Verify Transaction] Insert data: { projectId: '...', backerWallet: '...', ... }
```

**Common Errors:**

#### Error 1: RLS Policy Violation
```
[Verify Transaction] Backer insert error: {
  code: '42501',
  message: 'new row violates row-level security policy for table "backers"'
}
```

**Solution:** Check Supabase RLS policies in SQL file we ran earlier

#### Error 2: Unique Constraint Violation
```
[Verify Transaction] Backer insert error: {
  code: '23505',
  message: 'duplicate key value violates unique constraint "backers_pkey"'
}
```

**Solution:** This is actually OK - it means the backer was already recorded (possibly from a retry)

#### Error 3: Function Not Found
```
[Verify Transaction] RPC increment error: {
  code: '42883',
  message: 'function public.increment_backers(uuid, numeric) does not exist'
}
```

**Solution:** Run the SQL file again - the function wasn't created

#### Error 4: Missing Service Role Key
```
[Verify Transaction] Supabase admin client available: false
```

**Solution:** Check Vercel environment variables for `SUPABASE_SERVICE_ROLE_KEY`

---

## Quick Fixes

### Fix 1: Verify Supabase Connection

Run this in browser console:
```javascript
fetch('https://onedollarventures.com/api/verify-transaction', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    signature: 'test',
    projectId: 'test',
    amount: 1,
    backerWallet: 'test'
  })
}).then(r => r.json()).then(console.log)
```

Expected: Error about invalid signature (proves API is working)
Bad: 500 error or "Supabase admin client available: false"

### Fix 2: Check if Backer Was Actually Recorded

Go to Supabase SQL Editor and run:
```sql
SELECT * FROM backers 
WHERE transaction_signature = 'YOUR_TX_SIGNATURE_HERE'
ORDER BY created_at DESC;
```

Replace `YOUR_TX_SIGNATURE_HERE` with the signature from your transaction.

**If row exists:** Database DID record it, but UI isn't checking properly
**If no row:** Database recording actually failed

### Fix 3: Check Project Stats

```sql
SELECT id, title, raised, backers_count 
FROM projects 
WHERE id = 'YOUR_PROJECT_ID';
```

If `backers_count` didn't increment, the `increment_backers` function didn't run.

### Fix 4: Manual Fix (If Transaction Succeeded but DB Failed)

```sql
-- 1. Insert the missing backer record
INSERT INTO backers (project_id, wallet_address, amount, transaction_signature)
VALUES ('project-id-here', 'your-wallet-here', 1, 'tx-signature-here');

-- 2. Update project stats manually
UPDATE projects
SET 
  raised = raised + 1,
  backers_count = backers_count + 1,
  updated_at = NOW()
WHERE id = 'project-id-here';
```

---

## Vercel Environment Variables Check

1. Go to https://vercel.com/slubbles/odv/settings/environment-variables
2. Verify these exist:

```
NEXT_PUBLIC_SUPABASE_URL=https://zsfujmvltpumleszcrwh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci... (MUST be service_role, not anon!)
```

3. If `SUPABASE_SERVICE_ROLE_KEY` is missing or wrong:
   - Get from Supabase: https://zsfujmvltpumleszcrwh.supabase.co/project/_/settings/api
   - Copy the **service_role** key (secret, not public)
   - Add to Vercel
   - Redeploy

---

## Test Script

Run this in browser console on your project page to test the full flow:

```javascript
// Get project info from page
const projectId = window.location.pathname.split('/').pop();
const button = document.querySelector('button');
const walletAddress = 'YOUR_WALLET_HERE'; // Replace

// Test backing status check
fetch(`/api/backing/${projectId}?wallet=${walletAddress}`)
  .then(r => r.json())
  .then(data => {
    console.log('Backing Status:', data);
    if (data.hasBacked) {
      console.log('✅ User HAS backed this project');
      console.log('Backing details:', data.backing);
    } else {
      console.log('❌ User has NOT backed this project');
    }
  })
  .catch(err => console.error('❌ API Error:', err));
```

---

## Expected Successful Flow

```
User clicks button
  ↓
[BackProjectButton] Starting backing flow...
  ↓
[useBackProject] Step 1: Creating transaction...
[useBackProject] Transaction created successfully
  ↓
[useBackProject] Step 2: Simulating transaction...
[useBackProject] Step 3: Waiting for wallet signature...
  ↓
[User approves in wallet]
  ↓
[useBackProject] Transaction signed! Signature: 5KxH2m3p7dQ...
[useBackProject] Step 4: Confirming on blockchain...
  ↓
[2-5 seconds later]
  ↓
[useBackProject] ✅ Blockchain confirmation successful!
[useBackProject] Step 5: Recording in database...
[useBackProject] Verifying transaction... 5KxH2m3p
  ↓
[Server: /api/verify-transaction]
  ↓
[Verify Transaction] Request received
[Verify Transaction] Supabase admin client available: true
[Verify Transaction] Connecting to blockchain...
[Verify Transaction] Transaction verified on blockchain
[Verify Transaction] Checking for duplicates...
[Verify Transaction] No duplicate found, proceeding with insertion
[Verify Transaction] Recording backing in database...
[Verify Transaction] Insert data: {...}
[Verify Transaction] ✅ Backer record created: uuid-here
[Verify Transaction] Calling increment_backers RPC function...
[Verify Transaction] RPC params: { project_id: '...', amount_to_add: 1 }
[Verify Transaction] RPC result: { data: null, error: null }
[Verify Transaction] ✅ Project stats updated successfully
[Verify Transaction] Adding to activity feed...
[Verify Transaction] Success! All operations completed
  ↓
[useBackProject] Verification successful: {...}
[useBackProject] ✅ Database recording successful!
  ↓
[BackProjectButton] Transaction successful! 5KxH2m
[BackProjectButton] Modal closing, finalStep: success
[BackProjectButton] Success modal closed, updating UI state
[BackProjectButton] Triggering parent refetch
  ↓
[ProjectPage] Backing successful, refetching project data
  ↓
[BackProjectButton] Backing status verified: true
  ↓
Button changes to "Already Funded" ✅
Stats update: $4,201 raised, 68 backers ✅
```

---

## Common Issues & Solutions

### Issue 1: Button still shows "Back this Project" after success

**Diagnosis:**
```javascript
// Run in console after backing
const projectId = 'your-project-id';
const wallet = 'your-wallet-address';

fetch(`/api/backing/${projectId}?wallet=${wallet}`)
  .then(r => r.json())
  .then(console.log);
```

**If returns `{ hasBacked: false }`:**
- Database recording failed
- Check Vercel logs for errors
- Check Supabase RLS policies

**If returns `{ hasBacked: true, backing: {...} }`:**
- Database is correct
- UI cache issue
- Try hard refresh (Ctrl+Shift+R)

### Issue 2: Can back project multiple times

**This should be impossible!** Causes:

1. **Unique constraint missing:**
```sql
-- Check if constraint exists
SELECT conname FROM pg_constraint 
WHERE conrelid = 'backers'::regclass;
```

Should include: `unique_backer_project`

2. **RLS policy too permissive:**
Check if service role can insert duplicates (it shouldn't)

### Issue 3: Stats don't update

**Diagnosis:**
```sql
-- Check if function has SECURITY DEFINER
SELECT proname, prosecdef FROM pg_proc 
WHERE proname = 'increment_backers';
```

Should return: `prosecdef = true`

**If false:**
- Function doesn't have elevated privileges
- Re-run SQL file

---

## Manual Testing Checklist

After deploying fixes:

- [ ] Open project page
- [ ] Open browser console (F12)
- [ ] Open Network tab
- [ ] Click "Back this Project"
- [ ] Approve in wallet
- [ ] Watch console for errors
- [ ] Check Network tab for `/api/verify-transaction` response
- [ ] Wait for success modal
- [ ] Close modal
- [ ] Verify button says "Already Funded"
- [ ] Verify stats increased ($4,200 → $4,201, 67 → 68)
- [ ] Refresh page (Ctrl+R)
- [ ] Verify button still says "Already Funded"
- [ ] Try clicking button again (should be disabled)
- [ ] Open new incognito window
- [ ] Go to same project
- [ ] Without connecting wallet, button should say "Connect Wallet to Fund"
- [ ] Connect wallet
- [ ] Button should say "Already Funded" (not "Back this Project")

---

## Next Steps

1. **Try backing a project again**
2. **Open browser console immediately**
3. **Look for error logs**
4. **Check Network tab for /api/verify-transaction response**
5. **Send me the error messages**

Based on the specific error, I can provide the exact fix!
