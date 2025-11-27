import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function AdminMilestonesPage() {
  const milestones = [
    {
      id: 1,
      project: "AI Recipe App",
      title: "MVP Release",
      dueDate: "2024-02-15",
      status: "pending-review",
      votes: { approve: 234, reject: 12 },
      evidenceSubmitted: true,
    },
    {
      id: 2,
      project: "Pixel Art Game",
      title: "Alpha Testing",
      dueDate: "2024-03-01",
      status: "overdue",
      votes: null,
      evidenceSubmitted: false,
    },
    {
      id: 3,
      project: "Sustainable Fashion",
      title: "First Collection",
      dueDate: "2024-02-20",
      status: "on-track",
      votes: null,
      evidenceSubmitted: false,
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending-review":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "overdue":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "on-track":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending-review":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "overdue":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "on-track":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="font-sans text-4xl font-semibold mb-2 text-balance">Did They Ship?</h1>
          <p className="text-muted-foreground text-lg">Check proof. Approve or reject. Simple.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Pending Review</p>
              <Clock className="h-4 w-4 text-yellow-500" />
            </div>
            <p className="text-3xl font-semibold">8</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Overdue</p>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
            <p className="text-3xl font-semibold">3</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Approved</p>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-3xl font-semibold">45</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Rejected</p>
              <XCircle className="h-4 w-4 text-red-500" />
            </div>
            <p className="text-3xl font-semibold">2</p>
          </Card>
        </div>

        <div className="space-y-6">
          {milestones.map((milestone) => (
            <Card key={milestone.id} className="p-6">
              <div className="flex items-start justify-between gap-6">
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
                        <span className={milestone.evidenceSubmitted ? "text-green-400" : "text-muted-foreground"}>
                          {milestone.evidenceSubmitted ? "Submitted" : "Not submitted"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm">
                    View Evidence
                  </Button>
                  {milestone.status === "pending-review" && (
                    <>
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
                    </>
                  )}
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
