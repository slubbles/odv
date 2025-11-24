'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Project } from "@/lib/types/project";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default async function CreatorProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const creatorWallet = id;

    return <CreatorProfile creatorWallet={creatorWallet} />;
}

function CreatorProfile({ creatorWallet }: { creatorWallet: string }) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCreatorProjects();
    }, [creatorWallet]);

    async function fetchCreatorProjects() {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('creator_wallet', creatorWallet)
                .in('status', ['active', 'completed', 'queue'])
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProjects(data || []);
        } catch (error) {
            console.error("Error fetching creator projects:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // Get creator info from first project (denormalized data)
    const creatorName = projects[0]?.creator_name || creatorWallet.slice(0, 8);
    const creatorAvatar = projects[0]?.creator_avatar;
    const creatorBio = projects[0]?.creator_bio || "No bio available";

    return (
        <div className="space-y-8">
            {/* Profile Header */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-start gap-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={creatorAvatar} />
                            <AvatarFallback className="text-2xl">
                                {creatorName[0]?.toUpperCase() || "?"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <h1 className="text-3xl font-bold">{creatorName}</h1>
                            <p className="text-sm text-muted-foreground font-mono">
                                {creatorWallet}
                            </p>
                            <p className="text-muted-foreground">{creatorBio}</p>
                            <div className="flex gap-4 pt-2">
                                <div>
                                    <div className="text-2xl font-bold">{projects.length}</div>
                                    <div className="text-sm text-muted-foreground">Projects</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">
                                        ${projects.reduce((sum, p) => sum + (p.raised || 0), 0).toLocaleString()}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Total Raised</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Projects List */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Projects</h2>
                {projects.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            This creator hasn&apos;t published any projects yet.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => (
                            <Link key={project.id} href={`/projects/${project.id}`}>
                                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                                    <CardHeader>
                                        <div className="flex items-start justify-between mb-2">
                                            <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                                                {project.status}
                                            </Badge>
                                            <Badge variant="outline">{project.category}</Badge>
                                        </div>
                                        <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                                        <CardDescription className="line-clamp-2">
                                            {project.tagline}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Raised</span>
                                            <span className="font-medium">
                                                ${(project.raised || 0).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Goal</span>
                                            <span className="font-medium">
                                                ${project.goal.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {project.backers_count || 0} backers
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
