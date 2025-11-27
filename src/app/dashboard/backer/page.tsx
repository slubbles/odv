"use client"

import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingUp, Award, Clock, ExternalLink, Loader2 } from "lucide-react"
import { Footer } from "@/components/footer"
import { useBackerDashboard } from "@/lib/hooks/use-dashboard"
import { useWallet } from "@solana/wallet-adapter-react"
import Link from "next/link"

export default function BackerDashboardPage() {
  const { connected } = useWallet()
  const { backedProjects, stats, loading, error } = useBackerDashboard()

  if (!connected) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container mx-auto py-12 flex-1 flex items-center justify-center">
          <Card className="p-12 text-center max-w-md">
            <p className="text-muted-foreground mb-4">Connect your wallet to view your backer dashboard</p>
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
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">What you backed</h1>
          <p className="text-xl text-muted-foreground">Your $1 bets. Track them all here.</p>
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
                      <p className="text-2xl font-bold">{stats.totalBacked}</p>
                      <p className="text-sm text-muted-foreground">bets placed</p>
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
                      <p className="text-2xl font-bold">${stats.totalSpent}</p>
                      <p className="text-sm text-muted-foreground">total spent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Award className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalBacked}</p>
                      <p className="text-sm text-muted-foreground">proof-of-backing NFTs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{backedProjects.filter((p) => p.status === 'active').length}</p>
                      <p className="text-sm text-muted-foreground">active projects</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">Still Building</TabsTrigger>
            <TabsTrigger value="funded">Made It</TabsTrigger>
            <TabsTrigger value="nfts">My Proof</TabsTrigger>
          </TabsList>

            <TabsContent value="active" className="space-y-6">
              {backedProjects.filter((p) => p.status === "active").length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground mb-4">You haven't backed any active projects yet</p>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                    <Link href="/discover">Discover Projects</Link>
                  </Button>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {backedProjects
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
                                  <Badge className="bg-accent/20 text-accent-foreground border-accent/30">Active</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                  Your contribution: <span className="font-semibold text-accent">$1</span>
                                </p>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <div className="flex justify-between text-sm mb-2">
                                    <span className="font-semibold">${project.raised.toLocaleString()}</span>
                                    <span className="text-muted-foreground">of ${project.goal.toLocaleString()}</span>
                                  </div>
                                  <Progress value={progress} className="h-2" />
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-accent" />
                                    <span>{daysLeft} days left</span>
                                  </div>
                                  <Button variant="outline" size="sm" asChild>
                                    <Link href={`/projects/${project.id}`}>
                                      <ExternalLink className="h-4 w-4 mr-2" />
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

            <TabsContent value="funded" className="space-y-6">
              {backedProjects.filter((p) => p.status === "funded" || p.status === "completed").length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">No funded projects yet. Keep backing!</p>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {backedProjects
                    .filter((p) => p.status === "funded" || p.status === "completed")
                    .map((project) => (
                      <Card key={project.id} className="border-green-500/30">
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
                                <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Funded ✓</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                You bet: <span className="font-semibold text-accent">$1</span>
                              </p>
                              <p className="text-sm text-green-500 font-semibold">
                                They got: ${project.raised.toLocaleString()}
                              </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/projects/${project.id}`}>Check Updates</Link>
                              </Button>
                              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                                Claim NFT
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="nfts">
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {backedProjects.map((project, i) => (
                  <Card key={project.id} className="overflow-hidden hover:border-accent/50 transition-all cursor-pointer">
                    <div className="aspect-square bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                      <Award className="h-16 w-16 text-accent" />
                    </div>
                    <CardContent className="p-4">
                      <p className="font-semibold mb-1">Early Backer #{i + 1}</p>
                      <p className="text-xs text-muted-foreground">{project.title}</p>
                    </CardContent>
                  </Card>
                ))}
                {backedProjects.length === 0 && (
                  <Card className="p-12 text-center col-span-full">
                    <p className="text-muted-foreground">No NFTs yet. Back a project to get started!</p>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
      </div>

      <Footer />
    </div>
  )
}
