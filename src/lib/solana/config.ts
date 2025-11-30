import { PublicKey } from '@solana/web3.js';

// Solana Devnet Configuration
export const PROGRAM_ID = new PublicKey('4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA');
export const NETWORK = 'devnet';
export const RPC_ENDPOINT = 'https://api.devnet.solana.com';

// Platform Admin (your wallet)
export const PLATFORM_ADMIN = new PublicKey('4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw');

// Fixed backing amount (1 USDC = 1_000_000 smallest units)
export const FIXED_BACKING_AMOUNT = 1_000_000;

// Platform Config PDA
export const PLATFORM_CONFIG_SEED = 'platform_config';

// Devnet Explorer
export const EXPLORER_URL = 'https://explorer.solana.com';
