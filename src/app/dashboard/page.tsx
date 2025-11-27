import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Users, FolderOpen, Plus, Edit, BarChart3 } from "lucide-react"
import Link from "next/link"

const creatorStats = {
  totalRaised: 45000,
  totalBackers: 1247,
  activeProjects: 3,
}

const backedProjects = [
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
]

const myProjects = [
  {
    id: "1",
    title: "AI-Powered Recipe Discovery Platform",
    thumbnail: "/placeholder.svg?key=594bv",
    status: "Live",
    raised: 8450,
    goal: 10000,
    backers: 423,
    daysLeft: 12,
  },
  {
    id: "2",
    title: "Smart Home Energy Optimizer",
    thumbnail: "/placeholder.svg?key=nbz03",
    status: "Featured",
    raised: 15200,
    goal: 20000,
    backers: 678,
    daysLeft: 8,
  },
  {
    id: "3",
    title: "Blockchain Supply Chain Tracker",
    thumbnail: "/placeholder.svg?key=49gn7",
    status: "Completed",
    raised: 21350,
    goal: 20000,
    backers: 892,
    daysLeft: 0,
  },
  {
    id: "4",
    title: "Voice Assistant for Seniors",
    thumbnail: "/placeholder.svg?key=lp8s2",
    status: "Draft",
    raised: 0,
    goal: 12000,
    backers: 0,
    daysLeft: 0,
  },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Command Center</h1>
              <p className="text-lg text-muted-foreground">What you backed. What you built.</p>
            </div>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link href="/create">
                <Plus className="mr-2 h-5 w-5" />
                Submit New Project
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="backed" className="w-full">
          <TabsList>
            <TabsTrigger value="backed">Backed Projects</TabsTrigger>
            <TabsTrigger value="my-projects">My Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="backed" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {backedProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:border-accent/50 transition-all">
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
                        <Badge>{project.status}</Badge>
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

                        <Button size="sm" variant="outline" className="w-full bg-transparent" asChild>
                          <Link href={`/project/${project.id}`}>View Project</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-projects" className="mt-6">
            {/* Creator Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">${creatorStats.totalRaised.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total Raised</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Users className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{creatorStats.totalBackers}</p>
                      <p className="text-sm text-muted-foreground">Total Backers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <FolderOpen className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{creatorStats.activeProjects}</p>
                      <p className="text-sm text-muted-foreground">Active Projects</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Project Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:border-accent/50 transition-all">
                  <div className="aspect-video bg-muted">
                    <img
                      src={project.thumbnail || "/placeholder.svg"}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <h3 className="text-lg font-bold line-clamp-2 flex-1">{project.title}</h3>
                      <Badge
                        variant={
                          project.status === "Live" || project.status === "Featured"
                            ? "default"
                            : project.status === "Completed"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>

                    {project.status !== "Draft" && (
                      <>
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-semibold">${project.raised.toLocaleString()}</span>
                            <span className="text-muted-foreground">of ${project.goal.toLocaleString()}</span>
                          </div>
                          <Progress value={(project.raised / project.goal) * 100} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <span>{project.backers} backers</span>
                          {project.daysLeft > 0 && <span>{project.daysLeft} days left</span>}
                        </div>
                      </>
                    )}

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
