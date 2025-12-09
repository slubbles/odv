# ⚠️ VERCEL ENVIRONMENT VARIABLE NOT LOADED

## **The Issue**

From the console logs, we can see:
```
/api/verify-transaction:1  Failed to load resource: the server responded with a status of 500 ()
Verification/Recording error: Error: Failed to record backer
```

This means the `SUPABASE_SERVICE_ROLE_KEY` environment variable is **NOT loaded on Vercel**.

---

## **Why Is This Happening?**

When you add environment variables to Vercel, they are **only applied to NEW deployments**. Simply redeploying the same build **does not pick up new environment variables**.

---

## **How To Fix (Choose ONE method)**

### **Method 1: Force Redeploy with New Environment Variables** ⭐ RECOMMENDED

1. Go to: https://vercel.com/[your-username]/odv/settings/environment-variables

2. **Verify all 5 variables are added** (especially `SUPABASE_SERVICE_ROLE_KEY`)

3. Go to: https://vercel.com/[your-username]/odv

4. Click **"Deployments"** tab

5. Find the latest deployment

6. Click **"..."** (three dots) → **"Redeploy"**

7. ✅ **IMPORTANT**: Check the box that says **"Use existing Build Cache"** is **UNCHECKED**
   - This forces a fresh build with new environment variables

8. Click **"Redeploy"**

9. Wait for deployment to complete (~2-3 minutes)

10. Test backing a project again

---

### **Method 2: Push a New Commit (Triggers Auto-Deploy)**

Since you have Git integration, pushing a new commit will trigger a fresh deployment:

```bash
# Make a small change (like adding a comment)
echo "# Trigger redeploy" >> README.md

# Commit and push
git add README.md
git commit -m "chore: trigger redeploy with env vars"
git push origin codespace-obscure-chainsaw-949rv9wpq6rfxrjj
```

This will automatically trigger a new Vercel deployment with the environment variables.

---

## **How To Verify Environment Variables Are Loaded**

After redeploying, check the Vercel deployment logs:

1. Go to the deployment
2. Click on "Functions" tab
3. Find `/api/verify-transaction`
4. Click "View Logs"
5. Look for any startup messages or errors

**OR** test by backing a project and checking the Network tab:
- Open DevTools (F12) → Network tab
- Click "Back this Project"
- Look for the `/api/verify-transaction` request
- If it returns **200 OK** → Environment variable is loaded ✅
- If it returns **500** → Environment variable is still missing ❌

---

## **Current Workaround**

The app has a fallback mechanism:
- If `/api/verify-transaction` fails (500 error)
- It tries the old `/api/backing/[projectId]` endpoint
- This uses the anon key (which works for inserts)

**However**, this fallback means:
- ❌ No transaction verification (security risk)
- ❌ No replay attack prevention
- ❌ Less reliable error handling

**So the proper fix is to load the service role key on Vercel.**

---

## **Quick Test Command**

After redeploying, run this from your browser console on the live site:

```javascript
fetch('https://your-site.vercel.app/api/verify-transaction', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    signature: 'test',
    projectId: 'test',
    amount: 1,
    backerWallet: 'test'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

**Expected response if env var is loaded**:
```json
{
  "error": "Invalid transaction signature" 
}
```

**If env var is NOT loaded**:
```json
{
  "error": "Failed to record backer"
}
```

---

**Last Updated**: December 9, 2025
