#!/usr/bin/env node

const { Connection, Keypair, sendAndConfirmTransaction, Transaction } = require('@solana/web3.js');
const { BpfLoader, BPF_LOADER_PROGRAM_ID } = require('@solana/web3.js');
const fs = require('fs');

const SOON_RPC = 'https://rpc.testnet.soo.network/rpc';
const PROGRAM_ID = '2NZKEk8zk47UAc27f7DScFgxpqyy22VptWVwBUjFfQxC';
const PROGRAM_SO_PATH = './anchor/target/deploy/odv_escrow.so';

async function deployProgram() {
    console.log('🚀 Deploying program to SOON Testnet...\n');
    
    // Load wallet
    const keypairPath = `${process.env.HOME}/.config/solana/id.json`;
    const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'));
    const payer = Keypair.fromSecretKey(Uint8Array.from(keypairData));
    
    console.log(`Wallet: ${payer.publicKey.toString()}`);
    
    // Connect to SOON
    const connection = new Connection(SOON_RPC, 'confirmed');
    const balance = await connection.getBalance(payer.publicKey);
    console.log(`Balance: ${balance / 1e9} SOL\n`);
    
    // Load program binary
    const programData = fs.readFileSync(PROGRAM_SO_PATH);
    console.log(`Program size: ${(programData.length / 1024).toFixed(2)} KB`);
    console.log(`Program ID: ${PROGRAM_ID}\n`);
    
    // Note: We can't use BpfLoader.load() because it requires TPU
    // SOON Testnet requires manual program upgrade via their tools or governance
    
    console.log('❌ ERROR: Solana CLI deployment requires TPU discovery');
    console.log('SOON Testnet does not support TPU endpoints.\n');
    console.log('📋 Deployment Options:');
    console.log('1. Deploy from local machine with direct network access');
    console.log('2. Contact SOON team for program upgrade');
    console.log('3. Use SOON Dashboard if available');
    console.log('4. Wait for SOON to add TPU support\n');
    
    process.exit(1);
}

deployProgram().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
