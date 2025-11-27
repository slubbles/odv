import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function AdminQueueReviewPage() {
  const pendingProjects = [
    {
      id: 1,
      title: "Eco-Friendly Water Bottle",
      creator: "John Smith",
      category: "Sustainability",
      goal: 5000,
      submittedDate: "2024-01-28",
      votes: { approve: 145, reject: 23 },
      priority: "high",
    },
    {
      id: 2,
      title: "Virtual Reality Classroom",
      creator: "Emily Brown",
      category: "Education",
      goal: 25000,
      submittedDate: "2024-01-27",
      votes: { approve: 234, reject: 45 },
      priority: "medium",
    },
    {
      id: 3,
      title: "Smart Garden System",
      creator: "David Lee",
      category: "Technology",
      goal: 8000,
      submittedDate: "2024-01-26",
      votes: { approve: 89, reject: 67 },
      priority: "low",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="font-sans text-4xl font-semibold mb-2 text-balance">Queue Review</h1>
          <p className="text-muted-foreground text-lg">Review and approve community-voted projects</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Pending Review</p>
              <Clock className="h-4 w-4 text-yellow-500" />
            </div>
            <p className="text-3xl font-semibold">12</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">High Priority</p>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
            <p className="text-3xl font-semibold">3</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Approved Today</p>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-3xl font-semibold">5</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Rejected Today</p>
              <XCircle className="h-4 w-4 text-red-500" />
            </div>
            <p className="text-3xl font-semibold">2</p>
          </Card>
        </div>

        <div className="space-y-6">
          {pendingProjects.map((project) => (
            <Card key={project.id} className="p-6">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-sans text-xl font-semibold">{project.title}</h3>
                    <Badge className={getPriorityColor(project.priority)}>{project.priority} priority</Badge>
                    <Badge className="bg-muted text-muted-foreground border-border">{project.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    by {project.creator} • Submitted {new Date(project.submittedDate).toLocaleDateString()}
                  </p>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Funding Goal</p>
                      <p className="text-lg font-semibold">${project.goal.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Community Votes</p>
                      <div className="flex items-center gap-3">
                        <span className="text-green-400 font-semibold">{project.votes.approve} ✓</span>
                        <span className="text-red-400 font-semibold">{project.votes.reject} ✗</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Approval Rate</p>
                      <p className="text-lg font-semibold">
                        {Math.round((project.votes.approve / (project.votes.approve + project.votes.reject)) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-green-400 hover:text-green-400 hover:border-green-500/50 bg-transparent"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-400 hover:text-red-400 hover:border-red-500/50 bg-transparent"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
