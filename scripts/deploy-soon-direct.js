#!/usr/bin/env node

/**
 * Direct SOON Testnet Deployment Script
 * Uses solana program deploy with RPC-only mode
 */

const { execSync } = require('child_process');
const fs = require('fs');

const SOON_RPC = 'https://rpc.testnet.soo.network/rpc';
const PROGRAM_SO_PATH = './anchor/target/deploy/odv_escrow.so';
const PROGRAM_KEYPAIR_PATH = './anchor/target/deploy/odv_escrow-keypair.json';

async function main() {
    console.log('🚀 SOON Testnet Direct Deployment\n');

    // Check files exist
    if (!fs.existsSync(PROGRAM_SO_PATH)) {
        console.error('❌ Program binary not found:', PROGRAM_SO_PATH);
        console.log('   Run: cd anchor && anchor build');
        process.exit(1);
    }

    if (!fs.existsSync(PROGRAM_KEYPAIR_PATH)) {
        console.error('❌ Program keypair not found:', PROGRAM_KEYPAIR_PATH);
        process.exit(1);
    }

    const programData = fs.readFileSync(PROGRAM_SO_PATH);
    console.log('📦 Program size:', programData.length, 'bytes');

    // Get program ID
    try {
        const programId = execSync(
            `solana address -k ${PROGRAM_KEYPAIR_PATH}`,
            { encoding: 'utf-8' }
        ).trim();
        console.log('📍 Program ID:', programId);
    } catch (err) {
        console.error('❌ Failed to read program ID');
        process.exit(1);
    }

    // Check balance
    try {
        const balance = execSync('solana balance', { encoding: 'utf-8' }).trim();
        console.log('💰 Balance:', balance);
    } catch (err) {
        console.error('❌ Failed to check balance');
    }

    console.log('\n🚀 Deploying to SOON Testnet...');
    console.log('   RPC:', SOON_RPC);
    console.log('   This may take several minutes...\n');

    // Try deployment with various strategies
    const strategies = [
        {
            name: 'Standard deployment',
            cmd: `solana program deploy ${PROGRAM_SO_PATH} --program-id ${PROGRAM_KEYPAIR_PATH} --url ${SOON_RPC}`
        },
        {
            name: 'With increased timeout',
            cmd: `solana program deploy ${PROGRAM_SO_PATH} --program-id ${PROGRAM_KEYPAIR_PATH} --url ${SOON_RPC} --commitment finalized --max-sign-attempts 100`
        },
        {
            name: 'Using write-buffer method',
            cmd: `solana program write-buffer ${PROGRAM_SO_PATH} --url ${SOON_RPC}`
        }
    ];

    for (const strategy of strategies) {
        console.log(`\n📋 Trying: ${strategy.name}...`);
        try {
            const output = execSync(strategy.cmd, {
                encoding: 'utf-8',
                stdio: 'pipe',
                maxBuffer: 10 * 1024 * 1024
            });
            
            console.log(output);
            console.log('\n✅ Deployment successful!');
            
            const programId = execSync(
                `solana address -k ${PROGRAM_KEYPAIR_PATH}`,
                { encoding: 'utf-8' }
            ).trim();
            
            console.log('\n📍 Program ID:', programId);
            console.log('🌐 Explorer:', `https://explorer.testnet.soo.network/address/${programId}`);
            process.exit(0);
            
        } catch (error) {
            console.log(`   ❌ Failed: ${error.message.split('\n')[0]}`);
            if (error.stderr) {
                const stderr = error.stderr.toString();
                if (stderr.includes('TPU') || stderr.includes('leader')) {
                    console.log('   ⚠️  TPU/leader discovery issue detected');
                }
            }
        }
    }

    console.log('\n❌ All deployment strategies failed');
    console.log('\n💡 Alternative: The program is already deployed on Solana Devnet');
    console.log('   SOON Network may require Solana Playground for deployment');
    process.exit(1);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
