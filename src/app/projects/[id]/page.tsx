'use client';

import { ProjectHeader } from "@/components/project/project-header";
import { MilestoneTimeline } from "@/components/project/milestone-timeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/lib/types/project";
import { useWallet } from "@solana/wallet-adapter-react";
import { useParams } from "next/navigation";

// Mock Data Generator
const getMockProject = (id: string): Project => ({
    id,
    title: "EchoNotes",
    tagline: "AI-powered voice memos that organize themselves.",
    description: "EchoNotes automatically transcribes, summarizes, and tags your voice notes using advanced LLMs. Perfect for capturing ideas on the go without the mess. Built by a team of ex-Spotify engineers.\n\nWe are building a mobile-first experience that integrates directly with your favorite productivity tools like Notion, Obsidian, and Linear.",
    category: "SaaS",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=1&controls=0&showinfo=0&rel=0",
    creator: {
        name: "Sarah & Tom",
        walletAddress: "8x...",
        avatarUrl: "https://github.com/shadcn.png",
    },
    stats: {
        backers: 842,
        raised: 842,
        goal: 1000,
        daysLeft: 18,
    },
    milestones: [
        {
            id: "m1",
            title: "Mobile App Prototype",
            description: "Functional iOS prototype with basic recording and transcription.",
            percentage: 20,
            amount: 200,
            deadline: "2023-12-01",
            status: "completed",
            proof: {
                description: "TestFlight link sent to early backers.",
                links: ["https://testflight.apple.com/..."],
                files: [],
                submittedAt: "2023-11-28",
            }
        },
        {
            id: "m2",
            title: "Beta Launch",
            description: "Public beta release with Notion integration.",
            percentage: 30,
            amount: 300,
            deadline: "2024-01-15",
            status: "in_review",
        },
        {
            id: "m3",
            title: "Official Launch",
            description: "App Store release and premium features.",
            percentage: 50,
            amount: 500,
            deadline: "2024-03-01",
            status: "locked",
        },
    ],
});

export default function ProjectPage() {
    const params = useParams();
    const { publicKey } = useWallet();
    const project = getMockProject(params.id as string);

    // Mock logic to determine if user is creator or backer
    const isCreator = true; // For demo purposes
    const isBacker = true;

    return (
        <div className="container py-12 max-w-5xl">
            <ProjectHeader project={project} />

            <div className="mt-12">
                <Tabs defaultValue="milestones" className="w-full">
                    <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                        <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="milestones" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">
                            Milestones & Updates
                        </TabsTrigger>
                        <TabsTrigger value="community" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">
                            Community
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-8">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                                    {project.description}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="milestones" className="mt-8">
                        <div className="grid md:grid-cols-[1fr_300px] gap-8">
                            <div>
                                <h3 className="text-xl font-bold mb-6">Project Roadmap</h3>
                                <MilestoneTimeline
                                    milestones={project.milestones}
                                    isCreator={isCreator}
                                    isBacker={isBacker}
                                />
                            </div>
                            <div className="space-y-6">
                                <Card>
                                    <CardContent className="pt-6">
                                        <h4 className="font-bold mb-2">About Milestones</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Funds are held in escrow and released only when milestones are completed and approved by backers.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="community" className="mt-8">
                        <div className="text-center py-12 text-muted-foreground">
                            Community features coming soon.
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
