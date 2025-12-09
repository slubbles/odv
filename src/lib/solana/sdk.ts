import * as anchor from '@coral-xyz/anchor';
import { Program, AnchorProvider, BN, web3, Idl } from '@coral-xyz/anchor';
import { Connection, PublicKey, SystemProgram, Keypair, Transaction } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, getAccount, TokenAccountNotFoundError, TokenInvalidAccountOwnerError } from '@solana/spl-token';
import { PROGRAM_ID, RPC_ENDPOINT, PLATFORM_CONFIG_SEED, PLATFORM_ADMIN } from './config';
import IDL from './idl/odv_escrow.json';
import { getExplorerTransactionUrl } from './network-utils';

// USDC Mint on SOON Testnet (Test USDC - use env var or fallback)
export const USDC_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_USDC_MINT || '3PNhmxDckddYL24zEfrsHLFLXXvrdzBBoZgfRW8rruDs'
);

/**
 * ODV Program SDK - Wrapper for smart contract interactions on SOON Testnet
 */
export class ODVProgramSDK {
  program: Program;
  provider: AnchorProvider;
  connection: Connection;

  constructor(wallet: AnchorWallet, connection?: Connection) {
    this.connection = connection || new Connection(RPC_ENDPOINT, 'confirmed');
    this.provider = new AnchorProvider(this.connection, wallet, {
      commitment: 'confirmed',
    });
    this.program = new Program(IDL as Idl, this.provider);
  }

  /**
   * Get Platform Config PDA
   */
  getPlatformConfigPDA(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(PLATFORM_CONFIG_SEED)],
      this.program.programId
    );
  }

  /**
   * Get Campaign PDA (uses creator's pubkey)
   */
  getCampaignPDA(creator: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('campaign'), creator.toBuffer()],
      this.program.programId
    );
  }

  /**
   * Get Campaign Vault PDA (token account holding USDC)
   */
  getCampaignVaultPDA(campaign: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('campaign_vault'), campaign.toBuffer()],
      this.program.programId
    );
  }

  /**
   * Initialize Platform (Admin only - already done on SOON Testnet)
   */
  async initializePlatform(fixedBackingAmount: BN): Promise<string> {
    const [platformConfigPDA] = this.getPlatformConfigPDA();

    return await this.program.methods
      .initializePlatform(fixedBackingAmount)
      .accounts({
        platformConfig: platformConfigPDA,
        admin: this.provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      } as any)
      .rpc();
  }

  /**
   * Fetch Platform Config
   */
  async getPlatformConfig() {
    const [platformConfigPDA] = this.getPlatformConfigPDA();
    try {
      // Use bracket notation for dynamic account access
      const account = this.program.account as any;
      return await account.platformConfig.fetch(platformConfigPDA);
    } catch (error) {
      console.error('Failed to fetch platform config:', error);
      return null;
    }
  }

  /**
   * Initialize Campaign (Create a new crowdfunding campaign)
   */
  async initializeCampaign(params: {
    goal: BN;
    deadline: BN;
    milestones: Array<{ title: string; amount: BN }>;
  }): Promise<{ signature: string; campaignPDA: PublicKey }> {
    const [campaignPDA] = this.getCampaignPDA(this.provider.wallet.publicKey);

    const signature = await this.program.methods
      .initialize(params.goal, params.deadline, params.milestones)
      .accounts({
        campaign: campaignPDA,
        creator: this.provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      } as any)
      .rpc();

    return { signature, campaignPDA };
  }

  /**
   * Fetch Campaign data
   */
  async getCampaign(creator: PublicKey) {
    const [campaignPDA] = this.getCampaignPDA(creator);
    try {
      const account = this.program.account as any;
      return await account.campaign.fetch(campaignPDA);
    } catch (error) {
      console.error('Failed to fetch campaign:', error);
      return null;
    }
  }

  /**
   * Fund/Back Project (Support a campaign with $1)
   * The fixed backing amount is read from PlatformConfig on-chain
   */
  async fundCampaign(params: {
    creatorWallet: PublicKey;
    usdcMint?: PublicKey;
  }): Promise<{ signature: string }> {
    const [platformConfigPDA] = this.getPlatformConfigPDA();
    const [campaignPDA] = this.getCampaignPDA(params.creatorWallet);
    const [campaignVaultPDA] = this.getCampaignVaultPDA(campaignPDA);
    
    const usdcMint = params.usdcMint || USDC_MINT;
    
    // Get backer's token account
    const backerTokenAccount = await getAssociatedTokenAddress(
      usdcMint,
      this.provider.wallet.publicKey
    );

    // Get campaign vault token account (create if needed)
    const vaultTokenAccount = await getAssociatedTokenAddress(
      usdcMint,
      campaignVaultPDA,
      true // allowOwnerOffCurve for PDA
    );

    // Build transaction with potential ATA creation
    const tx = new Transaction();
    
    // Check if vault ATA exists, create if needed
    try {
      await getAccount(this.connection, vaultTokenAccount);
    } catch (error: unknown) {
      if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
        tx.add(
          createAssociatedTokenAccountInstruction(
            this.provider.wallet.publicKey, // payer
            vaultTokenAccount,
            campaignVaultPDA, // owner (PDA)
            usdcMint
          )
        );
      }
    }

    // Add fund instruction
    const fundIx = await this.program.methods
      .fund()
      .accounts({
        campaign: campaignPDA,
        campaignVault: vaultTokenAccount,
        backer: this.provider.wallet.publicKey,
        backerTokenAccount: backerTokenAccount,
        platformConfig: platformConfigPDA,
        tokenProgram: TOKEN_PROGRAM_ID,
      } as any)
      .instruction();
    
    tx.add(fundIx);

    // Send transaction
    const signature = await this.provider.sendAndConfirm(tx);
    return { signature };
  }

  /**
   * Submit Milestone Proof (Creator only)
   */
  async submitMilestoneProof(params: {
    proofUrl: string;
  }): Promise<string> {
    const [platformConfigPDA] = this.getPlatformConfigPDA();
    const [campaignPDA] = this.getCampaignPDA(this.provider.wallet.publicKey);

    return await this.program.methods
      .submitMilestoneProof(params.proofUrl)
      .accounts({
        campaign: campaignPDA,
        creator: this.provider.wallet.publicKey,
        platformConfig: platformConfigPDA,
      } as any)
      .rpc();
  }

  /**
   * Release Milestone Funds (Creator only, after admin approval)
   */
  async releaseMilestone(params: {
    usdcMint?: PublicKey;
  }): Promise<string> {
    const [platformConfigPDA] = this.getPlatformConfigPDA();
    const [campaignPDA] = this.getCampaignPDA(this.provider.wallet.publicKey);
    const [campaignVaultPDA] = this.getCampaignVaultPDA(campaignPDA);
    
    const usdcMint = params.usdcMint || USDC_MINT;
    
    const vaultTokenAccount = await getAssociatedTokenAddress(
      usdcMint,
      campaignVaultPDA,
      true
    );
    
    const creatorTokenAccount = await getAssociatedTokenAddress(
      usdcMint,
      this.provider.wallet.publicKey
    );

    return await this.program.methods
      .releaseMilestone()
      .accounts({
        campaign: campaignPDA,
        campaignVault: vaultTokenAccount,
        creator: this.provider.wallet.publicKey,
        creatorTokenAccount: creatorTokenAccount,
        platformConfig: platformConfigPDA,
        tokenProgram: TOKEN_PROGRAM_ID,
      } as any)
      .rpc();
  }

  /**
   * Refund Campaign (Backer only, after failed campaign)
   */
  async refundCampaign(params: {
    creatorWallet: PublicKey;
    usdcMint?: PublicKey;
  }): Promise<string> {
    const [platformConfigPDA] = this.getPlatformConfigPDA();
    const [campaignPDA] = this.getCampaignPDA(params.creatorWallet);
    const [campaignVaultPDA] = this.getCampaignVaultPDA(campaignPDA);
    
    const usdcMint = params.usdcMint || USDC_MINT;
    
    const vaultTokenAccount = await getAssociatedTokenAddress(
      usdcMint,
      campaignVaultPDA,
      true
    );
    
    const backerTokenAccount = await getAssociatedTokenAddress(
      usdcMint,
      this.provider.wallet.publicKey
    );

    return await this.program.methods
      .refundCampaign()
      .accounts({
        campaign: campaignPDA,
        campaignVault: vaultTokenAccount,
        backer: this.provider.wallet.publicKey,
        backerTokenAccount: backerTokenAccount,
        platformConfig: platformConfigPDA,
        tokenProgram: TOKEN_PROGRAM_ID,
      } as any)
      .rpc();
  }

  /**
   * Approve Milestone (Admin only)
   */
  async approveMilestone(params: {
    creatorWallet: PublicKey;
  }): Promise<string> {
    const [platformConfigPDA] = this.getPlatformConfigPDA();
    const [campaignPDA] = this.getCampaignPDA(params.creatorWallet);

    return await this.program.methods
      .approveMilestone()
      .accounts({
        campaign: campaignPDA,
        platformConfig: platformConfigPDA,
        admin: this.provider.wallet.publicKey,
      } as any)
      .rpc();
  }

  /**
   * Reject Milestone (Admin only)
   */
  async rejectMilestone(params: {
    creatorWallet: PublicKey;
  }): Promise<string> {
    const [platformConfigPDA] = this.getPlatformConfigPDA();
    const [campaignPDA] = this.getCampaignPDA(params.creatorWallet);

    return await this.program.methods
      .rejectMilestone()
      .accounts({
        campaign: campaignPDA,
        platformConfig: platformConfigPDA,
        admin: this.provider.wallet.publicKey,
      } as any)
      .rpc();
  }

  /**
   * Pause Platform (Admin only)
   */
  async pausePlatform(): Promise<string> {
    const [platformConfigPDA] = this.getPlatformConfigPDA();

    return await this.program.methods
      .pausePlatform()
      .accounts({
        platformConfig: platformConfigPDA,
        admin: this.provider.wallet.publicKey,
      } as any)
      .rpc();
  }

  /**
   * Unpause Platform (Admin only)
   */
  async unpausePlatform(): Promise<string> {
    const [platformConfigPDA] = this.getPlatformConfigPDA();

    return await this.program.methods
      .unpausePlatform()
      .accounts({
        platformConfig: platformConfigPDA,
        admin: this.provider.wallet.publicKey,
      } as any)
      .rpc();
  }

  /**
   * Update backing amount (Admin only)
   */
  async updateBackingAmount(newAmount: BN): Promise<string> {
    const [platformConfigPDA] = this.getPlatformConfigPDA();

    return await this.program.methods
      .updateBackingAmount(newAmount)
      .accounts({
        platformConfig: platformConfigPDA,
        admin: this.provider.wallet.publicKey,
      } as any)
      .rpc();
  }

  /**
   * Check if current wallet is admin
   */
  isAdmin(): boolean {
    return this.provider.wallet.publicKey.equals(PLATFORM_ADMIN);
  }

  /**
   * Get transaction explorer URL (SOON Testnet)
   */
  getExplorerUrl(signature: string): string {
    return getExplorerTransactionUrl(signature);
  }
}

/**
 * Helper: Create SDK instance from wallet
 */
export function createODVSDK(wallet: AnchorWallet, connection?: Connection): ODVProgramSDK {
  return new ODVProgramSDK(wallet, connection);
}
