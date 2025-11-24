'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CountdownTimer } from './countdown-timer';
import { PaymentModal } from '@/components/payment/payment-modal';
import { ClientOnlyWalletButton } from '@/components/wallet/client-only-wallet-button';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Trophy, ExternalLink, Info } from 'lucide-react';
import Link from 'next/link';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Hero() {
    const { connected } = useWallet();

    // Mock data for &quot;Today&apos;s Project&quot;
    const project = {
        title: "EchoNotes",
        tagline: "AI-powered voice memos that organize themselves.",
        description: "EchoNotes automatically transcribes, summarizes, and tags your voice notes using advanced LLMs. Perfect for capturing ideas on the go without the mess. Built by a team of ex-Spotify engineers.",
        creator: "Sarah & Tom",
        backers: 842,
        goal: 1000,
        category: "SaaS",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=1&controls=0&showinfo=0&rel=0", // Placeholder
    };

    const progress = (project.backers / project.goal) * 100;

    return (
        <TooltipProvider>
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="flex flex-col items-center mb-12 text-center">
                        <Badge variant="outline" className="mb-4 py-1.5 px-4 border-primary/20 bg-primary/5 text-primary animate-pulse">
                            <span className="mr-2">🔥</span> Today&apos;s Spotlight
                        </Badge>
                        <Badge variant="secondary" className="mb-4 py-1 px-3 text-xs">
                            🎬 Demo Project
                        </Badge>
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl mb-6">
                            One Dollar. <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">One Dream.</span>
                        </h1>
                        <p className="max-w-[700px] text-muted-foreground md:text-xl mb-8">
                            Back the next big thing with just $1. Get unique NFTs, early access, and join the journey.
                        </p>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <Tooltip key={i}>
                                        <TooltipTrigger asChild>
                                            <div className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold cursor-default hover:z-10 transition-transform hover:scale-110">
                                                U{i}
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>User {i} backed recently</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                <span className="font-bold text-foreground">12,403</span> backers joined this month
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
                            <Button size="lg" asChild className="shadow-lg shadow-primary/20">
                                <Link href="/submit">Submit Your Project <ArrowRight className="w-4 h-4 ml-2" /></Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href="/projects/archive">Discover Projects</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
                        {/* Project Media */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative aspect-video rounded-xl overflow-hidden border bg-muted shadow-2xl"
                        >
                            <iframe
                                width="100%"
                                height="100%"
                                src={project.videoUrl}
                                title="Project Demo"
                                className="absolute inset-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            />
                            <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                Live Pitch
                            </div>
                        </motion.div>

                        {/* Project Details */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-col justify-center h-full space-y-6"
                        >
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-0">
                                        {project.category}
                                    </Badge>
                                    <CountdownTimer />
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight">{project.title}</h2>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>by</span>
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <Button variant="link" className="p-0 h-auto font-semibold text-foreground">
                                                {project.creator}
                                            </Button>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-80">
                                            <div className="flex justify-between space-x-4">
                                                <Avatar>
                                                    <AvatarImage src="https://github.com/shadcn.png" />
                                                    <AvatarFallback>ST</AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-semibold">{project.creator}</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        Building tools for the future of audio. Previously at Spotify.
                                                    </p>
                                                    <div className="flex items-center pt-2">
                                                        <span className="text-xs text-muted-foreground">
                                                            Joined December 2023
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
                                </div>
                                <p className="text-xl font-medium text-muted-foreground">{project.tagline}</p>
                            </div>

                            <p className="text-muted-foreground leading-relaxed">
                                {project.description}
                            </p>

                            <div className="space-y-4 p-6 bg-muted/30 rounded-xl border">
                                <div className="flex justify-between text-sm font-medium">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="flex items-center gap-2 cursor-help">
                                                <Users className="w-4 h-4 text-primary" />
                                                <span>{project.backers} Backers</span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Total unique wallets that backed this project</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="flex items-center gap-2 cursor-help">
                                                <Trophy className="w-4 h-4 text-yellow-500" />
                                                <span>Goal: {project.goal}</span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Funding goal in USDC</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <Progress value={progress} className="h-3" />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{Math.round(progress)}% Funded</span>
                                    <span>{project.goal - project.backers} spots left</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                {!connected ? (
                                    <div className="w-full">
                                        <ClientOnlyWalletButton className="!w-full !justify-center !bg-primary !h-12 !rounded-lg hover:!bg-primary/90 transition-all" />
                                        <p className="text-xs text-center mt-2 text-muted-foreground">Connect wallet to back this project</p>
                                    </div>
                                ) : (
                                    <PaymentModal
                                        projectTitle={project.title}
                                        projectId="demo-project"
                                        creatorWallet="11111111111111111111111111111111"
                                        trigger={
                                            <Button size="lg" className="w-full h-12 text-lg gap-2 shadow-lg shadow-primary/20">
                                                Back for $1 USDC <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        }
                                    />
                                )}
                                <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-foreground">
                                    View Full Pitch <ExternalLink className="w-3 h-3 ml-2" />
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </TooltipProvider>
    );
}
