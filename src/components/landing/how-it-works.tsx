'use client';

import { motion } from 'framer-motion';
import { Search, Wallet, Rocket, TrendingUp } from 'lucide-react';

const steps = [
    {
        icon: Search,
        title: "Discover",
        description: "Every day, one hand-picked project takes the spotlight. No noise, just quality.",
    },
    {
        icon: Wallet,
        title: "Back for $1",
        description: "Support projects you believe in with a single dollar. Low risk, high reward potential.",
    },
    {
        icon: Rocket,
        title: "Get NFT & Access",
        description: "Receive a unique backer NFT and exclusive access to the creator's journey.",
    },
    {
        icon: TrendingUp,
        title: "Track Growth",
        description: "Watch your portfolio of backed projects grow as they hit milestones.",
    },
];

export function HowItWorks() {
    return (
        <section className="py-24 bg-muted/30 border-y">
            <div className="container px-4 mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">How OneDollarVentures Works</h2>
                    <p className="text-muted-foreground">
                        We've simplified venture capital for everyone. No accredited investor status needed.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative p-6 bg-background rounded-xl border shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                                <step.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {step.description}
                            </p>

                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-12 -right-4 w-8 border-t-2 border-dashed border-muted-foreground/30 z-10" />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
