"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, FolderOpen, TrendingUp, Users } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"

interface StatsData {
    totalProjects: number
    totalRaised: number
    totalBackers: number
    avgFundingRate: number
}

interface BackerStatsData {
    totalBacked: number
    totalInvested: number
    projectsSupported: number
}

interface StatsOverviewProps {
    isCreator?: boolean
}

export function StatsOverview({ isCreator = false }: StatsOverviewProps) {
    const { publicKey, connected } = useWallet()
    const [creatorStats, setCreatorStats] = useState<StatsData>({
        totalProjects: 0,
        totalRaised: 0,
        totalBackers: 0,
        avgFundingRate: 0
    })
    const [backerStats, setBackerStats] = useState<BackerStatsData>({
        totalBacked: 0,
        totalInvested: 0,
        projectsSupported: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            if (!connected || !publicKey) {
                setLoading(false)
                return
            }

            try {
                if (isCreator) {
                    // Fetch creator stats
                    const { data: projects, error } = await supabase
                        .from('projects')
                        .select('raised, backers_count, goal')
                        .eq('creator_wallet', publicKey.toBase58())

                    if (error) throw error

                    if (projects && projects.length > 0) {
                        const totalRaised = projects.reduce((sum, p) => sum + (p.raised || 0), 0)
                        const totalBackers = projects.reduce((sum, p) => sum + (p.backers_count || 0), 0)
                        const totalGoals = projects.reduce((sum, p) => sum + p.goal, 0)
                        const avgRate = totalGoals > 0 ? (totalRaised / totalGoals) * 100 : 0

                        setCreatorStats({
                            totalProjects: projects.length,
                            totalRaised,
                            totalBackers,
                            avgFundingRate: avgRate
                        })
                    }
                } else {
                    // Fetch backer stats
                    const { data: backings, error } = await supabase
                        .from('backers')
                        .select('amount, project_id')
                        .eq('wallet_address', publicKey.toBase58())

                    if (error) throw error

                    if (backings && backings.length > 0) {
                        const totalInvested = backings.reduce((sum, b) => sum + b.amount, 0)
                        const uniqueProjects = new Set(backings.map(b => b.project_id)).size

                        setBackerStats({
                            totalBacked: backings.length,
                            totalInvested,
                            projectsSupported: uniqueProjects
                        })
                    }
                }
            } catch (error) {
                console.error("Error fetching stats:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [connected, publicKey, isCreator])

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16 mb-2" />
                            <Skeleton className="h-3 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (isCreator) {
        return (
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{creatorStats.totalProjects}</div>
                        <p className="text-xs text-muted-foreground">Projects created</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${creatorStats.totalRaised.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Across all projects</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Backers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{creatorStats.totalBackers}</div>
                        <p className="text-xs text-muted-foreground">People supporting you</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Funding Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{creatorStats.avgFundingRate.toFixed(0)}%</div>
                        <p className="text-xs text-muted-foreground">Of goal achieved</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Backer stats
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Projects Backed</CardTitle>
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{backerStats.projectsSupported}</div>
                    <p className="text-xs text-muted-foreground">Unique projects</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${backerStats.totalInvested.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Lifetime investment</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Contributions</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{backerStats.totalBacked}</div>
                    <p className="text-xs text-muted-foreground">Times backed</p>
                </CardContent>
            </Card>
        </div>
    )
}
