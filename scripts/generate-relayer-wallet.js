#!/usr/bin/env node
/**
 * Generate Relayer Wallet for Gas Sponsorship
 * Run: node scripts/generate-relayer-wallet.js
 */

const { Keypair } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

console.log('🔐 Generating Relayer Wallet...\n');

// Generate new keypair
const keypair = Keypair.generate();

const publicKey = keypair.publicKey.toString();
const secretKey = Buffer.from(keypair.secretKey).toString('base64');
const secretKeyArray = JSON.stringify(Array.from(keypair.secretKey));

console.log('✅ Relayer Wallet Generated!\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Public Key (Address):');
console.log(publicKey);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📝 Add to .env.local:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`RELAYER_PUBLIC_KEY=${publicKey}`);
console.log(`RELAYER_PRIVATE_KEY=${secretKey}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📝 Add to Vercel Environment Variables:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Name: RELAYER_PUBLIC_KEY');
console.log(`Value: ${publicKey}\n`);
console.log('Name: RELAYER_PRIVATE_KEY');
console.log(`Value: ${secretKey}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('🔥 IMPORTANT - Save Secret Key Securely:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('This wallet will pay gas fees for all users.');
console.log('Keep the private key secret and secure!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('💰 Fund This Wallet:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('SOON Testnet:');
console.log(`solana airdrop 1 ${publicKey} --url https://rpc.testnet.soo.network/rpc\n`);
console.log('Or transfer from your admin wallet:');
console.log(`solana transfer ${publicKey} 1 --url https://rpc.testnet.soo.network/rpc`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Save to file for backup (CAREFUL - this contains private key)
const backupPath = path.join(__dirname, '..', '.relayer-backup.json');
const backupData = {
  publicKey,
  secretKeyBase64: secretKey,
  secretKeyArray: JSON.parse(secretKeyArray),
  generatedAt: new Date().toISOString(),
  warning: 'KEEP THIS FILE SECURE - CONTAINS PRIVATE KEY'
};

fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
console.log(`💾 Backup saved to: ${backupPath}`);
console.log('⚠️  Add .relayer-backup.json to .gitignore immediately!\n');

console.log('✅ Next Steps:');
console.log('1. Add environment variables to .env.local');
console.log('2. Add to .gitignore: .relayer-backup.json');
console.log('3. Fund wallet with 1 SOL');
console.log('4. Test with backing transaction');
console.log('5. Monitor gas costs\n');
