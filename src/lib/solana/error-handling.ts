/**
 * Blockchain Error Handling Utilities
 * 
 * Provides user-friendly error messages and recovery suggestions
 * for common Solana/SOON blockchain errors.
 */

export type BlockchainErrorType = 
  | 'INSUFFICIENT_FUNDS'
  | 'INSUFFICIENT_SOL'
  | 'WALLET_NOT_CONNECTED'
  | 'USER_REJECTED'
  | 'NETWORK_ERROR'
  | 'PROGRAM_ERROR'
  | 'ACCOUNT_NOT_FOUND'
  | 'INVALID_ACCOUNT'
  | 'TRANSACTION_TIMEOUT'
  | 'SIMULATION_FAILED'
  | 'BLOCKHASH_EXPIRED'
  | 'RATE_LIMITED'
  | 'UNKNOWN';

export interface BlockchainError {
  type: BlockchainErrorType;
  message: string;
  userMessage: string;
  suggestion: string;
  recoverable: boolean;
  originalError?: Error;
}

/**
 * Common Solana program error codes
 */
const PROGRAM_ERROR_CODES: Record<number, { message: string; suggestion: string }> = {
  0x0: { message: 'Generic error', suggestion: 'Please try again or contact support.' },
  0x1: { message: 'Insufficient funds', suggestion: 'Ensure you have enough USDC in your wallet.' },
  0x2: { message: 'Invalid mint', suggestion: 'The token mint address is invalid.' },
  0x3: { message: 'Invalid owner', suggestion: 'Token account ownership verification failed.' },
  0x1770: { message: 'Campaign not active', suggestion: 'This campaign is no longer accepting funds.' },
  0x1771: { message: 'Campaign goal already met', suggestion: 'This campaign has reached its funding goal.' },
  0x1772: { message: 'Campaign deadline passed', suggestion: 'The funding deadline for this campaign has passed.' },
  0x1773: { message: 'Invalid funding amount', suggestion: 'The funding amount must be exactly $1 USDC.' },
  0x1774: { message: 'Platform paused', suggestion: 'The platform is temporarily paused. Please try again later.' },
  0x1775: { message: 'Not authorized', suggestion: 'You do not have permission to perform this action.' },
  0x1776: { message: 'Milestone not approved', suggestion: 'This milestone has not been approved for release.' },
  0x1777: { message: 'Already funded', suggestion: 'You have already funded this campaign.' },
};

/**
 * Parse an error and return a user-friendly BlockchainError
 */
export function parseBlockchainError(error: unknown): BlockchainError {
  const errorString = error instanceof Error ? error.message : String(error);
  const errorLower = errorString.toLowerCase();

  // Check for user rejection
  if (
    errorLower.includes('user rejected') ||
    errorLower.includes('user denied') ||
    errorLower.includes('user cancelled') ||
    errorLower.includes('transaction was rejected')
  ) {
    return {
      type: 'USER_REJECTED',
      message: 'Transaction rejected by user',
      userMessage: 'Transaction cancelled',
      suggestion: 'Click "Fund Project" again when you\'re ready to approve the transaction.',
      recoverable: true,
      originalError: error instanceof Error ? error : undefined,
    };
  }

  // Check for wallet not connected
  if (
    errorLower.includes('wallet not connected') ||
    errorLower.includes('no wallet') ||
    errorLower.includes('wallet disconnected')
  ) {
    return {
      type: 'WALLET_NOT_CONNECTED',
      message: 'Wallet not connected',
      userMessage: 'Please connect your wallet',
      suggestion: 'Click the "Select Wallet" button to connect your Phantom wallet.',
      recoverable: true,
      originalError: error instanceof Error ? error : undefined,
    };
  }

  // Check for simulation failure FIRST (before generic insufficient funds check)
  // This ensures we parse custom program error codes properly
  if (errorLower.includes('simulation failed') || errorLower.includes('preflight')) {
    // Try to extract program error code
    const codeMatch = errorString.match(/custom program error: (0x[0-9a-fA-F]+)/i);
    if (codeMatch) {
      const code = parseInt(codeMatch[1], 16);
      const programError = PROGRAM_ERROR_CODES[code];
      if (programError) {
        return {
          type: 'PROGRAM_ERROR',
          message: programError.message,
          userMessage: programError.message,
          suggestion: programError.suggestion,
          recoverable: false,
          originalError: error instanceof Error ? error : undefined,
        };
      }
    }

    return {
      type: 'SIMULATION_FAILED',
      message: 'Transaction simulation failed',
      userMessage: 'Transaction cannot be completed',
      suggestion: 'The transaction failed validation. This might be because the campaign is inactive or you\'ve already funded it.',
      recoverable: false,
      originalError: error instanceof Error ? error : undefined,
    };
  }

  // Check for insufficient SOL (for transaction fees)
  if (
    errorLower.includes('insufficient lamports') ||
    errorLower.includes('insufficient funds for rent') ||
    (errorLower.includes('insufficient') && errorLower.includes('sol'))
  ) {
    return {
      type: 'INSUFFICIENT_SOL',
      message: 'Insufficient SOL for transaction fees',
      userMessage: 'Not enough SOL for fees',
      suggestion: 'You need SOL to pay for transaction fees. Get test SOL from the SOON faucet.',
      recoverable: true,
      originalError: error instanceof Error ? error : undefined,
    };
  }

  // Check for insufficient token balance (USDC) - but not if it's a simulation failure
  if (
    (errorLower.includes('insufficient funds') ||
    errorLower.includes('insufficient balance')) &&
    !errorLower.includes('simulation')
  ) {
    return {
      type: 'INSUFFICIENT_FUNDS',
      message: 'Insufficient USDC balance',
      userMessage: 'Not enough USDC',
      suggestion: 'You need at least $1 USDC to fund this project. Get test USDC from the faucet.',
      recoverable: true,
      originalError: error instanceof Error ? error : undefined,
    };
  }

  // Check for network errors
  if (
    errorLower.includes('network') ||
    errorLower.includes('connection') ||
    errorLower.includes('failed to fetch') ||
    errorLower.includes('timeout') ||
    errorLower.includes('econnrefused')
  ) {
    return {
      type: 'NETWORK_ERROR',
      message: 'Network connection error',
      userMessage: 'Connection failed',
      suggestion: 'Check your internet connection and try again. The SOON network may be experiencing issues.',
      recoverable: true,
      originalError: error instanceof Error ? error : undefined,
    };
  }

  // Check for blockhash expiration
  if (
    errorLower.includes('blockhash') ||
    errorLower.includes('block height exceeded')
  ) {
    return {
      type: 'BLOCKHASH_EXPIRED',
      message: 'Transaction blockhash expired',
      userMessage: 'Transaction expired',
      suggestion: 'The transaction took too long. Please try again.',
      recoverable: true,
      originalError: error instanceof Error ? error : undefined,
    };
  }

  // Check for account not found
  if (
    errorLower.includes('account not found') ||
    errorLower.includes('account does not exist')
  ) {
    return {
      type: 'ACCOUNT_NOT_FOUND',
      message: 'Required account not found',
      userMessage: 'Campaign not found',
      suggestion: 'This campaign may not be initialized on-chain yet. Please contact support.',
      recoverable: false,
      originalError: error instanceof Error ? error : undefined,
    };
  }

  // Check for rate limiting
  if (
    errorLower.includes('rate limit') ||
    errorLower.includes('too many requests') ||
    errorLower.includes('429')
  ) {
    return {
      type: 'RATE_LIMITED',
      message: 'Rate limited by RPC',
      userMessage: 'Too many requests',
      suggestion: 'Please wait a moment and try again.',
      recoverable: true,
      originalError: error instanceof Error ? error : undefined,
    };
  }

  // Default unknown error
  return {
    type: 'UNKNOWN',
    message: errorString,
    userMessage: 'Something went wrong',
    suggestion: 'Please try again. If the problem persists, contact support.',
    recoverable: true,
    originalError: error instanceof Error ? error : undefined,
  };
}

/**
 * Check if an error is recoverable (user can retry)
 */
export function isRecoverableError(error: unknown): boolean {
  const parsed = parseBlockchainError(error);
  return parsed.recoverable;
}

/**
 * Get a user-friendly error message
 */
export function getUserFriendlyError(error: unknown): string {
  const parsed = parseBlockchainError(error);
  return parsed.userMessage;
}

/**
 * Get recovery suggestion for an error
 */
export function getErrorSuggestion(error: unknown): string {
  const parsed = parseBlockchainError(error);
  return parsed.suggestion;
}

/**
 * Format error for logging (includes technical details)
 */
export function formatErrorForLogging(error: unknown): string {
  const parsed = parseBlockchainError(error);
  return `[${parsed.type}] ${parsed.message}${parsed.originalError ? ` | Original: ${parsed.originalError.message}` : ''}`;
}
