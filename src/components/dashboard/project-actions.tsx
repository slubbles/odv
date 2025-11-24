"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical, Share2, Edit, ExternalLink, BarChart3, Archive } from "lucide-react"
import { Project } from "@/lib/types/project"
import { useState } from "react"
import { ShareProjectModal } from "./share-project-modal"
import { AnalyticsModal } from "./analytics-modal"
import Link from "next/link"

interface ProjectActionsProps {
    project: Project
}

export function ProjectActions({ project }: ProjectActionsProps) {
    const [shareModalOpen, setShareModalOpen] = useState(false)
    const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false)

    const canEdit = project.status === 'draft' || project.status === 'queue'
    const canArchive = project.status === 'completed'

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShareModalOpen(true)}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                    </DropdownMenuItem>

                    {canEdit && (
                        <Link href={`/dashboard/projects/${project.id}/edit`}>
                            <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                        </Link>
                    )}

                    <Link href={`/projects/${project.id}`} target="_blank">
                        <DropdownMenuItem>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Project
                        </DropdownMenuItem>
                    </Link>

                    <DropdownMenuItem onClick={() => setAnalyticsModalOpen(true)}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Analytics
                    </DropdownMenuItem>

                    {canArchive && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-muted-foreground">
                                <Archive className="mr-2 h-4 w-4" />
                                Archive
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <ShareProjectModal
                isOpen={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
                projectId={project.id}
                projectTitle={project.title}
            />

            <AnalyticsModal
                isOpen={analyticsModalOpen}
                onClose={() => setAnalyticsModalOpen(false)}
                project={project}
            />
        </>
    )
}
