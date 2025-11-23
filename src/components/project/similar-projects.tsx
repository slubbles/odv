"use client"

import { ProjectCard } from "@/components/dashboard/project-card"

export function SimilarProjects() {
    // Mock data for similar projects
    const projects = [
        {
            id: "2",
            title: "DevFlow",
            description: "A developer-first workflow automation tool that integrates with your favorite IDEs.",
            status: "Funding" as const,
            raised: 450,
            goal: 1000,
            creatorName: "Alex Chen",
            creatorAvatar: "https://github.com/shadcn.png",
        },
        {
            id: "3",
            title: "CryptoGuard",
            description: "Real-time security monitoring for your Solana wallet assets.",
            status: "Funding" as const,
            raised: 120,
            goal: 1000,
            creatorName: "Security DAO",
            creatorAvatar: "https://github.com/shadcn.png",
        },
        {
            id: "4",
            title: "PixelArt AI",
            description: "Generate retro game assets with AI in seconds.",
            status: "Launched" as const,
            raised: 1000,
            goal: 1000,
            creatorName: "GameDev Studios",
            creatorAvatar: "https://github.com/shadcn.png",
        },
    ]

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold tracking-tight">You Might Also Like</h3>
            <div className="grid gap-6 md:grid-cols-3">
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        title={project.title}
                        description={project.description}
                        status={project.status}
                        raised={project.raised}
                        goal={project.goal}
                        creatorName={project.creatorName}
                        creatorAvatar={project.creatorAvatar}
                    />
                ))}
            </div>
        </div>
    )
}
