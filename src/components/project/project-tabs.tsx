"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { MilestoneTimeline } from "@/components/project/milestone-timeline"
import { CreatorProfileCard } from "@/components/project/creator-profile-card"
import { SimilarProjects } from "@/components/project/similar-projects"
import { Project } from "@/lib/types/project"

interface ProjectTabsProps {
    project: Project
    isCreator: boolean
    isBacker: boolean
}

export function ProjectTabs({ project, isCreator, isBacker }: ProjectTabsProps) {
    return (
        <div className="space-y-12">
            <Tabs defaultValue="overview" className="w-full">
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
                    <div className="grid md:grid-cols-[1fr_300px] gap-8">
                        <div className="space-y-8">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                                        {project.description}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="space-y-6">
                            <CreatorProfileCard
                                creator={{
                                    name: project.creator_name || "Unknown Creator",
                                    walletAddress: project.creator_wallet,
                                    avatarUrl: project.creator_avatar,
                                    bio: project.creator_bio,
                                    twitter: project.twitter_link,
                                    github: project.github_link,
                                    website: project.website_link
                                }}
                            />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="milestones" className="mt-8">
                    <div className="grid md:grid-cols-[1fr_300px] gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-6">Project Roadmap</h3>
                            <MilestoneTimeline
                                milestones={project.milestones || []}
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

            <SimilarProjects />
        </div>
    )
}
