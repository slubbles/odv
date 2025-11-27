import { Header } from "@/components/header"
import { CreatorCard } from "@/components/creator-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Award } from "lucide-react"
import { Footer } from "@/components/footer"

const featuredCreators = [
  {
    id: "1",
    name: "Sarah Chen",
    title: "AI & Tech Innovator",
    bio: "Passionate about using artificial intelligence to solve real-world problems. Previously worked at leading tech companies before venturing into entrepreneurship.",
    avatar: "/placeholder.svg?key=4jpts",
    totalRaised: 45000,
    projects: 3,
    successRate: 100,
    followers: 1200,
  },
  {
    id: "2",
    name: "Maya Rodriguez",
    title: "Sustainability Advocate",
    bio: "Building a more sustainable future through ethical fashion and eco-conscious business practices. Featured in multiple sustainability conferences worldwide.",
    avatar: "/placeholder.svg?key=b51i6",
    totalRaised: 38000,
    projects: 2,
    successRate: 100,
    followers: 890,
  },
  {
    id: "3",
    name: "Alex Turner",
    title: "Indie Game Developer",
    bio: "Creating nostalgic gaming experiences with modern twists. 10+ years in game development with a focus on storytelling and player engagement.",
    avatar: "/placeholder.svg?key=kycxb",
    totalRaised: 52000,
    projects: 4,
    successRate: 75,
    followers: 2100,
  },
]

const creators = [
  {
    id: "4",
    name: "Jordan Lee",
    title: "Coffee Entrepreneur",
    avatar: "/placeholder.svg?key=vfqmb",
    totalRaised: 22000,
    projects: 2,
    successRate: 100,
    followers: 450,
  },
  {
    id: "5",
    name: "Dr. Emily Watson",
    title: "Mental Health Expert",
    avatar: "/placeholder.svg?key=wzjll",
    totalRaised: 31000,
    projects: 2,
    successRate: 100,
    followers: 1350,
  },
  {
    id: "6",
    name: "Marcus Green",
    title: "Urban Agriculture Pioneer",
    avatar: "/placeholder.svg?key=oy9jb",
    totalRaised: 18000,
    projects: 3,
    successRate: 66,
    followers: 680,
  },
  {
    id: "7",
    name: "Aria Santos",
    title: "Contemporary Artist",
    avatar: "/placeholder.svg?key=hq26r",
    totalRaised: 15000,
    projects: 5,
    successRate: 80,
    followers: 920,
  },
  {
    id: "8",
    name: "Priya Sharma",
    title: "Education Reformer",
    avatar: "/placeholder.svg?key=1mqza",
    totalRaised: 41000,
    projects: 3,
    successRate: 100,
    followers: 1580,
  },
  {
    id: "9",
    name: "Tom Williams",
    title: "Environmental Engineer",
    avatar: "/placeholder.svg?key=f9pv1",
    totalRaised: 27000,
    projects: 2,
    successRate: 100,
    followers: 740,
  },
]

export default function CreatorsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="container mx-auto py-12 flex-1">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Builders who actually ship</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            No fluff. No vaporware. These are the solo founders and small teams getting it done. Follow them. Back their
            next thing.
          </p>
        </div>

        {/* Featured Creators */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-6 w-6 text-accent" />
            <h2 className="text-2xl md:text-3xl font-bold">Proven track record</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCreators.map((creator) => (
              <Card key={creator.id} className="overflow-hidden border-accent/30 hover:border-accent/50 transition-all">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="relative mb-4">
                      <img
                        src={creator.avatar || "/placeholder.svg"}
                        alt={creator.name}
                        className="h-24 w-24 rounded-full object-cover ring-2 ring-accent/20"
                      />
                      <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                        <Award className="h-4 w-4 text-accent-foreground" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{creator.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{creator.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">{creator.bio}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-accent">${(creator.totalRaised / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-muted-foreground">Total Raised</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{creator.projects}</p>
                      <p className="text-xs text-muted-foreground">Projects</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{creator.successRate}%</p>
                      <p className="text-xs text-muted-foreground">Success</p>
                    </div>
                  </div>

                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">View Profile</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Creators */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Everyone else building</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creators.map((creator) => (
              <CreatorCard key={creator.id} {...creator} />
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg">
            Load More Creators
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
