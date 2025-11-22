'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export function SuccessAnimation() {
    return (
        <div className="flex flex-col items-center justify-center py-8">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                }}
                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Check className="w-12 h-12 text-white" strokeWidth={3} />
                </motion.div>
            </motion.div>

            <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-center mb-2"
            >
                Payment Successful!
            </motion.h3>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground text-center"
            >
                You are now a backer. Your NFT is being minted.
            </motion.p>
        </div>
    );
}
