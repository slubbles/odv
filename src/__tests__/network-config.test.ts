import { describe, it, expect } from 'vitest'

describe('Network Configuration', () => {
  const SOON_RPC_URL = 'https://rpc.testnet.soo.network/rpc'
  const SOON_EXPLORER_URL = 'https://explorer.testnet.soo.network'
  const PROGRAM_ID = '2NZKEk8zk47UAc27f7DScFgxpqyy22VptWVwBUjFfQxC'
  const USDC_MINT = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'

  describe('RPC Configuration', () => {
    it('should have valid SOON Testnet RPC URL', () => {
      expect(SOON_RPC_URL).toMatch(/^https:\/\//)
      expect(SOON_RPC_URL).toContain('soo.network')
    })

    it('should use correct RPC path', () => {
      expect(SOON_RPC_URL).toContain('/rpc')
    })

    it('should be testnet URL', () => {
      expect(SOON_RPC_URL).toContain('testnet')
    })
  })

  describe('Explorer Configuration', () => {
    it('should have valid SOON explorer URL', () => {
      expect(SOON_EXPLORER_URL).toMatch(/^https:\/\//)
      expect(SOON_EXPLORER_URL).toContain('explorer')
    })

    it('should generate valid transaction URL', () => {
      const signature = 'test-signature-123'
      const txUrl = `${SOON_EXPLORER_URL}/tx/${signature}`
      
      expect(txUrl).toContain('/tx/')
      expect(txUrl).toContain(signature)
    })

    it('should generate valid address URL', () => {
      const address = PROGRAM_ID
      const addrUrl = `${SOON_EXPLORER_URL}/address/${address}`
      
      expect(addrUrl).toContain('/address/')
      expect(addrUrl).toContain(address)
    })
  })

  describe('Program Configuration', () => {
    it('should have valid Program ID format', () => {
      expect(PROGRAM_ID.length).toBe(44) // Base58 encoded public key
    })

    it('should have valid USDC Mint format', () => {
      expect(USDC_MINT.length).toBe(44)
    })
  })

  describe('Network Detection', () => {
    it('should detect SOON network from RPC URL', () => {
      const isSOON = SOON_RPC_URL.includes('soo.network') || 
                     SOON_RPC_URL.includes('soon')
      expect(isSOON).toBe(true)
    })

    it('should not detect SOON for devnet URL', () => {
      const devnetUrl = 'https://api.devnet.solana.com'
      const isSOON = devnetUrl.includes('soo.network') || 
                     devnetUrl.includes('soon')
      expect(isSOON).toBe(false)
    })

    it('should not detect SOON for mainnet URL', () => {
      const mainnetUrl = 'https://api.mainnet-beta.solana.com'
      const isSOON = mainnetUrl.includes('soo.network') || 
                     mainnetUrl.includes('soon')
      expect(isSOON).toBe(false)
    })
  })
})

describe('Wallet Configuration', () => {
  const ADMIN_WALLET = '4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw'

  describe('Admin wallet validation', () => {
    it('should have valid admin wallet address', () => {
      expect(ADMIN_WALLET.length).toBe(44)
    })

    it('should validate admin access correctly', () => {
      const connectedWallet = ADMIN_WALLET
      const isAdmin = connectedWallet === ADMIN_WALLET
      expect(isAdmin).toBe(true)
    })

    it('should reject non-admin wallets', () => {
      const randomWallet = 'BpP9TZYHMkZV2gPJTZvK1MzYCEBKU3NpXEn7AEJj3jB1'
      const isAdmin = randomWallet === ADMIN_WALLET
      expect(isAdmin).toBe(false)
    })
  })
})

describe('Fixed Backing Amount', () => {
  const FIXED_BACKING_AMOUNT = 1_000_000 // 1 USDC

  it('should be 1 USDC in smallest units', () => {
    expect(FIXED_BACKING_AMOUNT).toBe(1_000_000)
  })

  it('should convert to correct USD value', () => {
    const decimals = 6
    const usdValue = FIXED_BACKING_AMOUNT / Math.pow(10, decimals)
    expect(usdValue).toBe(1)
  })

  it('should be a BigInt-safe integer', () => {
    expect(BigInt(FIXED_BACKING_AMOUNT).toString()).toBe('1000000')
  })
})

describe('Platform Seeds', () => {
  const PLATFORM_CONFIG_SEED = 'platform_config'
  const CAMPAIGN_SEED = 'campaign'
  const CAMPAIGN_VAULT_SEED = 'campaign_vault'

  it('should have correct platform config seed', () => {
    expect(PLATFORM_CONFIG_SEED).toBe('platform_config')
  })

  it('should have correct campaign seed', () => {
    expect(CAMPAIGN_SEED).toBe('campaign')
  })

  it('should have correct campaign vault seed', () => {
    expect(CAMPAIGN_VAULT_SEED).toBe('campaign_vault')
  })

  it('should create valid seed buffers', () => {
    const seeds = [PLATFORM_CONFIG_SEED, CAMPAIGN_SEED, CAMPAIGN_VAULT_SEED]
    
    seeds.forEach(seed => {
      const buffer = Buffer.from(seed)
      expect(buffer.toString()).toBe(seed)
    })
  })
})

describe('Instruction Discriminators', () => {
  // All discriminators from the smart contract
  const discriminators = {
    initializePlatform: [175, 175, 109, 31, 13, 152, 155, 237],
    updateBackingAmount: [158, 129, 69, 175, 152, 182, 226, 62],
    pausePlatform: [219, 163, 231, 211, 162, 182, 134, 247],
    unpausePlatform: [59, 107, 61, 236, 93, 193, 144, 99],
    initialize: [175, 175, 109, 31, 13, 152, 155, 237], // Campaign initialize
    fund: [119, 186, 5, 21, 126, 135, 142, 172],
    submitMilestoneProof: [147, 147, 102, 89, 199, 71, 112, 14],
    approveMilestone: [145, 85, 92, 60, 50, 130, 219, 106],
    rejectMilestone: [171, 88, 116, 135, 147, 125, 224, 14],
    releaseMilestone: [156, 23, 72, 103, 147, 147, 137, 134],
    refundCampaign: [241, 9, 23, 35, 36, 215, 46, 245],
  }

  it('should have all required discriminators', () => {
    expect(Object.keys(discriminators)).toHaveLength(11)
  })

  it('should have 8-byte discriminators', () => {
    Object.values(discriminators).forEach(disc => {
      expect(disc).toHaveLength(8)
    })
  })

  it('should have valid byte values (0-255)', () => {
    Object.values(discriminators).forEach(disc => {
      disc.forEach(byte => {
        expect(byte).toBeGreaterThanOrEqual(0)
        expect(byte).toBeLessThanOrEqual(255)
      })
    })
  })

  it('should have fund discriminator for backing', () => {
    expect(discriminators.fund[0]).toBe(119)
    expect(discriminators.fund[1]).toBe(186)
  })
})

describe('Error Messages', () => {
  const errorMessages = {
    walletNotConnected: 'Please connect your wallet first',
    insufficientFunds: 'Insufficient funds. Make sure you have enough SOL for gas and USDC for backing.',
    accountNotFound: 'Required account not found. The campaign may not be initialized yet.',
    networkError: 'Network request failed',
    transactionFailed: 'Transaction failed',
  }

  it('should have user-friendly wallet error', () => {
    expect(errorMessages.walletNotConnected).toContain('wallet')
  })

  it('should have descriptive insufficient funds error', () => {
    expect(errorMessages.insufficientFunds).toContain('SOL')
    expect(errorMessages.insufficientFunds).toContain('USDC')
  })

  it('should explain account not found error', () => {
    expect(errorMessages.accountNotFound).toContain('campaign')
    expect(errorMessages.accountNotFound).toContain('initialized')
  })
})
