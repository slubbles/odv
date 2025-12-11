#!/usr/bin/env node

/**
 * Quick diagnostic script to check if a project has a valid campaign_id
 * 
 * Usage: node scripts/check-campaign-id.js <project-id>
 */

const projectId = process.argv[2];

if (!projectId) {
  console.log('Usage: node scripts/check-campaign-id.js <project-id>');
  console.log('Example: node scripts/check-campaign-id.js f08c223a-bbb4-4c45-9ecf-9d8f6d71fa7b');
  process.exit(1);
}

console.log('\n🔍 Checking project campaign status...\n');
console.log('Project ID:', projectId);
console.log('\n📝 Run this query in Supabase SQL Editor:\n');
console.log(`SELECT 
  id, 
  title, 
  status, 
  creator_wallet,
  campaign_id, 
  campaign_pda, 
  initialize_tx,
  created_at
FROM projects 
WHERE id = '${projectId}';`);

console.log('\n\n✅ Expected Results:\n');
console.log('1. campaign_id should be a NUMBER (0, 1, 2, etc.), NOT null');
console.log('2. campaign_pda should be a STRING (base58 address), NOT null');
console.log('3. initialize_tx should be a STRING (transaction signature)');

console.log('\n\n❌ If campaign_id is NULL:\n');
console.log('→ The project was NOT initialized on blockchain during submission');
console.log('→ You cannot back this project until it\'s initialized');
console.log('→ Options:');
console.log('  1. Re-submit the project (will create new campaign)');
console.log('  2. Admin manually initialize via /admin/initialize page');

console.log('\n\n🔧 To check the actual campaign on blockchain:\n');
console.log('Once you get the campaign_id from database, run:');
console.log('node anchor/test-deployment.js verify <campaign-id>\n');
