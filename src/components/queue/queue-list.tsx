"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { Project } from "@/lib/types/project"

export function QueueList() {
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchQueueProjects() {
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('status', 'queue')
                    .order('created_at', { ascending: true })

                if (error) throw error

                setProjects(data || [])
            } catch (err) {
                console.error("Failed to fetch queue projects:", err)
                setError(err instanceof Error ? err.message : "Failed to load projects")
            } finally {
                setIsLoading(false)
            }
        }

        fetchQueueProjects()
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (error) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-center text-destructive">Error: {error}</p>
                </CardContent>
            </Card>
        )
    }

    if (projects.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">No projects in queue yet.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {projects.map((project, index) => (
                <Card key={project.id} className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <Badge variant="outline" className="font-mono">
                                        #{index + 1}
                                    </Badge>
                                    <Badge>{project.category}</Badge>
                                </div>
                                <CardTitle className="text-xl">{project.title}</CardTitle>
                                <CardDescription className="line-clamp-2">
                                    {project.tagline}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={project.creator_avatar} />
                                    <AvatarFallback>{project.creator_name?.[0] || "?"}</AvatarFallback>
                                </Avatar>
                                <div className="text-sm">
                                    <p className="font-medium">{project.creator_name || project.creator_wallet.slice(0, 8)}</p>
                                    <p className="text-muted-foreground">
                                        Goal: ${project.goal.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">
                                View Details <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
