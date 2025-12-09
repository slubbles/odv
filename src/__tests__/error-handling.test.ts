import { describe, it, expect } from 'vitest'
import {
  parseBlockchainError,
  isRecoverableError,
  getUserFriendlyError,
  getErrorSuggestion,
  formatErrorForLogging,
  BlockchainErrorType,
} from '@/lib/solana/error-handling'

describe('Blockchain Error Handling', () => {
  describe('parseBlockchainError', () => {
    it('should detect user rejection errors', () => {
      const errors = [
        new Error('User rejected the request'),
        new Error('Transaction was rejected by user'),
        new Error('User denied transaction signature'),
        new Error('User cancelled'),
      ]

      errors.forEach((error) => {
        const result = parseBlockchainError(error)
        expect(result.type).toBe('USER_REJECTED')
        expect(result.recoverable).toBe(true)
      })
    })

    it('should detect wallet not connected errors', () => {
      const errors = [
        new Error('Wallet not connected'),
        new Error('No wallet found'),
        new Error('Wallet disconnected'),
      ]

      errors.forEach((error) => {
        const result = parseBlockchainError(error)
        expect(result.type).toBe('WALLET_NOT_CONNECTED')
        expect(result.recoverable).toBe(true)
      })
    })

    it('should detect insufficient SOL errors', () => {
      const errors = [
        new Error('Insufficient lamports'),
        new Error('insufficient funds for rent'),
        new Error('Insufficient SOL balance'),
      ]

      errors.forEach((error) => {
        const result = parseBlockchainError(error)
        expect(result.type).toBe('INSUFFICIENT_SOL')
        expect(result.recoverable).toBe(true)
      })
    })

    it('should detect insufficient USDC/token errors', () => {
      const errors = [
        new Error('Insufficient funds'),
        new Error('Insufficient balance'),
      ]

      errors.forEach((error) => {
        const result = parseBlockchainError(error)
        expect(result.type).toBe('INSUFFICIENT_FUNDS')
        expect(result.recoverable).toBe(true)
      })
    })

    it('should detect network errors', () => {
      const errors = [
        new Error('Network error'),
        new Error('Connection refused'),
        new Error('Failed to fetch'),
        new Error('Request timeout'),
        new Error('ECONNREFUSED'),
      ]

      errors.forEach((error) => {
        const result = parseBlockchainError(error)
        expect(result.type).toBe('NETWORK_ERROR')
        expect(result.recoverable).toBe(true)
      })
    })

    it('should detect blockhash expiration', () => {
      const errors = [
        new Error('Blockhash not found'),
        new Error('Block height exceeded'),
      ]

      errors.forEach((error) => {
        const result = parseBlockchainError(error)
        expect(result.type).toBe('BLOCKHASH_EXPIRED')
        expect(result.recoverable).toBe(true)
      })
    })

    it('should detect simulation failures', () => {
      const result = parseBlockchainError(new Error('Transaction simulation failed'))
      expect(result.type).toBe('SIMULATION_FAILED')
      expect(result.recoverable).toBe(false)
    })

    it('should detect account not found errors', () => {
      const errors = [
        new Error('Account not found'),
        new Error('Account does not exist'),
      ]

      errors.forEach((error) => {
        const result = parseBlockchainError(error)
        expect(result.type).toBe('ACCOUNT_NOT_FOUND')
        expect(result.recoverable).toBe(false)
      })
    })

    it('should detect rate limiting', () => {
      const errors = [
        new Error('Rate limit exceeded'),
        new Error('Too many requests'),
        new Error('HTTP 429'),
      ]

      errors.forEach((error) => {
        const result = parseBlockchainError(error)
        expect(result.type).toBe('RATE_LIMITED')
        expect(result.recoverable).toBe(true)
      })
    })

    it('should return UNKNOWN for unrecognized errors', () => {
      const result = parseBlockchainError(new Error('Something completely random happened'))
      expect(result.type).toBe('UNKNOWN')
      expect(result.recoverable).toBe(true)
    })

    it('should handle non-Error objects', () => {
      const result = parseBlockchainError('string error')
      expect(result.type).toBe('UNKNOWN')
      expect(result.message).toBe('string error')
    })

    it('should include original error when available', () => {
      const originalError = new Error('User rejected')
      const result = parseBlockchainError(originalError)
      expect(result.originalError).toBe(originalError)
    })
  })

  describe('isRecoverableError', () => {
    it('should return true for recoverable errors', () => {
      const recoverableErrors = [
        new Error('User rejected'),
        new Error('Network error'),
        new Error('Rate limit'),
        new Error('Blockhash expired'),
      ]

      recoverableErrors.forEach((error) => {
        expect(isRecoverableError(error)).toBe(true)
      })
    })

    it('should return false for non-recoverable errors', () => {
      const nonRecoverableErrors = [
        new Error('Transaction simulation failed'),
        new Error('Account not found'),
      ]

      nonRecoverableErrors.forEach((error) => {
        expect(isRecoverableError(error)).toBe(false)
      })
    })
  })

  describe('getUserFriendlyError', () => {
    it('should return user-friendly messages', () => {
      expect(getUserFriendlyError(new Error('User rejected the request'))).toBe('Transaction cancelled')
      expect(getUserFriendlyError(new Error('Wallet not connected'))).toBe('Please connect your wallet')
      expect(getUserFriendlyError(new Error('Network error'))).toBe('Connection failed')
    })
  })

  describe('getErrorSuggestion', () => {
    it('should return helpful suggestions', () => {
      const suggestion = getErrorSuggestion(new Error('Insufficient lamports'))
      expect(suggestion).toContain('SOL')
      expect(suggestion).toContain('faucet')
    })

    it('should suggest reconnecting for user rejection', () => {
      const suggestion = getErrorSuggestion(new Error('User rejected'))
      expect(suggestion).toContain('again')
    })
  })

  describe('formatErrorForLogging', () => {
    it('should format errors with type prefix', () => {
      const formatted = formatErrorForLogging(new Error('User rejected'))
      expect(formatted).toContain('[USER_REJECTED]')
    })

    it('should include original error message', () => {
      const formatted = formatErrorForLogging(new Error('Some network error occurred'))
      expect(formatted).toContain('NETWORK_ERROR')
    })
  })

  describe('Program Error Codes', () => {
    it('should parse custom program error codes from simulation failure', () => {
      const error = new Error('Transaction simulation failed: custom program error: 0x1770')
      const result = parseBlockchainError(error)
      expect(result.type).toBe('PROGRAM_ERROR')
      expect(result.message).toBe('Campaign not active')
    })

    it('should handle platform paused error', () => {
      const error = new Error('Transaction simulation failed: custom program error: 0x1774')
      const result = parseBlockchainError(error)
      expect(result.type).toBe('PROGRAM_ERROR')
      expect(result.message).toBe('Platform paused')
      expect(result.recoverable).toBe(false)
    })
  })
})
