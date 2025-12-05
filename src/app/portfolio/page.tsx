"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { DollarSign, TrendingUp, Award, Vote, Loader2, Rocket } from "lucide-react"
import Link from "next/link"
import { useBackerDashboard } from "@/lib/hooks/use-dashboard"
import { useWallet } from "@solana/wallet-adapter-react"

export default function PortfolioPage() {
  const { connected } = useWallet()
  const { backedProjects, stats: dashboardStats, loading } = useBackerDashboard()

  if (!connected) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container px-4 sm:px-6 py-12 flex items-center justify-center flex-1 pb-24 md:pb-12">
          <Card className="p-12 text-center max-w-md">
            <h2 className="text-xl font-bold mb-4">Your Portfolio</h2>
            <p className="text-muted-foreground mb-4">Connect your wallet to view your backed projects</p>
            <p className="text-sm text-muted-foreground">Use the wallet button in the header to get started.</p>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container px-4 sm:px-6 py-8 sm:py-12 flex items-center justify-center flex-1 pb-24 md:pb-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your portfolio...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const activeProjectsCount = backedProjects.filter((p) => p.status === "active").length
  const completedProjectsCount = backedProjects.filter((p) => p.status === "funded" || p.status === "completed").length
  
  const stats = {
    totalInvested: dashboardStats.totalSpent,
    activeProjects: activeProjectsCount,
    nftsOwned: dashboardStats.totalBacked,
    votingPower: dashboardStats.totalSpent,
  }

  // Transform backed projects for display
  const portfolioProjects = backedProjects.map(p => ({
    id: p.id,
    title: p.title,
    creator: p.creator_name || "Anonymous Creator",
    thumbnail: p.image_url || "/placeholder.svg",
    investment: 1, // $1 per backing
    status: p.status === "active" ? "Active" : p.status === "funded" ? "Funded" : "Completed",
    progress: Math.min(100, Math.round((p.raised / p.goal) * 100)),
    raised: p.raised,
    goal: p.goal,
    nftBadge: "Early Backer",
    hasPendingVote: false,
  }))

  // Empty state
  if (backedProjects.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container px-4 sm:px-6 py-8 sm:py-12 flex-1 pb-24 md:pb-12">
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">Your Bets</h1>
            <p className="text-base sm:text-lg text-muted-foreground">Every dollar you risked. Every project you believed in.</p>
          </div>

          <Card className="p-12 text-center max-w-lg mx-auto">
            <div className="h-16 w-16 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-6">
              <Rocket className="h-8 w-8 text-accent" />
            </div>
            <h2 className="text-2xl font-bold mb-3">No bets yet</h2>
            <p className="text-muted-foreground mb-6">
              You haven't backed any projects yet. Find something worth believing in!
            </p>
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/discover">Discover Projects</Link>
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="container px-4 sm:px-6 py-8 sm:py-12 flex-1 pb-24 md:pb-12">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">Your Bets</h1>
          <p className="text-base sm:text-lg text-muted-foreground">Every dollar you risked. Every project you believed in.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold">${stats.totalInvested}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Dollars Bet</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold">{stats.activeProjects}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Still Building</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold">{stats.nftsOwned}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Badges Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Vote className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold">{stats.votingPower}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Vote Power</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full overflow-x-auto flex-nowrap">
            <TabsTrigger value="all">All ({portfolioProjects.length})</TabsTrigger>
            <TabsTrigger value="active">Building ({activeProjectsCount})</TabsTrigger>
            <TabsTrigger value="completed">Shipped ({completedProjectsCount})</TabsTrigger>
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
              {portfolioProjects
                .filter((p) => p.status === "Active")
                .map((project) => (
                  <ProjectPortfolioCard key={project.id} project={project} />
                ))}
            </div>
            {activeProjectsCount === 0 && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No active projects at the moment.</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {portfolioProjects
                .filter((p) => p.status === "Funded" || p.status === "Completed")
                .map((project) => (
                  <ProjectPortfolioCard key={project.id} project={project} />
                ))}
            </div>
            {completedProjectsCount === 0 && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No completed projects yet. Keep backing!</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
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
              <span className="text-muted-foreground">Your bet</span>
              <span className="font-bold text-accent">${project.investment}</span>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold">${project.raised.toLocaleString()}</span>
                <span className="text-muted-foreground">of ${project.goal.toLocaleString()}</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>

            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-accent" />
              <span className="text-sm text-muted-foreground">{project.nftBadge}</span>
            </div>

            <Button size="sm" variant="outline" className="w-full bg-transparent" asChild>
              <Link href={`/project/${project.id}`}>View Project</Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
