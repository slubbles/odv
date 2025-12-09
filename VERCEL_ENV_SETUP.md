# 🚀 Vercel Environment Variables Setup

## **Copy-Paste Ready Configuration**

Go to your Vercel project settings:
```
https://vercel.com/[your-username]/odv/settings/environment-variables
```

---

## **Required Environment Variables**

### **1. Supabase Configuration**

**Variable Name:**
```
NEXT_PUBLIC_SUPABASE_URL
```

**Value:**
```
https://zsfujmvltpumleszcrwh.supabase.co
```

---

**Variable Name:**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Value:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZnVqbXZsdHB1bWxlc3pjcndoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NjY1MjIsImV4cCI6MjA3OTQ0MjUyMn0.Oo17LARoqRirRqtX_RZtouINBzyTRiUv3mSM6e3zNQM
```

---

### **2. Solana / SOON Network**

**Variable Name:**
```
NEXT_PUBLIC_SOLANA_RPC_URL
```

**Value:**
```
https://rpc.testnet.soo.network/rpc
```

---

**Variable Name:**
```
NEXT_PUBLIC_NETWORK
```

**Value:**
```
devnet
```

---

### **3. Supabase Service Role Key** ⚠️ **CRITICAL**

**Variable Name:**
```
SUPABASE_SERVICE_ROLE_KEY
```

**Value:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZnVqbXZsdHB1bWxlc3pjcndoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzg2NjUyMiwiZXhwIjoyMDc5NDQyNTIyfQ.PNToAb5TR16zTNF0MogXQyYKYTh2X1cNRtLO1D0J-Tw
```

**⚠️ IMPORTANT**: Make sure to check "Production", "Preview", and "Development" when adding this variable.

---

## **Quick Setup Steps**

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables

2. **Add each variable above** by:
   - Click "Add New"
   - Paste the Variable Name
   - Paste the Value
   - Select all environments (Production, Preview, Development)
   - Click "Save"

3. **Redeploy** your project:
   - Go to Deployments tab
   - Click the three dots on the latest deployment
   - Click "Redeploy"

---

## **Verification**

After redeploying, test the following:

### ✅ **Backing a Project**
1. Go to any project page
2. Click "Back this Project"
3. Approve transaction in wallet
4. **Expected**: Progress modal shows → Transaction confirms → Success message
5. **If fails**: Check Vercel logs for "Missing Supabase Service Role Key"

### ✅ **Submitting a Project**
1. Go to `/submit`
2. Fill out all 4 steps
3. Click "Submit Project"
4. Approve transaction in wallet
5. **Expected**: Redirects to new project page
6. **If fails**: Check browser console for specific error message

---

## **Troubleshooting**

### **"Failed to record backer" error**
- The `SUPABASE_SERVICE_ROLE_KEY` is not set or is incorrect
- Go to Vercel → Settings → Environment Variables
- Verify the key matches the one above exactly
- Redeploy

### **"Campaign already exists" error**
- Each wallet can only create one campaign
- Try with a different wallet
- Or delete the existing campaign from Supabase dashboard

### **"Insufficient SOL" error**
- Your wallet needs ~0.01 SOL to cover fees
- Use the faucet at `/faucet` to get test SOL

---

**Last Updated**: December 9, 2025
