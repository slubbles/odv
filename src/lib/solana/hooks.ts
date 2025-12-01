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
 * Hook to fetch campaign data by creator
 */
export function useCampaign(creatorWallet: string | PublicKey | null) {
  const sdk = useODVProgram();

  return useQuery({
    queryKey: ['campaign', creatorWallet?.toString()],
    queryFn: async () => {
      if (!sdk) throw new Error('Wallet not connected');
      if (!creatorWallet) throw new Error('Creator wallet required');

      const pubkey = typeof creatorWallet === 'string' ? new PublicKey(creatorWallet) : creatorWallet;
      return await sdk.getCampaign(pubkey);
    },
    enabled: !!sdk && !!creatorWallet,
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Hook to initialize a campaign (create new crowdfunding campaign)
 */
export function useInitializeCampaign() {
  const sdk = useODVProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      goal: number; // in USDC (will be converted to smallest units)
      durationDays: number;
      milestones: Array<{ title: string; amount: number }>;
    }) => {
      if (!sdk) throw new Error('Wallet not connected');

      const goal = new BN(params.goal * 1_000_000); // Convert USDC to smallest units
      const deadline = new BN(Math.floor(Date.now() / 1000) + params.durationDays * 86400);
      
      // Convert milestones amounts to BN
      const milestones = params.milestones.map(m => ({
        title: m.title,
        amount: new BN(m.amount * 1_000_000),
      }));

      return await sdk.initializeCampaign({
        goal,
        deadline,
        milestones,
      });
    },
    onSuccess: () => {
      // Invalidate platform config to update campaign counter
      queryClient.invalidateQueries({ queryKey: ['platformConfig'] });
    },
  });
}

/**
 * Hook to fund/back a project
 */
export function useFundCampaign() {
  const sdk = useODVProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      creatorWallet: string | PublicKey;
    }) => {
      if (!sdk) throw new Error('Wallet not connected');
      
      const creatorPubkey = typeof params.creatorWallet === 'string' 
        ? new PublicKey(params.creatorWallet) 
        : params.creatorWallet;
        
      return await sdk.fundCampaign({ creatorWallet: creatorPubkey });
    },
    onSuccess: (_, variables) => {
      const creatorKey = typeof variables.creatorWallet === 'string' 
        ? variables.creatorWallet 
        : variables.creatorWallet.toString();
      // Invalidate campaign data to show updated backing count
      queryClient.invalidateQueries({ queryKey: ['campaign', creatorKey] });
    },
  });
}

/**
 * Hook to submit milestone proof
 */
export function useSubmitMilestoneProof() {
  const sdk = useODVProgram();
  const wallet = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      proofUrl: string;
    }) => {
      if (!sdk) throw new Error('Wallet not connected');
      return await sdk.submitMilestoneProof(params);
    },
    onSuccess: () => {
      // Invalidate campaign data to show updated milestone
      if (wallet.publicKey) {
        queryClient.invalidateQueries({ queryKey: ['campaign', wallet.publicKey.toString()] });
      }
    },
  });
}

/**
 * Hook to release milestone funds
 */
export function useReleaseMilestone() {
  const sdk = useODVProgram();
  const wallet = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!sdk) throw new Error('Wallet not connected');
      return await sdk.releaseMilestone({});
    },
    onSuccess: () => {
      // Invalidate campaign data to show released milestone
      if (wallet.publicKey) {
        queryClient.invalidateQueries({ queryKey: ['campaign', wallet.publicKey.toString()] });
      }
    },
  });
}

/**
 * Hook to refund campaign (for backers after failed campaign)
 */
export function useRefundCampaign() {
  const sdk = useODVProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      creatorWallet: string | PublicKey;
    }) => {
      if (!sdk) throw new Error('Wallet not connected');
      
      const creatorPubkey = typeof params.creatorWallet === 'string' 
        ? new PublicKey(params.creatorWallet) 
        : params.creatorWallet;
        
      return await sdk.refundCampaign({ creatorWallet: creatorPubkey });
    },
    onSuccess: (_, variables) => {
      const creatorKey = typeof variables.creatorWallet === 'string' 
        ? variables.creatorWallet 
        : variables.creatorWallet.toString();
      queryClient.invalidateQueries({ queryKey: ['campaign', creatorKey] });
    },
  });
}

/**
 * Hook to approve milestone (Admin only)
 */
export function useApproveMilestone() {
  const sdk = useODVProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      creatorWallet: string | PublicKey;
    }) => {
      if (!sdk) throw new Error('Wallet not connected');
      
      const creatorPubkey = typeof params.creatorWallet === 'string' 
        ? new PublicKey(params.creatorWallet) 
        : params.creatorWallet;
        
      return await sdk.approveMilestone({ creatorWallet: creatorPubkey });
    },
    onSuccess: (_, variables) => {
      const creatorKey = typeof variables.creatorWallet === 'string' 
        ? variables.creatorWallet 
        : variables.creatorWallet.toString();
      queryClient.invalidateQueries({ queryKey: ['campaign', creatorKey] });
    },
  });
}

/**
 * Hook to reject milestone (Admin only)
 */
export function useRejectMilestone() {
  const sdk = useODVProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      creatorWallet: string | PublicKey;
    }) => {
      if (!sdk) throw new Error('Wallet not connected');
      
      const creatorPubkey = typeof params.creatorWallet === 'string' 
        ? new PublicKey(params.creatorWallet) 
        : params.creatorWallet;
        
      return await sdk.rejectMilestone({ creatorWallet: creatorPubkey });
    },
    onSuccess: (_, variables) => {
      const creatorKey = typeof variables.creatorWallet === 'string' 
        ? variables.creatorWallet 
        : variables.creatorWallet.toString();
      queryClient.invalidateQueries({ queryKey: ['campaign', creatorKey] });
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
 * Check if current wallet is admin
 */
export function useIsAdmin() {
  const sdk = useODVProgram();
  return sdk?.isAdmin() ?? false;
}

/**
 * Helper hook to get explorer URL
 */
export function useExplorerUrl() {
  const sdk = useODVProgram();

  return useCallback(
    (signature: string) => {
      if (!sdk) return '';
      return sdk.getExplorerUrl(signature);
    },
    [sdk]
  );
}
