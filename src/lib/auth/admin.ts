/**
 * Admin Authentication & Authorization
 * 
 * Defines admin wallet addresses and provides utilities for checking admin access.
 */

// Admin wallet addresses (add more as needed)
// These wallets have full admin access to approve/reject projects
export const ADMIN_WALLETS = [
  '4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw', // Platform admin from config
  // Add more admin wallets here as needed
] as const;

/**
 * Check if a wallet address is an admin
 */
export function isAdminWallet(walletAddress: string | null | undefined): boolean {
  if (!walletAddress) return false;
  return ADMIN_WALLETS.includes(walletAddress as any);
}

/**
 * Get admin status message
 */
export function getAdminStatusMessage(walletAddress: string | null | undefined): string {
  if (!walletAddress) {
    return 'Please connect your wallet to access the admin panel.';
  }
  if (!isAdminWallet(walletAddress)) {
    return 'Your wallet is not authorized to access the admin panel.';
  }
  return 'Welcome, Admin!';
}
