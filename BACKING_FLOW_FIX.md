# Backing Flow Investigation & Fix

**Date:** December 5, 2025  
**Issue:** Users cannot actually invest $1 on projects - transactions redirect to Solana Devnet instead of SOON Testnet

---

## 🔍 Investigation Findings

### 1. **Critical Issue: Fallback to Solana Devnet**

**Found in:** `/src/app/api/backing/[projectId]/route.ts` (line 60)

```typescript
const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',  // ❌ WRONG FALLBACK
  'confirmed'
)
```

**Problem:** When `NEXT_PUBLIC_SOLANA_RPC_URL` env var is not set or inaccessible server-side, the API falls back to Solana Devnet RPC instead of SOON Testnet.

**Also found in:** `/src/app/api/transactions/verify/route.ts` (line 28)

---

### 2. **Transaction Flow Analysis**

The backing flow works as follows:

1. **User clicks "Back Project"** → `BackProjectButton` component
2. **`useBackProject` hook** creates transaction via `createFundCampaignTransaction()`
3. **Transaction is sent** via `sendTransaction()` from wallet adapter
4. **Connection uses** the endpoint from `WalletContextProvider` (which is correct: SOON RPC)
5. **API records backing** → `/api/backing/[projectId]` POST
6. **API verifies transaction** using its OWN Connection instance with **WRONG FALLBACK**

**The frontend sends transactions to SOON correctly, but the backend API creates its own connection with Solana Devnet fallback.**

---

### 3. **Smart Contract Integration Status**

| Component | Status | Notes |
|-----------|--------|-------|
| Program ID | ✅ Correct | `4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA` |
| IDL | ✅ Correct | Fund discriminator `[218, 188, 111, 221, 152, 113, 174, 7]` |
| PDAs | ✅ Correct | Campaign, Vault, PlatformConfig all derive correctly |
| USDC Mint | ✅ Correct | `3PNhmxDckddYL24zEfrsHLFLXXvrdzBBoZgfRW8rruDs` |

---

### 4. **WalletContextProvider - Frontend**

**Location:** `/src/components/providers/WalletContextProvider.tsx`

```typescript
const SOON_TESTNET_RPC = 'https://rpc.testnet.soo.network/rpc';

const endpoint = useMemo(() => {
  return process.env.NEXT_PUBLIC_SOLANA_RPC_URL || SOON_TESTNET_RPC;
}, []);
```

**Status:** ✅ Frontend is correctly configured for SOON Testnet

---

### 5. **Config Files**

**`/src/lib/solana/config.ts`:**
```typescript
export const RPC_ENDPOINT = 'https://rpc.testnet.soo.network/rpc';  // ✅ Correct
```

**`/src/lib/solana/network-utils.ts`:**
```typescript
export function getRpcEndpoint(): string {
  return process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://rpc.testnet.soo.network/rpc';  // ✅ Correct
}
```

---

## 🔧 Fix Plan

### Fix 1: Update API Route Fallbacks

**Files to fix:**
1. `/src/app/api/backing/[projectId]/route.ts` - Change fallback from `api.devnet.solana.com` to `rpc.testnet.soo.network/rpc`
2. `/src/app/api/transactions/verify/route.ts` - Same fix

### Fix 2: Centralize RPC Configuration

Create a single source of truth for RPC endpoint that both frontend and backend use:
- Use `getRpcEndpoint()` from `network-utils.ts` in API routes

### Fix 3: Verify Environment Variables

Ensure Vercel has proper env vars:
```env
NEXT_PUBLIC_SOLANA_RPC_URL=https://rpc.testnet.soo.network/rpc
NEXT_PUBLIC_SOLANA_NETWORK=soon-testnet
```

---

## 📋 Implementation Checklist

- [x] Fix `/src/app/api/backing/[projectId]/route.ts` - replace Devnet fallback
- [x] Fix `/src/app/api/transactions/verify/route.ts` - replace Devnet fallback  
- [x] Add centralized RPC import to API routes
- [x] Verify all API routes use SOON Testnet RPC
- [x] Test backing flow end-to-end
- [x] Build and verify no errors

---

## 📊 Progress Log

| Time | Action | Status |
|------|--------|--------|
| Start | Investigation complete | ✅ |
| - | Fix Plan created | ✅ |
| - | Implementing fixes | ✅ |
| - | Testing | ✅ |
| - | Build verification | ✅ PASSED |

---

## 🛠️ Changes Made

### 1. `/src/app/api/backing/[projectId]/route.ts`
- Added import: `import { RPC_ENDPOINT } from '@/lib/solana/config'`
- Changed fallback from `'https://api.devnet.solana.com'` to `RPC_ENDPOINT`
- Updated comment: "Verify transaction on SOON Testnet"

### 2. `/src/app/api/transactions/verify/route.ts`
- Added import: `import { RPC_ENDPOINT } from '@/lib/solana/config'`
- Changed fallback from `'https://api.devnet.solana.com'` to `RPC_ENDPOINT`
- Updated comment: "Connect to SOON Testnet"

---

## ✅ Build Result

```
✓ Compiled successfully
✓ Checking validity of types
✓ Generating static pages (59/59)
✓ Collecting build traces
✓ Finalizing page optimization

Route (app)                          Size     First Load JS
├ ƒ /api/backing/[projectId]         251 B    106 kB
├ ƒ /api/transactions/verify         251 B    106 kB
...
```

**All 59 pages built successfully!**

---

## ⚠️ Important Notes

1. **Environment Variables:** Make sure Vercel production has:
   ```
   NEXT_PUBLIC_SOLANA_RPC_URL=https://rpc.testnet.soo.network/rpc
   ```

2. **The transaction flow now correctly:**
   - Frontend sends transactions to SOON Testnet via WalletContextProvider
   - API routes verify transactions on SOON Testnet via RPC_ENDPOINT
   - Explorer links point to `explorer.testnet.soo.network`

3. **For real $1 USDC backing to work, users need:**
   - SOON Testnet SOL for gas fees
   - Test USDC tokens (mint: `3PNhmxDckddYL24zEfrsHLFLXXvrdzBBoZgfRW8rruDs`)

---

*Last Updated: December 5, 2025 - FIX COMPLETE ✅*
