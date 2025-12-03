'use client';

import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

// SOON Testnet RPC endpoint
const SOON_TESTNET_RPC = 'https://rpc.testnet.soo.network/rpc';

export const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    // Use SOON Testnet RPC as default
    const endpoint = useMemo(() => {
        return process.env.NEXT_PUBLIC_SOLANA_RPC_URL || SOON_TESTNET_RPC;
    }, []);

    // Phantom is auto-detected via Standard Wallet protocol, only include non-standard wallets
    const wallets = useMemo(
        () => [
            new SolflareWalletAdapter(),
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};
