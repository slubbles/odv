import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Heart, Zap, Users } from "lucide-react"
import { Footer } from "@/components/footer"

const team = [
  { name: "Alex Johnson", role: "CEO & Co-Founder", avatar: "/placeholder.svg?height=200&width=200" },
  { name: "Sarah Chen", role: "CTO & Co-Founder", avatar: "/placeholder.svg?height=200&width=200" },
  { name: "Marcus Lee", role: "Head of Community", avatar: "/placeholder.svg?height=200&width=200" },
  { name: "Emma Rodriguez", role: "Product Lead", avatar: "/placeholder.svg?height=200&width=200" },
]

const successStories = [
  {
    project: "AI Recipe Discovery",
    amount: "$10,000",
    backers: 1200,
    impact: "Helped 50,000+ users discover new recipes",
  },
  {
    project: "Sustainable Fashion App",
    amount: "$8,500",
    backers: 850,
    impact: "Connected 200+ eco-friendly brands",
  },
  {
    project: "Mental Health Journal",
    amount: "$12,000",
    backers: 1450,
    impact: "Supporting 10,000+ daily active users",
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="container mx-auto py-12 flex-1">
        {/* Hero */}
        <div className="text-center mb-20">
          <Badge className="mb-4 bg-accent/20 text-accent-foreground border-accent/30">Who We Are</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            VCs Won't Fund You?
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/60">
              Good. We Will.
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tired of pitching to people who've never shipped code? Us too. So we built a platform where anyone with $1
            can bet on the next big thing.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          <Card className="border-accent/30">
            <CardContent className="p-8">
              <div className="h-14 w-14 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                <Target className="h-7 w-7 text-accent" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                Kill the gatekeepers. Make funding accessible to every builder with an internet connection and every
                backer with $1 to spare.
              </p>
            </CardContent>
          </Card>

          <Card className="border-accent/30">
            <CardContent className="p-8">
              <div className="h-14 w-14 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                <Heart className="h-7 w-7 text-accent" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                A world where great ideas beat great connections. Where shipping matters more than schmoozing. Where one
                dollar can change everything.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What We Stand For</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-accent/30 text-center">
              <CardContent className="p-8">
                <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">Builders Win</h3>
                <p className="text-sm text-muted-foreground">
                  We back people who ship. Not people who talk about shipping.
                </p>
              </CardContent>
            </Card>

            <Card className="border-accent/30 text-center">
              <CardContent className="p-8">
                <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">Community Rules</h3>
                <p className="text-sm text-muted-foreground">You vote. You decide. Your dollar, your voice.</p>
              </CardContent>
            </Card>

            <Card className="border-accent/30 text-center">
              <CardContent className="p-8">
                <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">No BS</h3>
                <p className="text-sm text-muted-foreground">
                  Every dollar tracked. Every milestone public. Zero smoke and mirrors.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Meet the Team</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            We're a passionate group of builders, dreamers, and believers in the power of community-driven innovation
          </p>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {team.map((member) => (
              <Card key={member.name} className="text-center border-accent/30">
                <CardContent className="p-6">
                  <img
                    src={member.avatar || "/placeholder.svg"}
                    alt={member.name}
                    className="h-24 w-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-bold mb-1">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {successStories.map((story) => (
              <Card key={story.project} className="border-accent/30">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">{story.project}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Raised:</span>
                      <span className="font-semibold text-accent">{story.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Backers:</span>
                      <span className="font-semibold">{story.backers}</span>
                    </div>
                    <div className="pt-3 border-t">
                      <p className="text-muted-foreground italic">{story.impact}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-center mb-12">By the Numbers</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <p className="text-4xl font-bold text-accent mb-2">$2.3M</p>
                  <p className="text-sm text-muted-foreground">Total Raised</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-accent mb-2">1,247</p>
                  <p className="text-sm text-muted-foreground">Projects Funded</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-accent mb-2">45K+</p>
                  <p className="text-sm text-muted-foreground">Community Members</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-accent mb-2">89%</p>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
