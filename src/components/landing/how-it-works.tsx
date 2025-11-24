'use client';

import { motion } from 'framer-motion';
import { Search, Wallet, Rocket, TrendingUp, Info } from 'lucide-react';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

const steps = [
    {
        icon: Search,
        title: "Discover",
        description: "Every day, one hand-picked project takes the spotlight. No noise, just quality.",
        details: "Our team vets hundreds of submissions to bring you only the most promising projects. We focus on innovation, team capability, and market potential.",
    },
    {
        icon: Wallet,
        title: "Back for $1",
        description: "Support projects you believe in with a single dollar. Low risk, high reward potential.",
        details: "Using Solana&apos;s low fees, we make micro-investing possible. Your $1 goes directly to the project&apos;s funding pool via smart contract.",
    },
    {
        icon: Rocket,
        title: "Get NFT & Access",
        description: "Receive a unique backer NFT and exclusive access to the creator&apos;s journey.",
        details: "Your NFT is your proof of early support. It grants you access to private Discord channels, beta testing, and potential future airdrops.",
    },
    {
        icon: TrendingUp,
        title: "Track Growth",
        description: "Watch your portfolio of backed projects grow as they hit milestones.",
        details: "Get real-time updates on project progress. As projects succeed, the value of your early support and NFT may increase.",
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
                            className="relative p-6 bg-background rounded-xl border shadow-sm hover:shadow-md transition-shadow group"
                        >
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <step.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                {step.description}
                            </p>

                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <Button variant="ghost" size="sm" className="w-full justify-start p-0 h-auto text-xs text-primary hover:text-primary/80 hover:bg-transparent">
                                        <Info className="w-3 h-3 mr-1" /> Learn more
                                    </Button>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold flex items-center">
                                            <step.icon className="w-4 h-4 mr-2 text-primary" />
                                            {step.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            {step.details}
                                        </p>
                                    </div>
                                </HoverCardContent>
                            </HoverCard>

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
