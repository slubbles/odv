"use client"

import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingUp, Users, Clock, Edit, BarChart, Loader2 } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useCreatorDashboard } from "@/lib/hooks/use-dashboard"
import { useWallet } from "@solana/wallet-adapter-react"
import { useState, useEffect } from "react"

export default function CreatorDashboardPage() {
  const { connected } = useWallet()
  const { projects, stats, loading, error } = useCreatorDashboard()
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!connected) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container mx-auto py-12 flex-1 flex items-center justify-center">
          <Card className="p-12 text-center max-w-md">
            <p className="text-muted-foreground mb-4">Connect your wallet to view your creator dashboard</p>
            <p className="text-sm text-muted-foreground">Use the wallet button in the header to get started</p>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex flex-1">
        <DashboardSidebar type="creator" />
        
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24 md:pb-12">
          <div className="mb-12 sm:mb-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4">What you're building</h1>
              <p className="text-xl sm:text-2xl text-muted-foreground">Your projects. Your people. All here.</p>
            </div>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-105 transition-all duration-200 shadow-lg shadow-accent/20 w-full sm:w-auto px-8 py-6 text-lg" asChild>
              <Link href="/submit">
                <span className="text-xl">I built something</span>
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <Card className="p-12">
              <p className="text-muted-foreground mb-4">Failed to load dashboard data</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </Card>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
              <Card className="border-accent/30 hover:border-accent/60 hover:bg-card/60 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-lg bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                      <TrendingUp className="h-7 w-7 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-3xl font-bold mb-1">{stats.activeProjects}</p>
                      <p className="text-sm text-muted-foreground truncate">getting funded</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/30 hover:border-accent/60 hover:bg-card/60 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-lg bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                      <DollarSign className="h-7 w-7 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-3xl font-bold mb-1">${stats.totalRaised.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground truncate">backed you</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/30 hover:border-accent/60 hover:bg-card/60 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-lg bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                      <Users className="h-7 w-7 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-3xl font-bold mb-1">{stats.totalBackers}</p>
                      <p className="text-sm text-muted-foreground truncate">believers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/30 hover:border-accent/60 hover:bg-card/60 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-lg bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                      <BarChart className="h-7 w-7 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-3xl font-bold mb-1">{stats.totalProjects}</p>
                      <p className="text-sm text-muted-foreground truncate">things you built</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="w-full overflow-x-auto flex-nowrap">
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="active">Live</TabsTrigger>
                <TabsTrigger value="queue">In Review</TabsTrigger>
                <TabsTrigger value="completed">Shipped</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                {projects.length === 0 ? (
                  <Card className="p-12 text-center border-accent/20">
                    <div className="h-16 w-16 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Nothing here yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Stop planning. Start building. Launch your first project in under 10 minutes.
                    </p>
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-105 transition-all duration-200 shadow-lg shadow-accent/20" asChild>
                      <Link href="/submit">I built something</Link>
                    </Button>
                  </Card>
                ) : (
                  <div className="grid gap-6">
                    {projects.map((project) => {
                      const progress = (project.raised / project.goal) * 100
                      const daysLeft = project.deadline && now
                        ? Math.max(
                            0,
                            Math.ceil((new Date(project.deadline).getTime() - now) / (1000 * 60 * 60 * 24))
                          )
                        : 0
                      
                      const statusBadge = () => {
                        switch (project.status) {
                          case 'active':
                            return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">🔥 Getting Funded</Badge>
                          case 'queue':
                          case 'pending':
                            return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">⏳ Under Review</Badge>
                          case 'funded':
                          case 'completed':
                            return <Badge className="bg-accent/20 text-accent border-accent/30">✅ Shipped</Badge>
                          case 'draft':
                            return <Badge variant="secondary">📝 Draft</Badge>
                          default:
                            return <Badge variant="secondary">{project.status}</Badge>
                        }
                      }

                      return (
                        <Card key={project.id} className="hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 group">
                          <div className="grid md:grid-cols-[240px_1fr] gap-6">
                            <div className="relative aspect-video md:aspect-auto bg-muted rounded-lg overflow-hidden">
                              <img
                                src={project.image_url || "/placeholder.svg"}
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-3 right-3">
                                {statusBadge()}
                              </div>
                            </div>
                            <div className="p-6 flex flex-col justify-between">
                              <div>
                                <div className="mb-3">
                                  <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                                </div>
                                <p className="text-muted-foreground line-clamp-2 mb-3">{project.tagline || project.description}</p>
                                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span>{project.backers_count || 0} backers</span>
                                  </div>
                                  {project.status === 'active' && (
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4 text-accent" />
                                      <span>{daysLeft} days left</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-4 mt-4">
                                <div>
                                  <div className="flex justify-between text-sm mb-2">
                                    <span className="font-semibold text-lg">${(project.raised || 0).toLocaleString()}</span>
                                    <span className="text-muted-foreground">of ${(project.goal || 0).toLocaleString()}</span>
                                  </div>
                                  <Progress value={progress || 0} className="h-3" />
                                  <p className="text-xs text-muted-foreground mt-1">{Math.round(progress || 0)}% funded</p>
                                </div>

                                <div className="flex gap-3">
                                  <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                                    <Link href={`/project/${project.id}`}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      View
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="active" className="space-y-6">
                {projects.filter((p) => p.status === "active").length === 0 ? (
                  <Card className="p-12 text-center border-accent/20">
                    <h3 className="text-xl font-bold mb-2">Nothing live. Yet.</h3>
                    <p className="text-muted-foreground mb-4">Launch something. Get it in front of people.</p>
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-105 transition-all" asChild>
                      <Link href="/submit">I built something</Link>
                    </Button>
                  </Card>
                ) : (
                  <div className="grid gap-6">
                    {projects
                      .filter((p) => p.status === "active")
                      .map((project) => {
                        const progress = (project.raised / project.goal) * 100
                        const daysLeft = project.deadline && now
                          ? Math.max(
                              0,
                              Math.ceil((new Date(project.deadline).getTime() - now) / (1000 * 60 * 60 * 24))
                            )
                          : 0
                        return (
                          <Card key={project.id} className="hover:border-accent/50 transition-all">
                            <div className="grid md:grid-cols-[200px_1fr] gap-6">
                              <div className="aspect-video md:aspect-auto bg-muted rounded-lg overflow-hidden">
                                <img
                                  src={project.image_url || "/placeholder.svg"}
                                  alt={project.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="p-6 flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center gap-3 mb-3">
                                    <h3 className="text-xl font-bold">{project.title}</h3>
                                    <Badge className="bg-accent/20 text-accent-foreground border-accent/30">
                                      Active
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                                    <div className="flex items-center gap-2">
                                      <Users className="h-4 w-4" />
                                      <span>{project.backers_count} backers</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4 text-accent" />
                                      <span>{daysLeft} days left</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div>
                                    <div className="flex justify-between text-sm mb-2">
                                      <span className="font-semibold text-lg">${project.raised.toLocaleString()}</span>
                                      <span className="text-muted-foreground">of ${project.goal.toLocaleString()}</span>
                                    </div>
                                    <Progress value={progress} className="h-3" />
                                    <p className="text-xs text-muted-foreground mt-1">{Math.round(progress)}% funded</p>
                                  </div>

                                  <div className="flex gap-3">
                                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                      <BarChart className="h-4 w-4 mr-2" />
                                      View Analytics
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                                      <Link href={`/project/${project.id}`}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        View Project
                                      </Link>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        )
                      })}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="queue" className="space-y-6">
                {projects.filter((p) => p.status === "queue" || p.status === "pending").length === 0 ? (
                  <Card className="p-12 text-center">
                    <p className="text-muted-foreground">Nothing pending. Build something.</p>
                  </Card>
                ) : (
                  <div className="grid gap-6">
                    {projects
                      .filter((p) => p.status === "queue" || p.status === "pending")
                      .map((project) => (
                        <Card key={project.id} className="hover:border-yellow-500/50 transition-all border-yellow-500/20">
                          <div className="grid md:grid-cols-[200px_1fr] gap-6">
                            <div className="aspect-video md:aspect-auto bg-muted rounded-lg overflow-hidden">
                              <img
                                src={project.image_url || "/placeholder.svg"}
                                alt={project.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-6 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center gap-3 mb-3">
                                  <h3 className="text-xl font-bold">{project.title}</h3>
                                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                    <Clock className="h-3 w-3 mr-1" />
                                    In Review
                                  </Badge>
                                </div>
                                <p className="text-muted-foreground mb-4">{project.tagline}</p>
                                <p className="text-sm text-muted-foreground">
                                  Submitted {new Date(project.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="mt-4">
                                <p className="text-sm text-muted-foreground">
                                  Goal: <span className="font-semibold text-foreground">${project.goal?.toLocaleString()}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed">
                {projects.filter((p) => p.status === "completed" || p.status === "funded").length === 0 ? (
                  <Card className="p-12 text-center">
                    <p className="text-muted-foreground">Nothing shipped yet. Keep building.</p>
                  </Card>
                ) : (
                  <div className="grid gap-6">
                    {projects
                      .filter((p) => p.status === "completed" || p.status === "funded")
                      .map((project) => (
                        <Card key={project.id}>
                          <div className="p-6">
                            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                            <p className="text-muted-foreground mb-2">{project.description}</p>
                            <Badge className="bg-green-500/20 text-green-700 border-green-500/30">Completed</Badge>
                          </div>
                        </Card>
                      ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="draft">
                {projects.filter((p) => p.status === "draft" || p.status === "pending").length === 0 ? (
                  <Card className="p-12 text-center">
                    <p className="text-muted-foreground mb-4">No drafts. Got an idea? Stop thinking, start building.</p>
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-105 transition-all" asChild>
                      <Link href="/submit">I built something</Link>
                    </Button>
                  </Card>
                ) : (
                  <div className="grid gap-6">
                    {projects
                      .filter((p) => p.status === "draft" || p.status === "pending")
                      .map((project) => (
                        <Card key={project.id}>
                          <div className="p-6">
                            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                            <p className="text-muted-foreground mb-2">{project.description}</p>
                            <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30">
                              {project.status === "pending" ? "In Review" : "Draft"}
                            </Badge>
                          </div>
                        </Card>
                      ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
