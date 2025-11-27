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
import { useCreatorDashboard } from "@/lib/hooks/use-dashboard"
import { useWallet } from "@solana/wallet-adapter-react"

export default function CreatorDashboardPage() {
  const { connected } = useWallet()
  const { projects, stats, loading, error } = useCreatorDashboard()

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

      <div className="container mx-auto py-12 flex-1">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">What you're building</h1>
            <p className="text-xl text-muted-foreground">Your projects. Your people. All here.</p>
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
            <Link href="/submit">+ Start Building</Link>
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
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <Card className="border-accent/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.activeProjects}</p>
                      <p className="text-sm text-muted-foreground">currently live</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">${stats.totalRaised.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">people believed in you</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalBackers}</p>
                      <p className="text-sm text-muted-foreground">backers total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
                      <BarChart className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalProjects}</p>
                      <p className="text-sm text-muted-foreground">total projects</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="active" className="space-y-6">
              <TabsList>
                <TabsTrigger value="active">Live Projects</TabsTrigger>
                <TabsTrigger value="completed">Shipped</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-6">
                {projects.filter((p) => p.status === "active").length === 0 ? (
                  <Card className="p-12 text-center">
                    <p className="text-muted-foreground mb-4">No active projects yet</p>
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                      <Link href="/submit">Start Building</Link>
                    </Button>
                  </Card>
                ) : (
                  <div className="grid gap-6">
                    {projects
                      .filter((p) => p.status === "active")
                      .map((project) => {
                        const progress = (project.raised / project.goal) * 100
                        const daysLeft = project.deadline
                          ? Math.max(
                              0,
                              Math.ceil((new Date(project.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
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
                                      <Link href={`/projects/${project.id}`}>
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
                    <p className="text-muted-foreground mb-4">No drafts. Got an idea?</p>
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                      <Link href="/submit">Start Building</Link>
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

      <Footer />
    </div>
  )
}
