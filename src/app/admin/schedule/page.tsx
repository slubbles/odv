import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function AdminSchedulePage() {
  const scheduledProjects = [
    { id: 1, title: "AI Recipe App", launchDate: "2024-02-01", status: "confirmed", category: "Technology" },
    { id: 2, title: "Pixel Art Game", launchDate: "2024-02-05", status: "confirmed", category: "Gaming" },
    { id: 3, title: "Eco Water Bottle", launchDate: "2024-02-10", status: "pending", category: "Sustainability" },
    { id: 4, title: "VR Classroom", launchDate: "2024-02-15", status: "pending", category: "Education" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="font-sans text-4xl font-semibold mb-2 text-balance">The Launch Calendar</h1>
          <p className="text-muted-foreground text-lg">When projects go live. You decide.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">This Month</p>
            <p className="text-3xl font-semibold">8</p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Confirmed</p>
            <p className="text-3xl font-semibold">5</p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Pending</p>
            <p className="text-3xl font-semibold">3</p>
          </Card>
        </div>

        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-sans text-2xl font-semibold">February 2024</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {scheduledProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold">{project.title}</h3>
                      <Badge className="bg-muted text-muted-foreground border-border">{project.category}</Badge>
                      <Badge
                        className={
                          project.status === "confirmed"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Launch: {new Date(project.launchDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit Date
                  </Button>
                  <Button variant="outline" size="sm">
                    View Project
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
