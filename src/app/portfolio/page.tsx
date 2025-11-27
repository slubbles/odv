"use client"

import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { DollarSign, TrendingUp, Award, Vote, Loader2 } from "lucide-react"
import Link from "next/link"
import { useBackerDashboard } from "@/lib/hooks/use-dashboard"
import { useWallet } from "@solana/wallet-adapter-react"

const mockBackedProjects = [
  {
    id: "1",
    title: "AI-Powered Recipe Discovery Platform",
    creator: "Sarah Chen",
    thumbnail: "/placeholder.svg?key=594bv",
    investment: 25,
    status: "Active",
    progress: 84,
    raised: 8450,
    goal: 10000,
    nftBadge: "Gold Supporter",
    hasPendingVote: true,
  },
  {
    id: "2",
    title: "Sustainable Fashion Marketplace",
    creator: "Maya Rodriguez",
    thumbnail: "/placeholder.svg?key=2and1",
    investment: 10,
    status: "Active",
    progress: 65,
    raised: 5200,
    goal: 8000,
    nftBadge: "Silver Supporter",
    hasPendingVote: false,
  },
  {
    id: "3",
    title: "Indie Game Studio: Pixel Quest",
    creator: "Alex Turner",
    thumbnail: "/placeholder.svg?key=c8ykx",
    investment: 50,
    status: "Active",
    progress: 83,
    raised: 12500,
    goal: 15000,
    nftBadge: "Gold Supporter",
    hasPendingVote: true,
  },
  {
    id: "4",
    title: "Mental Health Journaling App",
    creator: "Dr. Emily Watson",
    thumbnail: "/placeholder.svg?key=cd0g1",
    investment: 15,
    status: "Active",
    progress: 65,
    raised: 7800,
    goal: 12000,
    nftBadge: "Silver Supporter",
    hasPendingVote: false,
  },
  {
    id: "5",
    title: "Urban Vertical Garden System",
    creator: "Marcus Green",
    thumbnail: "/placeholder.svg?key=qzjjj",
    investment: 20,
    status: "Completed",
    progress: 100,
    raised: 7500,
    goal: 7500,
    nftBadge: "Gold Supporter",
    hasPendingVote: false,
  },
  {
    id: "6",
    title: "Community Coffee Roastery",
    creator: "Jordan Lee",
    thumbnail: "/placeholder.svg?key=ey7ew",
    investment: 5,
    status: "Active",
    progress: 56,
    raised: 3400,
    goal: 6000,
    nftBadge: "Bronze Supporter",
    hasPendingVote: false,
  },
  {
    id: "7",
    title: "Local Artist Collaboration Platform",
    creator: "Aria Santos",
    thumbnail: "/placeholder.svg?key=08l79",
    investment: 10,
    status: "Active",
    progress: 42,
    raised: 2100,
    goal: 5000,
    nftBadge: "Silver Supporter",
    hasPendingVote: true,
  },
  {
    id: "8",
    title: "EdTech Platform for Rural Schools",
    creator: "Priya Sharma",
    thumbnail: "/placeholder.svg?key=y8zlr",
    investment: 10,
    status: "Completed",
    progress: 100,
    raised: 9000,
    goal: 9000,
    nftBadge: "Silver Supporter",
    hasPendingVote: false,
  },
]

export default function PortfolioPage() {
  const { connected } = useWallet()
  const { backedProjects, stats: dashboardStats, loading, error } = useBackerDashboard()

  if (!connected) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container py-12 flex items-center justify-center">
          <Card className="p-12 text-center max-w-md">
            <p className="text-muted-foreground mb-4">Connect your wallet to view your portfolio</p>
          </Card>
        </div>
      </div>
    )
  }

  const activeProjectsCount = backedProjects.filter((p) => p.status === "active").length
  const stats = {
    totalInvested: dashboardStats.totalSpent,
    activeProjects: activeProjectsCount,
    nftsOwned: dashboardStats.totalBacked,
    votingPower: dashboardStats.totalSpent,
  }
  const portfolioProjects = backedProjects.length > 0 ? backedProjects.map(p => ({
    id: p.id,
    title: p.title,
    creator: p.creator_name || "Anonymous",
    thumbnail: p.image_url || "/placeholder.svg",
    investment: 1,
    status: p.status === "active" ? "Active" : "Completed",
    progress: (p.raised / p.goal) * 100,
    raised: p.raised,
    goal: p.goal,
    nftBadge: "Early Backer",
    hasPendingVote: false,
  })) : mockBackedProjects

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Bets</h1>
          <p className="text-lg text-muted-foreground">Every dollar you risked. Every project you believed in.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${stats.totalInvested}</p>
                  <p className="text-sm text-muted-foreground">Dollars Bet</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activeProjects}</p>
                  <p className="text-sm text-muted-foreground">Still Building</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Award className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.nftsOwned}</p>
                  <p className="text-sm text-muted-foreground">Badges Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Vote className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.votingPower}</p>
                  <p className="text-sm text-muted-foreground">Your Vote Power</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Building</TabsTrigger>
            <TabsTrigger value="completed">Shipped</TabsTrigger>
            <TabsTrigger value="voting">Need Your Vote</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {portfolioProjects.map((project) => (
                <ProjectPortfolioCard key={project.id} project={project} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {backedProjects
                .filter((p) => p.status === "Active")
                .map((project) => (
                  <ProjectPortfolioCard key={project.id} project={project} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {backedProjects
                .filter((p) => p.status === "Completed")
                .map((project) => (
                  <ProjectPortfolioCard key={project.id} project={project} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="voting" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {backedProjects
                .filter((p) => p.hasPendingVote)
                .map((project) => (
                  <ProjectPortfolioCard key={project.id} project={project} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ProjectPortfolioCard({ project }: { project: any }) {
  return (
    <Card className="overflow-hidden hover:border-accent/50 transition-all">
      <div className="grid md:grid-cols-5 gap-0">
        <div className="md:col-span-2 aspect-video md:aspect-auto bg-muted">
          <img
            src={project.thumbnail || "/placeholder.svg"}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="md:col-span-3 p-6">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold line-clamp-2 mb-1">{project.title}</h3>
              <p className="text-sm text-muted-foreground">by {project.creator}</p>
            </div>
            <Badge variant={project.status === "Active" ? "default" : "secondary"}>{project.status}</Badge>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Your investment</span>
              <span className="font-bold text-accent">${project.investment}</span>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>

            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-accent" />
              <span className="text-sm text-muted-foreground">{project.nftBadge}</span>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                <Link href={`/project/${project.id}`}>View Project</Link>
              </Button>
              {project.hasPendingVote && (
                <Button size="sm" className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
                  Vote Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
