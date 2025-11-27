import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, TrendingUp, Bell, BellOff } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PortfolioFollowingPage() {
  const following = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/the-creator.png",
      bio: "AI & Machine Learning enthusiast",
      projects: 3,
      totalRaised: 45000,
      backers: 1234,
      notifications: true,
    },
    {
      id: 2,
      name: "Mike Chen",
      avatar: "/creator2.png",
      bio: "Game developer & pixel artist",
      projects: 2,
      totalRaised: 28000,
      backers: 890,
      notifications: true,
    },
    {
      id: 3,
      name: "Emma Davis",
      avatar: "/creator-woman-fashion.jpg",
      bio: "Sustainable fashion designer",
      projects: 1,
      totalRaised: 12000,
      backers: 456,
      notifications: false,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/portfolio">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portfolio
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="font-sans text-4xl font-semibold mb-2 text-balance">Following</h1>
          <p className="text-muted-foreground text-lg">Creators you're following and their latest projects</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Following</p>
            <p className="text-3xl font-semibold">{following.length}</p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Active Projects</p>
            <p className="text-3xl font-semibold">{following.reduce((sum, c) => sum + c.projects, 0)}</p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Notifications On</p>
            <p className="text-3xl font-semibold">{following.filter((c) => c.notifications).length}</p>
          </Card>
        </div>

        <div className="grid gap-6">
          {following.map((creator) => (
            <Card key={creator.id} className="p-6 hover:border-accent/50 transition-colors">
              <div className="flex items-start gap-6">
                <img
                  src={creator.avatar || "/placeholder.svg"}
                  alt={creator.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-sans text-xl font-semibold mb-1">{creator.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{creator.bio}</p>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{creator.projects} projects</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{creator.backers} backers</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Raised: </span>
                          <span className="font-semibold text-accent">${creator.totalRaised.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        {creator.notifications ? (
                          <>
                            <Bell className="h-4 w-4 mr-2" />
                            Notifications On
                          </>
                        ) : (
                          <>
                            <BellOff className="h-4 w-4 mr-2" />
                            Notifications Off
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        Unfollow
                      </Button>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-3">Latest project:</p>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">AI Recipe App</p>
                      <Button size="sm" className="bg-accent hover:bg-accent/90" asChild>
                        <Link href="/project/1">View Project</Link>
                      </Button>
                    </div>
                  </div>
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
