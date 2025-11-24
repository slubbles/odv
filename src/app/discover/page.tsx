"use client"

import { ProjectCard } from "@/components/dashboard/project-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Loader2, Plus } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { supabase } from "@/lib/supabase/client"
import { Project } from "@/lib/types/project"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"

export default function ArchivePage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [sortBy, setSortBy] = useState("newest")
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [isFiltering, setIsFiltering] = useState(false)

    useEffect(() => {
        fetchProjects()
    }, [sortBy])

    async function fetchProjects() {
        try {
            let query = supabase
                .from('projects')
                .select('*')
                .in('status', ['active', 'completed'])

            // Apply sorting
            if (sortBy === 'newest') {
                query = query.order('created_at', { ascending: false })
            } else if (sortBy === 'funded') {
                query = query.order('raised', { ascending: false })
            } else if (sortBy === 'almost') {
                query = query.order('raised', { ascending: false })
            }

            const { data, error } = await query

            if (error) throw error
            setProjects(data || [])
        } catch (error) {
            console.error("Error fetching projects:", error)
        } finally {
            setLoading(false)
        }
    }

    // Filter handlers with loading states
    const handleCategoryChange = (value: string) => {
        setIsFiltering(true)
        setCategoryFilter(value)
        setTimeout(() => setIsFiltering(false), 100)
    }

    const handleSortChange = (value: string) => {
        setIsFiltering(true)
        setSortBy(value)
        setTimeout(() => setIsFiltering(false), 100)
    }

    // Memoize filtered projects for performance
    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description?.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = categoryFilter === "all" || project.category === categoryFilter
            return matchesSearch && matchesCategory
        })
    }, [projects, searchQuery, categoryFilter])

    return (
        <div className="container py-12 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Discover Projects</h1>
                    <p className="text-muted-foreground">
                        Explore active projects backed by the community.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-3 py-1">
                        {filteredProjects.length} Projects
                    </Badge>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-muted/30 rounded-lg border relative">
                {isFiltering && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] rounded-lg flex items-center justify-center z-10">
                        <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                )}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-background"
                        aria-label="Search projects by title or description"
                    />
                </div>
                <div className="w-full md:w-[200px]">
                    <Select value={categoryFilter} onValueChange={handleCategoryChange} aria-label="Filter projects by category">
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
                <div className="w-full md:w-[180px]">
                    <Select value={sortBy} onValueChange={handleSortChange} aria-label="Sort projects">
                        <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="funded">Most Funded</SelectItem>
                            <SelectItem value="almost">Almost There</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex flex-col space-y-3">
                            <Skeleton className="h-[200px] w-full rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-[80%]" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredProjects.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.map((project) => (
                        <Link key={project.id} href={`/projects/${project.id}`}>
                            <ProjectCard
                                title={project.title}
                                description={project.tagline || project.description}
                                status={project.status === 'active' ? 'Funding' : 'Launched'}
                                raised={project.raised || 0}
                                goal={project.goal}
                                creatorName={project.creator_name || 'Anonymous'}
                                creatorAvatar={project.creator_avatar || ''}
                            />
                        </Link>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={Search}
                    title="No projects found"
                    description={
                        searchQuery || categoryFilter !== 'all'
                            ? 'Try adjusting your search or filters to find more projects.'
                            : 'Be the first to submit a project and start building!'
                    }
                    action={
                        <div className="flex gap-3 justify-center mt-4">
                            {(searchQuery || categoryFilter !== 'all') && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery("")
                                        setCategoryFilter("all")
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            )}
                            <Button asChild>
                                <Link href="/submit">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Submit Your Project
                                </Link>
                            </Button>
                        </div>
                    }
                />
            )}
        </div>
    )
}
