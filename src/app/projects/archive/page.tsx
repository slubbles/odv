"use client"

import { ProjectCard } from "@/components/dashboard/project-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { useState } from "react"

export default function ArchivePage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")

    // Mock Data
    const projects = [
        {
            id: "1",
            title: "EchoNotes",
            description: "AI-powered voice memos that organize themselves.",
            status: "Funding" as const,
            raised: 842,
            goal: 1000,
            category: "SaaS",
            creatorName: "Sarah & Tom",
            creatorAvatar: "https://github.com/shadcn.png",
        },
        {
            id: "2",
            title: "DevFlow",
            description: "A developer-first workflow automation tool that integrates with your favorite IDEs.",
            status: "Funding" as const,
            raised: 450,
            goal: 1000,
            category: "SaaS",
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
            category: "Web3",
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
            category: "Game",
            creatorName: "GameDev Studios",
            creatorAvatar: "https://github.com/shadcn.png",
        },
        {
            id: "5",
            title: "GreenThumb",
            description: "Smart sensors for your indoor plants.",
            status: "Launched" as const,
            raised: 1000,
            goal: 1000,
            category: "Hardware",
            creatorName: "EcoTech",
            creatorAvatar: "https://github.com/shadcn.png",
        },
        {
            id: "6",
            title: "Community Hub",
            description: "A platform for local community organizing.",
            status: "In Progress" as const,
            raised: 750,
            goal: 1000,
            category: "Community",
            creatorName: "Local Heroes",
            creatorAvatar: "https://github.com/shadcn.png",
        },
    ]

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = categoryFilter === "all" || project.category === categoryFilter
        return matchesSearch && matchesCategory
    })

    return (
        <div className="container py-12 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Project Archive</h1>
                    <p className="text-muted-foreground">
                        Explore past projects backed by the community.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-3 py-1">
                        {filteredProjects.length} Projects
                    </Badge>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-muted/30 rounded-lg border">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-background"
                    />
                </div>
                <div className="w-full md:w-[200px]">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="bg-background">
                            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="SaaS">SaaS</SelectItem>
                            <SelectItem value="Web3">Web3</SelectItem>
                            <SelectItem value="Game">Game</SelectItem>
                            <SelectItem value="Hardware">Hardware</SelectItem>
                            <SelectItem value="Community">Community</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Grid */}
            {filteredProjects.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.map((project) => (
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
            ) : (
                <div className="text-center py-24 border rounded-lg bg-muted/10">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No projects found</h3>
                    <p className="text-muted-foreground mb-4">
                        Try adjusting your search or filters.
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchQuery("")
                            setCategoryFilter("all")
                        }}
                    >
                        Clear Filters
                    </Button>
                </div>
            )}
        </div>
    )
}
