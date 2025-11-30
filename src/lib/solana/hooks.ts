'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useMemo, useCallback, useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { ODVProgramSDK } from './sdk';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Hook to get ODV Program SDK instance
 */
export function useODVProgram() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sdk = useMemo(() => {
    if (!mounted || !wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) {
      return null;
    }

    try {
      return new ODVProgramSDK(
        {
          publicKey: wallet.publicKey,
          signTransaction: wallet.signTransaction.bind(wallet),
          signAllTransactions: wallet.signAllTransactions.bind(wallet),
        },
        connection
      );
    } catch (error) {
      console.error('Error initializing SDK:', error);
      return null;
    }
  }, [mounted, wallet, connection]);

  return sdk;
}

/**
 * Hook to fetch platform config
 */
export function usePlatformConfig() {
  const sdk = useODVProgram();

  return useQuery({
    queryKey: ['platformConfig'],
    queryFn: async () => {
      if (!sdk) throw new Error('Wallet not connected');
      return await sdk.getPlatformConfig();
    },
    enabled: !!sdk,
    staleTime: 60000, // 1 minute
  });
}

/**
 * Hook to fetch campaign data
 */
export function useCampaign(campaignPDA: string | PublicKey | null) {
  const sdk = useODVProgram();

  return useQuery({
    queryKey: ['campaign', campaignPDA?.toString()],
    queryFn: async () => {
      if (!sdk) throw new Error('Wallet not connected');
      if (!campaignPDA) throw new Error('Campaign PDA required');

      const pubkey = typeof campaignPDA === 'string' ? new PublicKey(campaignPDA) : campaignPDA;
      return await sdk.getCampaign(pubkey);
    },
    enabled: !!sdk && !!campaignPDA,
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Hook to fetch backing data
 */
export function useBacking(backingPDA: string | PublicKey | null) {
  const sdk = useODVProgram();

  return useQuery({
    queryKey: ['backing', backingPDA?.toString()],
    queryFn: async () => {
      if (!sdk) throw new Error('Wallet not connected');
      if (!backingPDA) throw new Error('Backing PDA required');

      const pubkey = typeof backingPDA === 'string' ? new PublicKey(backingPDA) : backingPDA;
      return await sdk.getBacking(pubkey);
    },
    enabled: !!sdk && !!backingPDA,
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Hook to create a campaign
 */
export function useCreateCampaign() {
  const sdk = useODVProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      goal: number; // in USDC (will be converted to smallest units)
      durationDays: number;
      milestones: Array<{ description: string; fundingPercentage: number }>;
    }) => {
      if (!sdk) throw new Error('Wallet not connected');

      const campaignId = new BN(Date.now());
      const goal = new BN(params.goal * 1_000_000); // Convert USDC to smallest units
      const deadline = new BN(Math.floor(Date.now() / 1000) + params.durationDays * 86400);

      return await sdk.createCampaign({
        campaignId,
        goal,
        deadline,
        title: params.title,
        description: params.description,
        milestones: params.milestones,
      });
    },
    onSuccess: () => {
      // Invalidate platform config to update campaign counter
      queryClient.invalidateQueries({ queryKey: ['platformConfig'] });
    },
  });
}

/**
 * Hook to back a project
 */
export function useBackProject() {
  const sdk = useODVProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      campaign: PublicKey;
      usdcMint: PublicKey;
      backerTokenAccount: PublicKey;
      campaignTokenAccount: PublicKey;
    }) => {
      if (!sdk) throw new Error('Wallet not connected');
      return await sdk.backProject(params);
    },
    onSuccess: (_, variables) => {
      // Invalidate campaign data to show updated backing count
      queryClient.invalidateQueries({ queryKey: ['campaign', variables.campaign.toString()] });
    },
  });
}

/**
 * Hook to submit milestone proof
 */
export function useSubmitMilestoneProof() {
  const sdk = useODVProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      campaign: PublicKey;
      milestoneIndex: number;
      proofUrl: string;
    }) => {
      if (!sdk) throw new Error('Wallet not connected');
      return await sdk.submitMilestoneProof(params);
    },
    onSuccess: (_, variables) => {
      // Invalidate campaign data to show updated milestone
      queryClient.invalidateQueries({ queryKey: ['campaign', variables.campaign.toString()] });
    },
  });
}

/**
 * Hook to release milestone funds
 */
export function useReleaseMilestone() {
  const sdk = useODVProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      campaign: PublicKey;
      milestoneIndex: number;
      usdcMint: PublicKey;
      campaignTokenAccount: PublicKey;
      creatorTokenAccount: PublicKey;
    }) => {
      if (!sdk) throw new Error('Wallet not connected');
      return await sdk.releaseMilestone(params);
    },
    onSuccess: (_, variables) => {
      // Invalidate campaign data to show released milestone
      queryClient.invalidateQueries({ queryKey: ['campaign', variables.campaign.toString()] });
    },
  });
}

/**
 * Hook to refund campaign
 */
export function useRefundCampaign() {
  const sdk = useODVProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      campaign: PublicKey;
      backing: PublicKey;
      usdcMint: PublicKey;
      campaignTokenAccount: PublicKey;
      backerTokenAccount: PublicKey;
    }) => {
      if (!sdk) throw new Error('Wallet not connected');
      return await sdk.refundCampaign(params);
    },
    onSuccess: (_, variables) => {
      // Invalidate backing data
      queryClient.invalidateQueries({ queryKey: ['backing', variables.backing.toString()] });
      queryClient.invalidateQueries({ queryKey: ['campaign', variables.campaign.toString()] });
    },
  });
}

/**
 * Hook to pause/unpause platform (Admin only)
 */
export function usePlatformControl() {
  const sdk = useODVProgram();
  const queryClient = useQueryClient();

  const pause = useMutation({
    mutationFn: async () => {
      if (!sdk) throw new Error('Wallet not connected');
      return await sdk.pausePlatform();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platformConfig'] });
    },
  });

  const unpause = useMutation({
    mutationFn: async () => {
      if (!sdk) throw new Error('Wallet not connected');
      return await sdk.unpausePlatform();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platformConfig'] });
    },
  });

  return { pause, unpause };
}

/**
 * Helper hook to get explorer URL
 */
export function useExplorerUrl() {
  const sdk = useODVProgram();

  return useCallback(
    (signature: string, cluster: 'devnet' | 'mainnet-beta' = 'devnet') => {
      if (!sdk) return '';
      return sdk.getExplorerUrl(signature, cluster);
    },
    [sdk]
  );
}
