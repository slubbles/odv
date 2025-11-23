"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Globe, Twitter, ExternalLink } from "lucide-react"
import Link from "next/link"

interface CreatorProfileCardProps {
    creator: {
        name: string
        walletAddress: string
        avatarUrl?: string
        bio?: string
        twitter?: string
        github?: string
        website?: string
    }
    stats?: {
        projectsCreated: number
        totalRaised: number
    }
}

export function CreatorProfileCard({ creator, stats = { projectsCreated: 1, totalRaised: 842 } }: CreatorProfileCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">About the Creator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/10">
                        <AvatarImage src={creator.avatarUrl} alt={creator.name} />
                        <AvatarFallback className="text-lg">{creator.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-bold text-lg">{creator.name}</h3>
                        <p className="text-sm text-muted-foreground font-mono">
                            {creator.walletAddress.slice(0, 4)}...{creator.walletAddress.slice(-4)}
                        </p>
                    </div>
                </div>

                {creator.bio && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {creator.bio}
                    </p>
                )}

                <div className="grid grid-cols-2 gap-4 py-4 border-y">
                    <div className="text-center">
                        <p className="text-2xl font-bold">{stats.projectsCreated}</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Projects</p>
                    </div>
                    <div className="text-center border-l">
                        <p className="text-2xl font-bold">${stats.totalRaised.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Raised</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {creator.twitter && (
                        <Link href={creator.twitter} target="_blank" className="flex items-center justify-between text-sm hover:text-primary transition-colors">
                            <span className="flex items-center gap-2"><Twitter className="w-4 h-4" /> Twitter</span>
                            <ExternalLink className="w-3 h-3 opacity-50" />
                        </Link>
                    )}
                    {creator.github && (
                        <Link href={creator.github} target="_blank" className="flex items-center justify-between text-sm hover:text-primary transition-colors">
                            <span className="flex items-center gap-2"><Github className="w-4 h-4" /> GitHub</span>
                            <ExternalLink className="w-3 h-3 opacity-50" />
                        </Link>
                    )}
                    {creator.website && (
                        <Link href={creator.website} target="_blank" className="flex items-center justify-between text-sm hover:text-primary transition-colors">
                            <span className="flex items-center gap-2"><Globe className="w-4 h-4" /> Website</span>
                            <ExternalLink className="w-3 h-3 opacity-50" />
                        </Link>
                    )}
                </div>

                <Button className="w-full" variant="outline">
                    View Full Profile
                </Button>
            </CardContent>
        </Card>
    )
}
