# 🧪 ODV Manual Testing Guide (v3.0)

**Last Updated:** December 9, 2025
**Environment:** SOON Testnet

This manual provides step-by-step instructions to verify the core functionality of the OneDollarVentures platform, including the newly implemented server-side transaction verification.

---

## 🛠️ 1. Environment Setup

### 1.1 Wallet Configuration
*   **Extension**: Phantom or Solflare.
*   **Network**: SOON Testnet
    *   **RPC URL**: `https://rpc.testnet.soo.network/rpc`
    *   **Explorer**: `https://explorer.testnet.soo.network`

### 1.2 Test Tokens
1.  **SOL**: Airdrop via wallet or faucet for gas fees.
2.  **USDC**: Use the internal faucet at `/faucet` to get 100 Test USDC.

---

## 🔄 2. Core User Flows

### 2.1 The "Back Project" Flow (Secure Funding)
**Goal**: Verify that funding works and is verified securely on the server.

1.  **Navigate**: Go to any active project page.
2.  **Action**: Click "Back this Project".
3.  **Wallet**: Approve the transaction.
4.  **Verification (New)**:
    *   The UI will show "Verifying & Recording...".
    *   Internally, the app sends the signature to `/api/verify-transaction`.
    *   The server confirms the transaction on-chain before recording it.
5.  **Success**:
    *   Success modal appears.
    *   "Raised" amount updates.
    *   **Check**: Refresh the page. You should see "You have backed this project" (if logic allows single backing) or the stats persist.

### 2.2 The "Submit Project" Flow
**Goal**: Verify a creator can launch a campaign.

1.  **Navigate**: `/submit`
2.  **Form**: Fill out the 4-step wizard.
    *   *Tip*: Use a dummy image URL like `https://placehold.co/600x400`.
3.  **Action**: Click "Submit Project".
4.  **Wallet**: Approve the `initialize_campaign` transaction.
5.  **Success**: Redirects to the new project page. Status should be "Active".

### 2.3 The "Visitor" Flow (Read-Only)
**Goal**: Verify data fetching (powered by React Query).

1.  **Navigate**: `/discover`
2.  **Action**: Click on a project card.
3.  **Check**:
    *   Project details load instantly (or with a skeleton loader).
    *   Tabs (Story, Milestones, Updates) switch without page reloads.
    *   "Backers" list is visible.

---

## 🐛 3. Edge Case Testing

### 3.1 Insufficient Funds
1.  Use a wallet with 0 USDC.
2.  Attempt to back a project.
3.  **Expectation**: The transaction simulation should fail, or the wallet should warn you. The UI should show a readable error message.

### 3.2 Network Resilience
1.  Disconnect network while on a project page.
2.  Try to switch tabs.
3.  **Expectation**: The app should not crash. React Query will attempt to refetch when connection is restored.

---

## 📝 4. Admin Tools

### 4.1 Manual Faucet
If the UI faucet fails, run:
```bash
node scripts/create-test-usdc.js <YOUR_WALLET_ADDRESS>
```
