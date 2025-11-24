'use client';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Loader2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { createFundCampaignTransaction } from "@/lib/solana/transaction";
import { isCampaignInitialized } from "@/lib/solana/campaign";
import { SuccessAnimation } from "./success-animation";
import { PublicKey } from "@solana/web3.js";

interface PaymentModalProps {
    projectTitle: string;
    projectId: string;
    creatorWallet: string;
    trigger?: React.ReactNode;
}

export function PaymentModal({ projectTitle, projectId, creatorWallet, trigger }: PaymentModalProps) {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<'idle' | 'checking' | 'processing' | 'minting' | 'success'>('idle');
    const [error, setError] = useState<string | null>(null);

    const handlePayment = async () => {
        if (!wallet.publicKey || !wallet.signTransaction) return;

        try {
            setError(null);
            setStatus('checking');

            // Parse creator wallet
            const creatorPubkey = new PublicKey(creatorWallet);

            // Check if campaign is initialized
            const campaignExists = await isCampaignInitialized(connection, creatorPubkey);

            if (!campaignExists) {
                setError("Campaign not initialized. Please contact the project creator.");
                setStatus('idle');
                return;
            }

            setStatus('processing');

            // Create fund transaction
            const transaction = await createFundCampaignTransaction(
                connection,
                wallet.publicKey,
                creatorPubkey,
                1 // 1 USDC
            );

            // Sign & Send
            const signature = await wallet.sendTransaction(transaction, connection);

            // Confirm
            await connection.confirmTransaction(signature, 'confirmed');

            setStatus('minting');

            // Mint NFT (Mock for now)
            await new Promise(resolve => setTimeout(resolve, 2000));

            setStatus('success');

        } catch (error) {
            console.error("Payment failed:", error);
            setStatus('idle');
            const errorMessage = error instanceof Error ? error.message : "Transaction failed";
            setError(errorMessage);
            alert(`Transaction failed: ${errorMessage}`);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || <Button>Back for $1</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                {status === 'success' ? (
                    <SuccessAnimation />
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Back {projectTitle}</DialogTitle>
                            <DialogDescription>
                                Support this project with 1 USDC. You'll receive a unique Backer NFT.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-6 space-y-4">
                            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                                <span className="font-medium">Total</span>
                                <span className="text-xl font-bold">1.00 USDC</span>
                            </div>

                            <div className="text-xs text-muted-foreground text-center">
                                + Network Fee (~0.000005 SOL)
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            {!wallet.connected ? (
                                <WalletMultiButton className="!w-full !justify-center" />
                            ) : (
                                <>
                                    {error && (
                                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                                            {error}
                                        </div>
                                    )}
                                    <Button
                                        size="lg"
                                        className="w-full"
                                        onClick={handlePayment}
                                        disabled={status !== 'idle'}
                                    >
                                        {status === 'checking' && (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Checking Campaign...
                                            </>
                                        )}
                                        {status === 'processing' && (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Confirming Transaction...
                                            </>
                                        )}
                                        {status === 'minting' && (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Minting NFT...
                                            </>
                                        )}
                                        {status === 'idle' && (
                                            <>
                                                Confirm Payment <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
