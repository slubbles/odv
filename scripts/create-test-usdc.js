#!/usr/bin/env node

/**
 * Create Test USDC Token on SOON Testnet
 * 
 * This script:
 * 1. Creates a new SPL token mint (acts as "test USDC")
 * 2. Creates a token account for the admin wallet
 * 3. Mints test tokens to the admin wallet
 * 4. Outputs the mint address to update in config
 * 
 * Usage: node scripts/create-test-usdc.js
 * 
 * Requires: Admin wallet private key in environment or prompt
 */

const {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} = require('@solana/web3.js');

const {
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} = require('@solana/spl-token');

const readline = require('readline');

// SOON Testnet RPC
const SOON_RPC = 'https://rpc.testnet.soo.network/rpc';

// Test USDC config
const DECIMALS = 6; // Same as real USDC
const INITIAL_SUPPLY = 1_000_000_000_000; // 1,000,000 USDC (in smallest units)

async function promptForPrivateKey() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('\n🔐 Enter admin wallet private key (base58 or array): ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function parsePrivateKey(input) {
  try {
    // Try parsing as JSON array first
    if (input.startsWith('[')) {
      const array = JSON.parse(input);
      return Keypair.fromSecretKey(Uint8Array.from(array));
    }
    
    // Try as base58 (bs58 v6 uses .default)
    const bs58Module = require('bs58');
    const bs58 = bs58Module.default || bs58Module;
    const decoded = bs58.decode(input);
    return Keypair.fromSecretKey(Uint8Array.from(decoded));
  } catch (e) {
    throw new Error(`Invalid private key format: ${e.message}`);
  }
}

async function main() {
  console.log('🚀 SOON Testnet - Test USDC Creator\n');
  console.log('═'.repeat(50));
  console.log('Network: SOON Testnet');
  console.log('RPC:', SOON_RPC);
  console.log('═'.repeat(50));

  // Get private key
  let privateKeyInput = process.env.ADMIN_PRIVATE_KEY;
  
  if (!privateKeyInput) {
    console.log('\n⚠️  No ADMIN_PRIVATE_KEY environment variable found.');
    privateKeyInput = await promptForPrivateKey();
  }

  if (!privateKeyInput) {
    console.error('❌ No private key provided. Exiting.');
    process.exit(1);
  }

  // Parse keypair
  let adminKeypair;
  try {
    adminKeypair = parsePrivateKey(privateKeyInput);
    console.log('\n✅ Admin wallet:', adminKeypair.publicKey.toString());
  } catch (e) {
    console.error('❌ Failed to parse private key:', e.message);
    process.exit(1);
  }

  // Connect to SOON Testnet
  const connection = new Connection(SOON_RPC, 'confirmed');
  
  // Check balance
  const balance = await connection.getBalance(adminKeypair.publicKey);
  console.log('💰 SOL Balance:', balance / 1e9, 'SOL');
  
  if (balance < 0.01 * 1e9) {
    console.error('\n❌ Insufficient SOL balance. Need at least 0.01 SOL for transactions.');
    console.log('   Get testnet SOL from: https://faucet.soo.network/');
    process.exit(1);
  }

  console.log('\n📝 Creating Test USDC Token...\n');

  try {
    // Step 1: Create mint account
    console.log('Step 1/3: Creating token mint...');
    
    const mintKeypair = Keypair.generate();
    const mintRent = await getMinimumBalanceForRentExemptMint(connection);
    
    const createMintAccountIx = SystemProgram.createAccount({
      fromPubkey: adminKeypair.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: MINT_SIZE,
      lamports: mintRent,
      programId: TOKEN_PROGRAM_ID,
    });

    const initMintIx = createInitializeMintInstruction(
      mintKeypair.publicKey,
      DECIMALS,
      adminKeypair.publicKey, // mint authority
      adminKeypair.publicKey, // freeze authority
      TOKEN_PROGRAM_ID
    );

    const tx1 = new Transaction().add(createMintAccountIx, initMintIx);
    
    const sig1 = await sendAndConfirmTransaction(connection, tx1, [adminKeypair, mintKeypair], {
      commitment: 'confirmed',
    });
    
    console.log('   ✅ Mint created:', mintKeypair.publicKey.toString());
    console.log('   📜 Tx:', sig1);

    // Step 2: Create associated token account
    console.log('\nStep 2/3: Creating token account for admin...');
    
    const ata = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      adminKeypair.publicKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const createAtaIx = createAssociatedTokenAccountInstruction(
      adminKeypair.publicKey, // payer
      ata, // ata
      adminKeypair.publicKey, // owner
      mintKeypair.publicKey, // mint
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const tx2 = new Transaction().add(createAtaIx);
    const sig2 = await sendAndConfirmTransaction(connection, tx2, [adminKeypair], {
      commitment: 'confirmed',
    });
    
    console.log('   ✅ Token account:', ata.toString());
    console.log('   📜 Tx:', sig2);

    // Step 3: Mint tokens
    console.log('\nStep 3/3: Minting test tokens...');
    
    const mintToIx = createMintToInstruction(
      mintKeypair.publicKey,
      ata,
      adminKeypair.publicKey, // mint authority
      INITIAL_SUPPLY,
      [],
      TOKEN_PROGRAM_ID
    );

    const tx3 = new Transaction().add(mintToIx);
    const sig3 = await sendAndConfirmTransaction(connection, tx3, [adminKeypair], {
      commitment: 'confirmed',
    });
    
    console.log('   ✅ Minted:', (INITIAL_SUPPLY / 1e6).toLocaleString(), 'Test USDC');
    console.log('   📜 Tx:', sig3);

    // Summary
    console.log('\n' + '═'.repeat(50));
    console.log('🎉 SUCCESS! Test USDC Token Created');
    console.log('═'.repeat(50));
    console.log('\n📋 Token Details:');
    console.log('   Mint Address:', mintKeypair.publicKey.toString());
    console.log('   Decimals:', DECIMALS);
    console.log('   Initial Supply:', (INITIAL_SUPPLY / 1e6).toLocaleString(), 'USDC');
    console.log('   Mint Authority:', adminKeypair.publicKey.toString());
    console.log('   Your Token Account:', ata.toString());
    
    console.log('\n📝 Next Steps:');
    console.log('   1. Update USDC_MINT in src/lib/solana/config.ts:');
    console.log(`      export const USDC_MINT = new PublicKey('${mintKeypair.publicKey.toString()}');`);
    console.log('\n   2. Update in src/lib/solana/transaction.ts if needed');
    console.log('\n   3. Restart the dev server');
    
    console.log('\n🔗 View on Explorer:');
    console.log(`   https://explorer.testnet.soo.network/address/${mintKeypair.publicKey.toString()}`);

    // Also save to a file for reference
    const fs = require('fs');
    const outputData = {
      network: 'SOON Testnet',
      created: new Date().toISOString(),
      mint: mintKeypair.publicKey.toString(),
      decimals: DECIMALS,
      initialSupply: INITIAL_SUPPLY,
      mintAuthority: adminKeypair.publicKey.toString(),
      adminTokenAccount: ata.toString(),
    };
    
    fs.writeFileSync(
      'test-usdc-mint.json',
      JSON.stringify(outputData, null, 2)
    );
    console.log('\n💾 Details saved to: test-usdc-mint.json');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.logs) {
      console.error('Logs:', error.logs);
    }
    process.exit(1);
  }
}

main().catch(console.error);
