# 🚀 Gas Sponsorship Deployment Checklist

## ✅ Pre-Deployment (All Complete!)

- [x] Relayer wallet generated
- [x] Relayer wallet funded (1 SOL)
- [x] Backend relay endpoints created
- [x] Frontend hook updated
- [x] Transaction creation function updated
- [x] Fallback mechanism implemented
- [x] Rate limiting added
- [x] Balance monitoring script created
- [x] Security measures in place
- [x] No TypeScript errors
- [x] Local .env.local configured

## 📋 Deployment Steps

### Step 1: Add Vercel Environment Variable
```
1. Go to: https://vercel.com/slubbles/odv/settings/environment-variables
2. Add new variable:
   Name: RELAYER_PRIVATE_KEY_BASE64
   Value: LviCL5eJL8sXTPpJ0pM57jq/lP5MBgMBqz4CnXAO15jgMQlr0ee2VwhM28CuVRfy5s6n4oIKApvkCHO4UG/AQQ==
   Environment: Production (and Preview if needed)
3. Click "Save"
```

### Step 2: Commit and Push
```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: implement gas sponsorship - users only need USDC

- Add relay endpoints for gas-sponsored transactions
- Update use-back-project hook to use relay
- Add fallback to direct method if relay unavailable
- Implement rate limiting (10 backings/hour per wallet)
- Add relayer balance monitoring script
- Security: input validation, replay protection, private key safety"

# Push to trigger Vercel deployment
git push origin master
```

### Step 3: Verify Vercel Deployment
```
1. Watch deployment at: https://vercel.com/slubbles/odv
2. Wait for "Building..." → "Deploying..." → "Ready"
3. Check deployment logs for errors
4. Verify environment variable loaded (no "RELAYER_PRIVATE_KEY_BASE64 not configured" errors)
```

### Step 4: Test on Production
```
1. Visit production URL
2. Connect wallet with USDC (no SOL needed)
3. Navigate to any active project
4. Click "Back Project"
5. Approve transaction (should NOT show gas fee)
6. Verify transaction completes
7. Check backend logs in Vercel:
   - Look for "[Relay] Gas used: X SOL"
   - Look for "Gas sponsored by platform"
```

### Step 5: Monitor Relayer Balance
```bash
# Run balance check
bash scripts/check-relayer-balance.sh

# Expected output:
# Current Balance: ~1 SOL (or slightly less after test)
# Estimated Backings Remaining: ~1300+
# ✅ Balance is healthy
```

## 🧪 Post-Deployment Testing

### Test Case 1: Normal Backing (Happy Path)
```
1. User has USDC, no SOL
2. Clicks "Back Project"
3. Wallet shows transaction to sign (no gas fee)
4. User approves
5. Transaction completes successfully
6. Database records backing
7. User sees success message

Expected: ✅ SUCCESS
```

### Test Case 2: User Rejects Transaction
```
1. User clicks "Back Project"
2. Wallet popup appears
3. User clicks "Cancel"
4. Should show: "Transaction cancelled by user"

Expected: ✅ Graceful error message
```

### Test Case 3: Rate Limit
```
1. Same wallet backs 11 projects in 1 hour
2. 11th attempt should fail
3. Should show: "Rate limit exceeded"

Expected: ✅ Rate limit working
```

### Test Case 4: Insufficient USDC
```
1. User has no USDC
2. Clicks "Back Project"
3. Should show: "You need to have USDC"

Expected: ✅ Clear error message
```

### Test Case 5: Relay Unavailable (Fallback)
```
1. Temporarily remove env var from Vercel
2. User backs project
3. Should fall back to direct method
4. User pays gas from their SOL

Expected: ✅ Fallback works, no service disruption
```

## 📊 Monitoring (First 24 Hours)

### Metrics to Watch
- [ ] Number of backings processed
- [ ] Relayer balance consumption rate
- [ ] Any rate limit triggers
- [ ] Error rate in logs
- [ ] User support tickets (should decrease)

### Check Relayer Balance
```bash
# Check every 6 hours initially
bash scripts/check-relayer-balance.sh

# If balance < 0.3 SOL:
~/.local/share/solana/install/active_release/bin/solana transfer \
  G69hBDyPLCb29s4WVe6AcoiiJyjNHxAkhx2PYwzLeR6g \
  1 \
  --url https://rpc.testnet.soo.network/rpc
```

### Vercel Logs
```
1. Visit: https://vercel.com/slubbles/odv/logs
2. Filter: "relay" or "gas"
3. Look for:
   - "[Relay] Gas used: X SOL"
   - "⚠️ WARNING: Relayer balance getting low"
   - "🚨 CRITICAL: RELAYER BALANCE LOW"
```

## 🎯 Success Criteria

✅ Deployment successful when:
- [ ] Vercel deployment shows "Ready"
- [ ] Environment variable configured
- [ ] Test backing completes without user needing SOL
- [ ] Backend logs show "Gas sponsored by platform"
- [ ] Relayer balance decreases by ~0.00075 SOL per backing
- [ ] No errors in Vercel logs
- [ ] Database records backing correctly

## 🚨 Rollback Plan (If Needed)

If gas sponsorship causes issues:

```bash
# Option 1: Revert to previous commit
git revert HEAD
git push origin master

# Option 2: Remove env var from Vercel
# System will automatically fall back to direct method
# Users pay gas themselves (legacy behavior)
```

## 📞 Emergency Contacts

### If Relayer Runs Out
1. Add env var to local: `.env.local`
2. Refill relayer:
```bash
~/.local/share/solana/install/active_release/bin/solana transfer \
  G69hBDyPLCb29s4WVe6AcoiiJyjNHxAkhx2PYwzLeR6g \
  1 \
  --url https://rpc.testnet.soo.network/rpc
```

### If Relay Endpoint Fails
1. Check Vercel logs for errors
2. Verify env var is set
3. System falls back to direct method automatically
4. No user-facing service disruption

---

## 🎉 Ready to Deploy!

All code complete, tested locally, monitoring tools ready.

**Next Action**: Add env var to Vercel, then `git push origin master`

**Expected Result**: Users can back projects with ONLY USDC - no SOL needed! 🚀
