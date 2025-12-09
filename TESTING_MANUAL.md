# 🧪 ODV Manual Testing Guide (v2.0)

**Last Updated:** December 9, 2025
**Environment:** SOON Testnet

This manual provides specific, step-by-step instructions to verify the functionality and UI of the OneDollarVentures platform. It focuses on recent fixes and critical user flows.

---

## 🛠️ 1. Environment Setup

Before testing, ensure your environment is correctly configured.

### 1.1 Wallet Configuration
*   **Extension**: Install **Phantom** or **Solflare**.
*   **Network**: Custom RPC (SOON Testnet)
    *   **RPC URL**: `https://rpc.testnet.soo.network/rpc`
    *   **Chain ID**: `soon-testnet` (if asked)
    *   **Explorer**: `https://explorer.testnet.soo.network`

### 1.2 Test Tokens (USDC)
You need Devnet SOL for gas and Test USDC for funding.
1.  **SOL**: Use the wallet's "Airdrop" feature or a SOON faucet if available.
2.  **USDC**:
    *   Navigate to `http://localhost:3000/faucet`
    *   Click "Request Test USDC".
    *   **Verify**: Check your wallet balance. You should receive 100 USDC.

---

## 🎨 2. UI Verification (Visual Regressions)

Verify the specific UI fixes implemented in the latest patch.

### 2.1 Wallet Button (Split Design)
*   **Location**: Top right of the Header.
*   **State**: Connected.
*   **Test**:
    1.  **Left Side (Address)**:
        *   Hover/Click the address portion (e.g., `7x...3z`).
        *   **Expectation**: Dropdown appears with "Copy Address", "View on Explorer", "Disconnect".
    2.  **Right Side (Avatar)**:
        *   Click the colorful avatar circle.
        *   **Expectation**: Dropdown appears with "Profile", "Settings", "Funded Projects".
    *   **Fix Verification**: Ensure these are two distinct clickable areas, not one big button.

### 2.2 Discover Page Cards
*   **Location**: `/discover`
*   **Test**:
    1.  Observe the project cards.
    2.  **Font Size**: Title should be readable and bold (`text-base`).
    3.  **Padding**: Content inside the card should be compact (`p-3`), not wasting space.
    4.  **Images**: Images should cover the top area without distortion.

### 2.3 Submit Page Icons
*   **Location**: `/submit` (Step 4: Review)
*   **Test**:
    1.  Fill out dummy data for Steps 1-3.
    2.  On Step 4 (Review), look at the "Edit" (Pencil) icons next to each section title.
    3.  **Fix Verification**: Icons should be vertically centered and aligned to the right, not floating awkwardly.

---

## 🔄 3. Functional Testing (Critical Flows)

### 3.1 The "Back Project" Flow (Funding)
**Scenario**: A user funds a project with $1 USDC.

1.  **Navigate**: Go to any active project page (e.g., `/project/[id]`).
2.  **Action**: Click the "Back this Project" button.
3.  **Wallet Interaction**:
    *   Approve the USDC transfer transaction in your wallet.
4.  **Observation (The Fix)**:
    *   **Loading State**: Button shows "Processing...".
    *   **Database Sync**: The system attempts to record the backing in Supabase.
    *   **Timeout Test**: Even if the database is slow, the UI *must* proceed after 15 seconds.
5.  **Success State**:
    *   **Modal**: A success modal appears: "Project Backed Successfully!".
    *   **Explorer Link**: Click "View on Explorer". It should open the transaction hash on the SOON Explorer.
    *   **UI Update**: The "Raised" amount on the page should increment by 1.

### 3.2 The "Submit Project" Flow
**Scenario**: A creator submits a new project.

1.  **Navigate**: `/submit`
2.  **Step 1 (Basics)**: Fill Title, Tagline, Category. Upload an image (or use a URL).
3.  **Step 2 (Details)**: Fill Description, Goal ($100), Deadline.
4.  **Step 3 (Milestones)**: Add one milestone (e.g., "MVP", 100%, $100).
5.  **Step 4 (Review)**: Click "Submit Project".
6.  **Wallet Interaction**:
    *   Approve the `initialize_campaign` transaction.
    *   **Fix Verification**: Ensure no "TokenAccountNotFoundError" occurs. The transaction should simulate successfully.
7.  **Success**:
    *   Redirects to the new Project Page.
    *   Status should be "Active" (or "Draft" depending on logic).

---

## 🐛 4. Edge Case Testing

### 4.1 Network Disconnect
1.  Disconnect your internet or set "Offline" in DevTools > Network.
2.  Try to navigate pages.
3.  **Expectation**: The app should handle errors gracefully (e.g., Error Boundary or Toast notification), not crash with a white screen.

### 4.2 Insufficient Funds
1.  Create a new wallet with 0 SOL and 0 USDC.
2.  Try to Back a Project.
3.  **Expectation**: Wallet should prevent the transaction, or the app should show an "Insufficient Funds" error toast.

---

## 📝 5. Admin & Debugging

### 5.1 Resetting Local State
If you encounter weird caching issues:
1.  Clear Browser Storage (Application > Local Storage).
2.  Disconnect Wallet.
3.  Refresh.

### 5.2 Manual Script Execution
If the UI Faucet fails, use the CLI:
```bash
node scripts/create-test-usdc.js <YOUR_WALLET_ADDRESS>
```
