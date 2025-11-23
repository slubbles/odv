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
import { createBackingTransaction } from "@/lib/solana/transaction";
import { mintBackerNFT } from "@/lib/solana/nft";
import { SuccessAnimation } from "./success-animation";
// import { useToast } from "@/hooks/use-toast"; // Removed: File does not exist

interface PaymentModalProps {
    projectTitle: string;
    trigger?: React.ReactNode;
}

export function PaymentModal({ projectTitle, trigger }: PaymentModalProps) {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<'idle' | 'processing' | 'minting' | 'success'>('idle');
    // const { toast } = useToast(); // Commented out until hook is verified

    const handlePayment = async () => {
        if (!wallet.publicKey || !wallet.signTransaction) return;

        try {
            setStatus('processing');

            // 1. Create Transaction
            const transaction = await createBackingTransaction(
                connection,
                wallet.publicKey
            );

            // 2. Sign & Send
            const signature = await wallet.sendTransaction(transaction, connection);

            // 3. Confirm
            await connection.confirmTransaction(signature, 'confirmed');

            setStatus('minting');

            // 4. Mint NFT (Mock/Real)
            // await mintBackerNFT(connection, wallet, projectTitle, 123); // Uncomment when Metaplex is fully setup

            // Simulate minting delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            setStatus('success');

        } catch (error) {
            console.error("Payment failed:", error);
            setStatus('idle');
            alert("Transaction failed. Please check your balance (Devnet USDC) and try again.");
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
                                <Button
                                    size="lg"
                                    className="w-full"
                                    onClick={handlePayment}
                                    disabled={status !== 'idle'}
                                >
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
                            )}
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
