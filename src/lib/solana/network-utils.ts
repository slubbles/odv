/**
 * SOON Network Utilities
 * Helper functions for SOON Network (SVM Rollup) integration
 */

export type NetworkType = 'soon-testnet' | 'soon-devnet' | 'devnet' | 'mainnet-beta' | 'localnet';

/**
 * Check if the current network is SOON Network
 */
export function isSoonNetwork(): boolean {
    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || '';
    return network.includes('soon');
}

/**
 * Get the current network type
 */
export function getNetworkType(): NetworkType {
    return (process.env.NEXT_PUBLIC_SOLANA_NETWORK as NetworkType) || 'devnet';
}

/**
 * Get the RPC endpoint URL
 */
export function getRpcEndpoint(): string {
    return process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
}

/**
 * Get the explorer URL for a transaction
 * @param signature - Transaction signature
 * @returns Full URL to view the transaction on the appropriate explorer
 */
export function getExplorerTransactionUrl(signature: string): string {
    if (isSoonNetwork()) {
        const explorerBase = process.env.NEXT_PUBLIC_SOON_EXPLORER_URL || 'https://explorer.testnet.soo.network';
        return `${explorerBase}/tx/${signature}`;
    }
    
    const network = getNetworkType();
    const cluster = network === 'mainnet-beta' ? '' : `?cluster=${network}`;
    return `https://explorer.solana.com/tx/${signature}${cluster}`;
}

/**
 * Get the explorer URL for an address (account, program, etc.)
 * @param address - Public key address
 * @returns Full URL to view the address on the appropriate explorer
 */
export function getExplorerAddressUrl(address: string): string {
    if (isSoonNetwork()) {
        const explorerBase = process.env.NEXT_PUBLIC_SOON_EXPLORER_URL || 'https://explorer.testnet.soo.network';
        return `${explorerBase}/address/${address}`;
    }
    
    const network = getNetworkType();
    const cluster = network === 'mainnet-beta' ? '' : `?cluster=${network}`;
    return `https://explorer.solana.com/address/${address}${cluster}`;
}

/**
 * Get network display name
 */
export function getNetworkDisplayName(): string {
    const network = getNetworkType();
    
    switch (network) {
        case 'soon-testnet':
            return 'SOON Testnet';
        case 'soon-devnet':
            return 'SOON Devnet';
        case 'devnet':
            return 'Solana Devnet';
        case 'mainnet-beta':
            return 'Solana Mainnet';
        case 'localnet':
            return 'Localnet';
        default:
            return network;
    }
}

/**
 * Get faucet URL for requesting test tokens
 */
export function getFaucetUrl(): string | null {
    if (isSoonNetwork()) {
        return 'https://faucet.testnet.soo.network';
    }
    
    const network = getNetworkType();
    if (network === 'devnet') {
        return 'https://faucet.solana.com';
    }
    
    return null;
}

/**
 * SOON Network RPC endpoints
 */
export const SOON_RPC_ENDPOINTS = {
    testnet: 'https://rpc.testnet.soo.network/rpc',
    devnet: 'https://rpc.devnet.soo.network/rpc',
} as const;

/**
 * SOON Network explorer URLs
 */
export const SOON_EXPLORER_URLS = {
    testnet: 'https://explorer.testnet.soo.network',
    devnet: 'https://explorer.devnet.soo.network',
} as const;

/**
 * Check if a network is a testnet/devnet (not mainnet)
 */
export function isTestNetwork(): boolean {
    const network = getNetworkType();
    return network !== 'mainnet-beta';
}

/**
 * Get network-specific configuration
 */
export function getNetworkConfig() {
    return {
        type: getNetworkType(),
        rpcEndpoint: getRpcEndpoint(),
        displayName: getNetworkDisplayName(),
        isSoon: isSoonNetwork(),
        isTest: isTestNetwork(),
        faucetUrl: getFaucetUrl(),
        explorerBase: isSoonNetwork() 
            ? process.env.NEXT_PUBLIC_SOON_EXPLORER_URL 
            : 'https://explorer.solana.com',
    };
}
