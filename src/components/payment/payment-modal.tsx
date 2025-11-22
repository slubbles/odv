'use client';

import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { createBackingTransaction, mintBackerNFT } from '@/lib/solana/transaction';
import { SuccessAnimation } from './success-animation';

export function PaymentModal({ children }: { children: React.ReactNode }) {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handlePayment = async () => {
        if (!publicKey) {
            toast.error("Wallet not connected");
            return;
        }

        setIsLoading(true);

        try {
            // 1. Create and Send Transaction
            console.log("Creating transaction...");
            const transaction = await createBackingTransaction(connection, publicKey);

            console.log("Sending transaction...");
            const signature = await sendTransaction(transaction, connection);

            console.log("Confirming transaction...");
            toast.info("Transaction sent. Waiting for confirmation...");

            await connection.confirmTransaction(signature, 'confirmed');
            toast.success("Payment confirmed!");

            // 2. Mint NFT (Mock)
            await mintBackerNFT(publicKey);

            setIsSuccess(true);
        } catch (error: any) {
            console.error("Payment failed:", error);
            toast.error("Payment failed: " + (error.message || "Unknown error"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            // Reset state when closing
            setTimeout(() => {
                setIsSuccess(false);
                setIsLoading(false);
            }, 300);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                {isSuccess ? (
                    <SuccessAnimation />
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Back Project</DialogTitle>
                            <DialogDescription>
                                Support this project with a $1 USDC contribution.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-6 space-y-4">
                            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg border">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-muted-foreground">Amount</span>
                                    <span className="text-2xl font-bold">1.00 USDC</span>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <span className="text-blue-500 font-bold">$</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-blue-500/5 p-3 rounded text-blue-600">
                                <ShieldCheck className="w-4 h-4" />
                                <span>Secure transaction via Solana Pay</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button
                                size="lg"
                                className="w-full"
                                onClick={handlePayment}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Confirm Payment <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                            <p className="text-xs text-center text-muted-foreground">
                                + Network Fee (~0.000005 SOL)
                            </p>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
