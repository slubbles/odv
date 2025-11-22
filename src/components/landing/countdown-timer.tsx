'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setUTCHours(24, 0, 0, 0);

            const difference = tomorrow.getTime() - now.getTime();

            if (difference > 0) {
                return {
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return { hours: 0, minutes: 0, seconds: 0 };
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!timeLeft) return null; // Avoid hydration mismatch

    return (
        <div className="flex items-center space-x-2 font-mono text-sm font-medium text-muted-foreground">
            <div className="flex items-center space-x-1">
                <TimeUnit value={timeLeft.hours} label="h" />
                <span>:</span>
                <TimeUnit value={timeLeft.minutes} label="m" />
                <span>:</span>
                <TimeUnit value={timeLeft.seconds} label="s" />
            </div>
            <span className="text-xs text-muted-foreground/60 uppercase tracking-wider">remaining</span>
        </div>
    );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex items-baseline">
            <motion.span
                key={value}
                initial={{ y: -5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="tabular-nums text-foreground"
            >
                {value.toString().padStart(2, '0')}
            </motion.span>
        </div>
    );
}
