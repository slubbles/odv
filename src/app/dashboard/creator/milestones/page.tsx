import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Circle, Clock, AlertCircle, ChevronRight, TrendingUp } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function CreatorMilestonesPage() {
  const milestones = [
    {
      id: 1,
      project: "AI Recipe App",
      title: "MVP Release",
      dueDate: "2024-02-15",
      status: "pending",
      votes: { approve: 234, reject: 12 },
      evidence: "submitted",
    },
    {
      id: 2,
      project: "Pixel Art Game",
      title: "Alpha Testing",
      dueDate: "2024-03-01",
      status: "in-progress",
      votes: null,
      evidence: "none",
    },
    {
      id: 3,
      project: "AI Recipe App",
      title: "Beta Launch",
      dueDate: "2024-04-10",
      status: "upcoming",
      votes: null,
      evidence: "none",
    },
    {
      id: 4,
      project: "Sustainable Fashion",
      title: "First Collection",
      dueDate: "2024-01-20",
      status: "completed",
      votes: { approve: 456, reject: 23 },
      evidence: "approved",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "in-progress":
        return <Circle className="h-5 w-5 text-blue-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      completed: "bg-green-500/20 text-green-400 border-green-500/30",
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      "in-progress": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      upcoming: "bg-muted text-muted-foreground border-border",
    }
    return variants[status] || variants.upcoming
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="font-sans text-4xl font-semibold mb-2 text-balance">Your Promises</h1>
          <p className="text-muted-foreground text-lg">You said you'd build. Now prove it.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total</p>
              <TrendingUp className="h-4 w-4 text-accent" />
            </div>
            <p className="text-3xl font-semibold">12</p>
            <p className="text-xs text-muted-foreground mt-1">Across 3 projects</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Shipped</p>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-3xl font-semibold">7</p>
            <p className="text-xs text-muted-foreground mt-1">58% delivery rate</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Waiting on You</p>
              <Clock className="h-4 w-4 text-yellow-500" />
            </div>
            <p className="text-3xl font-semibold">2</p>
            <p className="text-xs text-muted-foreground mt-1">Backers are watching</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Building</p>
              <Circle className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-3xl font-semibold">3</p>
            <p className="text-xs text-muted-foreground mt-1">On schedule</p>
          </Card>
        </div>

        <div className="space-y-4">
          {milestones.map((milestone) => (
            <Card key={milestone.id} className="p-6 hover:border-accent/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  {getStatusIcon(milestone.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-sans text-lg font-semibold">{milestone.title}</h3>
                      <Badge className={getStatusBadge(milestone.status)}>{milestone.status.replace("-", " ")}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{milestone.project}</p>
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-muted-foreground">Due: </span>
                        <span className="text-foreground">{new Date(milestone.dueDate).toLocaleDateString()}</span>
                      </div>
                      {milestone.votes && (
                        <div>
                          <span className="text-muted-foreground">Votes: </span>
                          <span className="text-green-400">{milestone.votes.approve} approve</span>
                          <span className="text-muted-foreground"> / </span>
                          <span className="text-red-400">{milestone.votes.reject} reject</span>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground">Evidence: </span>
                        <span
                          className={
                            milestone.evidence === "approved"
                              ? "text-green-400"
                              : milestone.evidence === "submitted"
                                ? "text-yellow-400"
                                : "text-muted-foreground"
                          }
                        >
                          {milestone.evidence}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="shrink-0">
                  <span>View Details</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
