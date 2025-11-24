'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Loader2, Search } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Project, ProjectStatus } from "@/lib/types/project"
import { ProjectActions } from "@/components/dashboard/project-actions"
import Link from "next/link"

export default function CreatorDashboardPage() {
    const { publicKey, connected } = useWallet()
    const [projects, setProjects] = useState<Project[]>([])
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all')
    const [searchQuery, setSearchQuery] = useState('')

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
                setFilteredProjects(data || [])
            } catch (error) {
                console.error("Error fetching my projects:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchMyProjects()
    }, [connected, publicKey])

    // Apply filters
    useEffect(() => {
        let filtered = projects

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(p => p.status === statusFilter)
        }

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.tagline.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        setFilteredProjects(filtered)
    }, [projects, statusFilter, searchQuery])

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
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                            <CardTitle>Projects</CardTitle>
                            <CardDescription>A list of your projects and their current status.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <div className="relative flex-1 md:w-[300px]">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search projects..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ProjectStatus | 'all')}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="queue">Queue</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredProjects.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            {searchQuery || statusFilter !== 'all'
                                ? 'No projects match your filters.'
                                : "You haven't created any projects yet."}
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
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProjects.map((project) => (
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
                                        <TableCell className="text-right">
                                            <ProjectActions project={project} />
                                        </TableCell>
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

