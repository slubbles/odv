const bs58Module = require('bs58');
const bs58 = bs58Module.default || bs58Module;
const { Connection, Keypair, PublicKey, Transaction, TransactionInstruction, SystemProgram, sendAndConfirmTransaction } = require('@solana/web3.js');
const BN = require('bn.js');

const SOON_RPC = 'https://rpc.testnet.soo.network/rpc';
const PROGRAM_ID = new PublicKey('2NZKEk8zk47UAc27f7DScFgxpqyy22VptWVwBUjFfQxC');

async function main() {
  console.log('🚀 Initializing Campaign on SOON Testnet...\n');

  const key = '3Ngb8c3fHPPob5FVdJYDoXKFZRcxbapdBNbNUMdU4LbEULHY1qpuiQ2CFA8ZoR3m7EvCjCLsjkugf9MqmPJttkYR';
  const creatorKeypair = Keypair.fromSecretKey(Uint8Array.from(bs58.decode(key)));
  console.log('✅ Creator wallet:', creatorKeypair.publicKey.toString());

  const connection = new Connection(SOON_RPC, { commitment: 'confirmed', confirmTransactionInitialTimeout: 120000 });

  // Get Campaign PDA
  const [campaignPDA, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from('campaign'), creatorKeypair.publicKey.toBuffer()],
    PROGRAM_ID
  );
  console.log('📍 Campaign PDA:', campaignPDA.toString());

  // Check if campaign already exists
  const existingAccount = await connection.getAccountInfo(campaignPDA);
  if (existingAccount) {
    console.log('✅ Campaign already initialized!');
    console.log('   Size:', existingAccount.data.length, 'bytes');
    console.log('   Owner:', existingAccount.owner.toString());
    return;
  }

  console.log('❌ No campaign exists yet. Creating...');

  // Campaign params
  const goal = new BN(30000 * 1_000_000); // 30000 USDC
  const deadline = new BN(Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60); // 30 days
  
  const milestones = [
    { title: 'Alpha Launch', amount: new BN(7500 * 1_000_000) },
    { title: 'NFT Breeding', amount: new BN(15000 * 1_000_000) },
    { title: 'Beta Launch', amount: new BN(7500 * 1_000_000) },
  ];

  // Build instruction data
  const discriminator = Buffer.from([175, 175, 109, 31, 13, 152, 155, 237]);
  
  const goalBuf = Buffer.alloc(8);
  goal.toArrayLike(Buffer, 'le', 8).copy(goalBuf);
  
  const deadlineBuf = Buffer.alloc(8);
  deadline.toArrayLike(Buffer, 'le', 8).copy(deadlineBuf);
  
  const milestonesLenBuf = Buffer.alloc(4);
  milestonesLenBuf.writeUInt32LE(milestones.length);
  
  const milestoneBufs = milestones.map(m => {
    const titleBytes = Buffer.from(m.title);
    const titleLenBuf = Buffer.alloc(4);
    titleLenBuf.writeUInt32LE(titleBytes.length);
    const amountBuf = Buffer.alloc(8);
    m.amount.toArrayLike(Buffer, 'le', 8).copy(amountBuf);
    return Buffer.concat([titleLenBuf, titleBytes, amountBuf]);
  });
  
  const data = Buffer.concat([discriminator, goalBuf, deadlineBuf, milestonesLenBuf, ...milestoneBufs]);
  console.log('📦 Instruction data size:', data.length, 'bytes');

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: campaignPDA, isSigner: false, isWritable: true },
      { pubkey: creatorKeypair.publicKey, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: PROGRAM_ID,
    data: data
  });

  const tx = new Transaction().add(instruction);
  tx.feePayer = creatorKeypair.publicKey;
  
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  
  console.log('📝 Sending transaction...');
  
  try {
    const sig = await sendAndConfirmTransaction(
      connection, 
      tx, 
      [creatorKeypair],
      { commitment: 'confirmed', maxRetries: 5 }
    );
    console.log('✅ Campaign initialized!');
    console.log('📜 Tx:', sig);
  } catch (err) {
    console.error('❌ Error:', err.message);
    if (err.logs) {
      console.log('📋 Logs:');
      err.logs.forEach(log => console.log('   ', log));
    }
  }
}

main().catch(e => console.error('Fatal:', e));
