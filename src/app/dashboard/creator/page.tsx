'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Loader2 } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Project } from "@/lib/types/project"
import Link from "next/link"

export default function CreatorDashboardPage() {
    const { publicKey, connected } = useWallet()
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchMyProjects() {
            if (!connected || !publicKey) {
                setLoading(false)
                return
            }

            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('creator_wallet', publicKey.toBase58())
                    .order('created_at', { ascending: false })

                if (error) throw error
                setProjects(data || [])
            } catch (error) {
                console.error("Error fetching my projects:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchMyProjects()
    }, [connected, publicKey])

    if (!connected) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <h2 className="text-2xl font-bold">Connect Wallet</h2>
                <p className="text-muted-foreground">Please connect your wallet to view your projects.</p>
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
                    <p className="text-muted-foreground">Manage your campaigns and updates.</p>
                </div>
                <Link href="/submit">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Create Project
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Projects</CardTitle>
                    <CardDescription>A list of your projects and their current status.</CardDescription>
                </CardHeader>
                <CardContent>
                    {projects.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            You haven&apos;t created any projects yet.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Raised</TableHead>
                                    <TableHead>Backers</TableHead>
                                    <TableHead className="text-right">Goal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.map((project) => (
                                    <TableRow key={project.id}>
                                        <TableCell className="font-medium">{project.title}</TableCell>
                                        <TableCell>
                                            <Badge variant={project.status === "active" ? "default" : "secondary"}>
                                                {project.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>${(project.raised || 0).toLocaleString()}</TableCell>
                                        <TableCell>{project.backers_count || 0}</TableCell>
                                        <TableCell className="text-right">${project.goal.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

