const fs = require('fs');
const bs58 = require('bs58');

const backup = JSON.parse(fs.readFileSync('.relayer-backup.json', 'utf8'));

console.log('🔐 Relayer Wallet - All Formats\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📍 Public Key:');
console.log(backup.publicKey);
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('🔑 Private Key Formats:\n');

// Base64 (current)
console.log('1️⃣  Base64 (Current):');
console.log(backup.secretKeyBase64);
console.log('   Use: RELAYER_PRIVATE_KEY_BASE64\n');

// Base58 (Solana standard - like in Phantom/Solflare)
const base58Key = bs58.encode(Buffer.from(backup.secretKeyArray));
console.log('2️⃣  Base58 (Solana Standard):');
console.log(base58Key);
console.log('   Use: RELAYER_PRIVATE_KEY (most common)\n');

// Byte Array (for Rust/Anchor)
console.log('3️⃣  Byte Array (for Rust/Anchor):');
console.log(JSON.stringify(backup.secretKeyArray));
console.log('   Use: For Anchor CLI or Rust programs\n');

// Hex (alternative)
const hexKey = Buffer.from(backup.secretKeyArray).toString('hex');
console.log('4️⃣  Hex:');
console.log(hexKey);
console.log('   Use: RELAYER_PRIVATE_KEY_HEX\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('✅ Recommended for .env.local:\n');
console.log(`RELAYER_PUBLIC_KEY=${backup.publicKey}`);
console.log(`RELAYER_PRIVATE_KEY=${base58Key}`);
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('�� Import to Phantom/Solflare:');
console.log('Use Base58 format above ⬆️');
console.log('(But DON\'T - this should stay in backend only!)');
