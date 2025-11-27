import { Header } from "@/components/header"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, LinkIcon, Calendar, TrendingUp, Users, Award } from "lucide-react"

const creatorProjects = [
  {
    id: "1",
    title: "AI-Powered Recipe Discovery",
    description: "Transform how people discover and cook meals with AI.",
    creator: { name: "Sarah Chen", avatar: "/the-creator.png" },
    category: "Technology",
    image: "/ai-recipe-app-interface.jpg",
    raised: 8450,
    goal: 10000,
    backers: 423,
    daysLeft: 12,
  },
  {
    id: "2",
    title: "Smart Home Automation Hub",
    description: "Connect all your devices in one seamless platform.",
    creator: { name: "Sarah Chen", avatar: "/the-creator.png" },
    category: "Technology",
    image: "/smart-home-concept.png",
    raised: 15200,
    goal: 15000,
    backers: 678,
    daysLeft: 0,
  },
]

export default function CreatorProfilePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <div className="border-b border-border">
        <div className="container py-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img src="/the-creator.png" alt="Sarah Chen" className="h-32 w-32 rounded-full border-4 border-accent/30" />

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">Sarah Chen</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>San Francisco, CA</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Joined Jan 2024</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4" />
                      <a href="#" className="text-accent hover:underline">
                        sarahchen.com
                      </a>
                    </div>
                  </div>
                </div>
                <Button variant="outline">Follow</Button>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">
                Solo founder. Ships fast. Two exits under my belt. Building AI tools that don't suck. If you believe in
                solving real problems without the VC circus, I'm your person.
              </p>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">AI & ML</Badge>
                <Badge variant="secondary">Mobile Apps</Badge>
                <Badge variant="secondary">User Experience</Badge>
                <Badge variant="secondary">Food Tech</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container py-12">
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="border-accent/30">
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <p className="text-2xl font-bold mb-1">2</p>
              <p className="text-sm text-muted-foreground">Projects Launched</p>
            </CardContent>
          </Card>

          <Card className="border-accent/30">
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <p className="text-2xl font-bold mb-1">1,101</p>
              <p className="text-sm text-muted-foreground">People Believed</p>
            </CardContent>
          </Card>

          <Card className="border-accent/30">
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center mx-auto mb-3">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <p className="text-2xl font-bold mb-1">$23.7K</p>
              <p className="text-sm text-muted-foreground">Dollars Raised</p>
            </CardContent>
          </Card>

          <Card className="border-accent/30">
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <p className="text-2xl font-bold mb-1">100%</p>
              <p className="text-sm text-muted-foreground">Delivered</p>
            </CardContent>
          </Card>
        </div>

        {/* Projects */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">What They Built</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creatorProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
