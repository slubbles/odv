import * as anchor from '@coral-xyz/anchor';
import { Program, AnchorProvider, BN, web3, Idl } from '@coral-xyz/anchor';
import { Connection, PublicKey, SystemProgram, Keypair } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { PROGRAM_ID, RPC_ENDPOINT, PLATFORM_CONFIG_SEED } from './config';
import type { OdvEscrow } from './types/odv_escrow';
import IDL from './idl/odv_escrow.json';

/**
 * ODV Program SDK - Wrapper for smart contract interactions
 */
export class ODVProgramSDK {
  program: Program<OdvEscrow>;
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
   * Get Campaign PDA
   */
  getCampaignPDA(creator: PublicKey, campaignId: BN): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from('campaign'),
        creator.toBuffer(),
        campaignId.toArrayLike(Buffer, 'le', 8),
      ],
      this.program.programId
    );
  }

  /**
   * Get Backing PDA
   */
  getBackingPDA(campaign: PublicKey, backer: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('backing'), campaign.toBuffer(), backer.toBuffer()],
      this.program.programId
    );
  }

  /**
   * Initialize Platform (Admin only)
   */
  async initializePlatform(fixedBackingAmount: BN): Promise<string> {
    const [platformConfigPDA] = this.getPlatformConfigPDA();

    return await this.program.methods
      .initializePlatform(fixedBackingAmount)
      .accounts({
        platformConfig: platformConfigPDA,
        admin: this.provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  }

  /**
   * Fetch Platform Config
   */
  async getPlatformConfig() {
    const [platformConfigPDA] = this.getPlatformConfigPDA();
    return await this.program.account.platformConfig.fetch(platformConfigPDA);
  }

  /**
   * Create Campaign
   */
  async createCampaign(params: {
    campaignId: BN;
    goal: BN;
    deadline: BN;
    title: string;
    description: string;
    milestones: Array<{ description: string; fundingPercentage: number }>;
  }): Promise<{ signature: string; campaignPDA: PublicKey }> {
    const [platformConfigPDA] = this.getPlatformConfigPDA();
    const [campaignPDA] = this.getCampaignPDA(
      this.provider.wallet.publicKey,
      params.campaignId
    );

    const signature = await this.program.methods
      .createCampaign(
        params.campaignId,
        params.goal,
        params.deadline,
        params.title,
        params.description,
        params.milestones
      )
      .accounts({
        campaign: campaignPDA,
        platformConfig: platformConfigPDA,
        creator: this.provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return { signature, campaignPDA };
  }

  /**
   * Fetch Campaign
   */
  async getCampaign(campaignPDA: PublicKey) {
    return await this.program.account.campaign.fetch(campaignPDA);
  }

  /**
   * Back Project (Support a campaign)
   */
  async backProject(params: {
    campaign: PublicKey;
    usdcMint: PublicKey;
    backerTokenAccount: PublicKey;
    campaignTokenAccount: PublicKey;
  }): Promise<{ signature: string; backingPDA: PublicKey }> {
    const [backingPDA] = this.getBackingPDA(
      params.campaign,
      this.provider.wallet.publicKey
    );

    const signature = await this.program.methods
      .backProject()
      .accounts({
        backing: backingPDA,
        campaign: params.campaign,
        backer: this.provider.wallet.publicKey,
        backerTokenAccount: params.backerTokenAccount,
        campaignTokenAccount: params.campaignTokenAccount,
        usdcMint: params.usdcMint,
        systemProgram: SystemProgram.programId,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      })
      .rpc();

    return { signature, backingPDA };
  }

  /**
   * Fetch Backing
   */
  async getBacking(backingPDA: PublicKey) {
    return await this.program.account.backing.fetch(backingPDA);
  }

  /**
   * Submit Milestone Proof (Creator only)
   */
  async submitMilestoneProof(params: {
    campaign: PublicKey;
    milestoneIndex: number;
    proofUrl: string;
  }): Promise<string> {
    return await this.program.methods
      .submitMilestoneProof(params.milestoneIndex, params.proofUrl)
      .accounts({
        campaign: params.campaign,
        creator: this.provider.wallet.publicKey,
      })
      .rpc();
  }

  /**
   * Release Milestone Funds (Creator only)
   */
  async releaseMilestone(params: {
    campaign: PublicKey;
    milestoneIndex: number;
    usdcMint: PublicKey;
    campaignTokenAccount: PublicKey;
    creatorTokenAccount: PublicKey;
  }): Promise<string> {
    return await this.program.methods
      .releaseMilestone(params.milestoneIndex)
      .accounts({
        campaign: params.campaign,
        creator: this.provider.wallet.publicKey,
        campaignTokenAccount: params.campaignTokenAccount,
        creatorTokenAccount: params.creatorTokenAccount,
        usdcMint: params.usdcMint,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      })
      .rpc();
  }

  /**
   * Refund Campaign (Backer only, after failed campaign)
   */
  async refundCampaign(params: {
    campaign: PublicKey;
    backing: PublicKey;
    usdcMint: PublicKey;
    campaignTokenAccount: PublicKey;
    backerTokenAccount: PublicKey;
  }): Promise<string> {
    return await this.program.methods
      .refundCampaign()
      .accounts({
        campaign: params.campaign,
        backing: params.backing,
        backer: this.provider.wallet.publicKey,
        campaignTokenAccount: params.campaignTokenAccount,
        backerTokenAccount: params.backerTokenAccount,
        usdcMint: params.usdcMint,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      })
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
      })
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
      })
      .rpc();
  }

  /**
   * Get transaction explorer URL
   */
  getExplorerUrl(signature: string, cluster: 'devnet' | 'mainnet-beta' = 'devnet'): string {
    return `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`;
  }
}

/**
 * Helper: Create SDK instance from wallet
 */
export function createODVSDK(wallet: AnchorWallet, connection?: Connection): ODVProgramSDK {
  return new ODVProgramSDK(wallet, connection);
}
