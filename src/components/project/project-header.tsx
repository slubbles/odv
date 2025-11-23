"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Project } from "@/lib/types/project";
import { Clock, Users } from "lucide-react";
import { PaymentModal } from "@/components/payment/payment-modal";
import { useEffect, useState } from "react";

interface ProjectHeaderProps {
    project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
    const progress = (project.raised / project.goal) * 100;

    // Use state for daysLeft to avoid hydration mismatch
    const [daysLeft, setDaysLeft] = useState<number | null>(null);

    useEffect(() => {
        if (project.deadline) {
            const left = Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            setDaysLeft(left);
        } else {
            setDaysLeft(0);
        }
    }, [project.deadline]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Left: Video/Image */}
                <div className="w-full md:w-2/3 aspect-video bg-muted rounded-xl overflow-hidden relative">
                    {project.video_url ? (
                        <iframe
                            src={project.video_url}
                            className="w-full h-full"
                            title={project.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            No Media Available
                        </div>
                    )}
                </div>

                {/* Right: Stats & Actions */}
                <div className="w-full md:w-1/3 space-y-6">
                    <div>
                        <Badge variant="secondary" className="mb-2">{project.category}</Badge>
                        <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
                        <p className="text-muted-foreground">{project.tagline}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={project.creator_avatar} />
                            <AvatarFallback>{project.creator_name?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                            <p className="font-medium">Created by</p>
                            <p className="text-muted-foreground">{project.creator_name || project.creator_wallet.slice(0, 8)}</p>
                        </div>
                    </div>

                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-2xl font-bold">${project.raised.toLocaleString()}</span>
                                <span className="text-muted-foreground text-sm"> raised of ${project.goal.toLocaleString()}</span>
                            </div>
                            <span className="font-bold text-primary">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="w-4 h-4" />
                                <span>{project.backers_count} Backers</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>{daysLeft !== null ? (daysLeft > 0 ? `${daysLeft} Days Left` : "Ended") : "Loading..."}</span>
                            </div>
                        </div>
                    </div>

                    <PaymentModal
                        projectTitle={project.title}
                        trigger={
                            <Button size="lg" className="w-full text-lg h-12">
                                Back for $1 USDC
                            </Button>
                        }
                    />

                    <p className="text-xs text-center text-muted-foreground">
                        All or nothing. This project will only be funded if it reaches its goal by the deadline.
                    </p>
                </div>
            </div>
        </div>
    );
}
