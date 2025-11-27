import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, XCircle, Clock, TrendingUp, Users, Shield } from "lucide-react"
import { Footer } from "@/components/footer"

const pendingProjects = [
  {
    id: "1",
    title: "Blockchain Gaming Platform",
    creator: "David Park",
    category: "Gaming",
    votes: 67,
    submittedDate: "2 days ago",
    status: "pending",
  },
  {
    id: "2",
    title: "AI Music Composition Tool",
    creator: "Marcus Williams",
    category: "Technology",
    votes: 54,
    submittedDate: "5 days ago",
    status: "pending",
  },
]

const approvedProjects = [
  {
    id: "3",
    title: "Sustainable Fashion Marketplace",
    creator: "Maya Rodriguez",
    category: "Social Impact",
    votes: 89,
    approvedDate: "1 week ago",
    status: "approved",
  },
]

const rejectedProjects = [
  {
    id: "4",
    title: "Crypto Investment App",
    creator: "John Doe",
    category: "Finance",
    votes: 12,
    rejectedDate: "3 days ago",
    reason: "Violates terms of service",
    status: "rejected",
  },
]

export default function AdminPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="container mx-auto py-12 flex-1">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-accent" />
            <Badge className="bg-accent/20 text-accent-foreground border-accent/30">Admin Panel</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Gatekeeper</h1>
          <p className="text-xl text-muted-foreground">The community votes. You decide who ships.</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Waiting</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">156</p>
                  <p className="text-sm text-muted-foreground">Let Through</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">23</p>
                  <p className="text-sm text-muted-foreground">Blocked</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">87%</p>
                  <p className="text-sm text-muted-foreground">Approval Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            {pendingProjects.map((project) => (
              <Card key={project.id} className="hover:border-accent/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{project.title}</h3>
                        <Badge variant="secondary">{project.category}</Badge>
                        <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">by {project.creator}</p>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-accent" />
                          <span className="font-semibold">{project.votes} community votes</span>
                        </div>
                        <span className="text-muted-foreground">Submitted {project.submittedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      View Full Details
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-500/50 text-red-500 hover:bg-red-500/10 bg-transparent"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="approved" className="space-y-6">
            {approvedProjects.map((project) => (
              <Card key={project.id} className="border-green-500/30">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{project.title}</h3>
                        <Badge variant="secondary">{project.category}</Badge>
                        <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Approved
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">by {project.creator}</p>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-accent" />
                          <span>{project.votes} community votes</span>
                        </div>
                        <span className="text-muted-foreground">Approved {project.approvedDate}</span>
                      </div>
                    </div>
                    <Button variant="outline">View Project</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-6">
            {rejectedProjects.map((project) => (
              <Card key={project.id} className="border-red-500/30">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{project.title}</h3>
                        <Badge variant="secondary">{project.category}</Badge>
                        <Badge className="bg-red-500/20 text-red-500 border-red-500/30">
                          <XCircle className="h-3 w-3 mr-1" />
                          Rejected
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">by {project.creator}</p>
                      <div className="flex items-center gap-6 text-sm mb-3">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{project.votes} votes</span>
                        </div>
                        <span className="text-muted-foreground">Rejected {project.rejectedDate}</span>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                        <p className="text-sm font-semibold text-red-500 mb-1">Rejection Reason:</p>
                        <p className="text-sm text-muted-foreground">{project.reason}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
