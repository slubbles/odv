"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Loader2, ExternalLink } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Project } from "@/lib/types/project"
import Link from "next/link"

interface BackedProject extends Project {
    backed_amount: number
    backed_at: string
}

export default function BackerDashboardPage() {
    const { publicKey, connected } = useWallet()
    const [projects, setProjects] = useState<BackedProject[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchBackedProjects() {
            if (!connected || !publicKey) {
                setLoading(false)
                return
            }

            try {
                // Fetch backers records for this wallet
                const { data: backers, error: backersError } = await supabase
                    .from('backers')
                    .select('project_id, amount, created_at')
                    .eq('wallet_address', publicKey.toBase58())

                if (backersError) throw backersError

                if (!backers || backers.length === 0) {
                    setLoading(false)
                    return
                }

                // Fetch project details for each backed project
                const projectIds = backers.map(b => b.project_id)
                const { data: projectsData, error: projectsError } = await supabase
                    .from('projects')
                    .select('*')
                    .in('id', projectIds)

                if (projectsError) throw projectsError

                // Merge backing info with project data
                const mergedProjects: BackedProject[] = (projectsData || []).map(project => {
                    const backing = backers.find(b => b.project_id === project.id)
                    return {
                        ...project,
                        backed_amount: backing?.amount || 0,
                        backed_at: backing?.created_at || ''
                    }
                })

                setProjects(mergedProjects)
            } catch (error) {
                console.error("Error fetching backed projects:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchBackedProjects()
    }, [connected, publicKey])

    if (!connected) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <h2 className="text-2xl font-bold">Connect Wallet</h2>
                <p className="text-muted-foreground">Please connect your wallet to view your backed projects.</p>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Backed Projects</h1>
                <p className="text-muted-foreground">Projects you&apos;ve supported on OneDollarVentures.</p>
            </div>

            {projects.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-8 space-y-4">
                            <p className="text-muted-foreground">You haven&apos;t backed any projects yet.</p>
                            <Link href="/">
                                <Button>Explore Projects</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => {
                        const progress = (project.raised / project.goal) * 100
                        return (
                            <Card key={project.id} className="overflow-hidden transition-all hover:shadow-md">
                                <div className="aspect-video w-full bg-muted relative">
                                    {project.image_url ? (
                                        <img src={project.image_url} alt={project.title} className="object-cover w-full h-full" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-muted-foreground">
                                            No Image
                                        </div>
                                    )}
                                    <Badge className="absolute top-2 right-2" variant={project.status === "active" ? "default" : "secondary"}>
                                        {project.status}
                                    </Badge>
                                </div>
                                <CardHeader>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={project.creator_avatar} />
                                            <AvatarFallback>{project.creator_name?.[0] || "?"}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm text-muted-foreground">{project.creator_name || project.creator_wallet.slice(0, 8)}</span>
                                    </div>
                                    <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                                    <CardDescription className="line-clamp-2">{project.tagline}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium">${project.raised.toLocaleString()} raised</span>
                                            <span className="text-muted-foreground">of ${project.goal.toLocaleString()}</span>
                                        </div>
                                        <Progress value={progress} className="h-2" />
                                    </div>
                                    <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
                                        <p className="text-sm font-medium">Your Contribution</p>
                                        <p className="text-2xl font-bold text-primary">${project.backed_amount}</p>
                                    </div>
                                    <Link href={`/projects/${project.id}`}>
                                        <Button variant="outline" className="w-full mt-4">
                                            View Details <ExternalLink className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
