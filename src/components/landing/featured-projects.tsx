'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Project } from "@/lib/types/project";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, ArrowRight, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function FeaturedProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedProjects();
    }, []);

    async function fetchFeaturedProjects() {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: false })
                .limit(6);

            if (error) throw error;
            setProjects(data || []);
        } catch (error) {
            console.error("Error fetching featured projects:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <section className="py-24 bg-muted/30">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight mb-4">Featured Projects</h2>
                        <p className="text-muted-foreground text-lg">
                            Support innovative projects with just $1
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Card key={i} className="h-full">
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-2">
                                        <Skeleton className="h-5 w-16" />
                                        <Skeleton className="h-5 w-16" />
                                    </div>
                                    <Skeleton className="h-6 w-full mb-2" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <Skeleton className="h-4 w-12" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                        <Skeleton className="h-2 w-full" />
                                        <div className="flex justify-between text-xs">
                                            <Skeleton className="h-3 w-20" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (projects.length === 0) {
        return (
            <section className="py-24 bg-muted/30">
                <div className="container">
                    <EmptyState
                        icon={FolderOpen}
                        title="No active projects yet"
                        description="Be the first to launch your idea and get funded!"
                        action={
                            <Button asChild>
                                <Link href="/submit">Submit Your Project</Link>
                            </Button>
                        }
                    />
                </div>
            </section>
        );
    }

    return (
        <TooltipProvider>
            <section className="py-24 bg-muted/30">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight mb-4">Featured Projects</h2>
                        <p className="text-muted-foreground text-lg">
                            Support innovative projects with just $1
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
                        {projects.map((project) => {
                            const fundingPercentage = (project.raised / project.goal) * 100;

                            return (
                                <Link key={project.id} href={`/projects/${project.id}`}>
                                    <Card className="h-full hover:shadow-lg transition-all cursor-pointer group">
                                        <CardHeader>
                                            <div className="flex items-start justify-between mb-2">
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Badge variant="default" className="group-hover:bg-primary/80">
                                                            {project.category}
                                                        </Badge>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Browse more {project.category} projects</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                                <Badge variant="outline">Active</Badge>
                                            </div>
                                            <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                                                {project.title}
                                            </CardTitle>
                                            <CardDescription className="line-clamp-2">
                                                {project.tagline}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Raised</span>
                                                    <span className="font-bold">
                                                        ${(project.raised || 0).toLocaleString()} / ${project.goal.toLocaleString()}
                                                    </span>
                                                </div>
                                                <Progress value={Math.min(fundingPercentage, 100)} className="h-2" />
                                                <div className="flex justify-between text-xs text-muted-foreground">
                                                    <span>{fundingPercentage.toFixed(1)}% funded</span>
                                                    <span>{project.backers_count || 0} backers</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="text-center">
                        <Button size="lg" asChild variant="outline">
                            <Link href="/discover">
                                View All Projects <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </TooltipProvider>
    );
}
