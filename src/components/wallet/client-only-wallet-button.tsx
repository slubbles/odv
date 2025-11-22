'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';

export function ClientOnlyWalletButton({ className }: { className?: string }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className={className} disabled>
                Select Wallet
            </button>
        );
    }

    return <WalletMultiButton className={className} />;
}
