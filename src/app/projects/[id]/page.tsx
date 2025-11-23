'use client';

import { ProjectHeader } from "@/components/project/project-header";
import { ProjectTabs } from "@/components/project/project-tabs";
import { CommentSection } from "@/components/project/comment-section";
import { Project } from "@/lib/types/project";
import { useWallet } from "@solana/wallet-adapter-react";
import { useParams } from "next/navigation";

// Mock Data Generator
const getMockProject = (id: string): Project => ({
    id,
    created_at: new Date().toISOString(),
    title: "EchoNotes",
    tagline: "AI-powered voice memos that organize themselves.",
    description: "EchoNotes automatically transcribes, summarizes, and tags your voice notes using advanced LLMs. Perfect for capturing ideas on the go without the mess. Built by a team of ex-Spotify engineers.\n\nWe are building a mobile-first experience that integrates directly with your favorite productivity tools like Notion, Obsidian, and Linear.",
    category: "SaaS",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=1&controls=0&showinfo=0&rel=0",
    creator_wallet: "8x...",
    creator_name: "Sarah & Tom",
    creator_avatar: "https://github.com/shadcn.png",
    creator_bio: "Ex-Spotify engineers building the future of voice notes.",
    twitter_link: "https://twitter.com",
    github_link: "https://github.com",
    website_link: "https://example.com",
    status: "active",
    raised: 842,
    goal: 1000,
    backers_count: 842,
    deadline: "2025-12-31",
    milestones: [
        {
            id: "m1",
            project_id: id,
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
            project_id: id,
            title: "Beta Launch",
            description: "Public beta release with Notion integration.",
            percentage: 30,
            amount: 300,
            deadline: "2024-01-15",
            status: "in_review",
        },
        {
            id: "m3",
            project_id: id,
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
                <ProjectTabs
                    project={project}
                    isCreator={isCreator}
                    isBacker={isBacker}
                />
            </div>

            <div className="mt-12">
                <CommentSection projectId={project.id} />
            </div>
        </div>
    );
}
