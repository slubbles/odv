'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export function SuccessAnimation() {
    return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
            </motion.div>

            <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold mb-2"
            >
                You're a Backer!
            </motion.h3>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground"
            >
                Transaction confirmed. Your NFT is being minted.
            </motion.p>
        </div>
    );
}
