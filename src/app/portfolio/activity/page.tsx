import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, DollarSign, CheckCircle2, MessageSquare, Award, Calendar } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PortfolioActivityPage() {
  const activities = [
    {
      id: 1,
      type: "backing",
      icon: DollarSign,
      title: "Backed AI Recipe App",
      description: "Contributed $15",
      date: "2024-01-28",
      project: "AI Recipe App",
    },
    {
      id: 2,
      type: "vote",
      icon: CheckCircle2,
      title: "Voted on milestone",
      description: 'Approved "MVP Release" milestone',
      date: "2024-01-25",
      project: "Pixel Art Game",
    },
    {
      id: 3,
      type: "comment",
      icon: MessageSquare,
      title: "Commented on update",
      description: "Shared feedback on beta features",
      date: "2024-01-22",
      project: "AI Recipe App",
    },
    {
      id: 4,
      type: "nft",
      icon: Award,
      title: "Earned NFT badge",
      description: "Early Backer #234 badge",
      date: "2024-01-20",
      project: "Sustainable Fashion",
    },
    {
      id: 5,
      type: "backing",
      icon: DollarSign,
      title: "Backed Pixel Art Game",
      description: "Contributed $10",
      date: "2024-01-18",
      project: "Pixel Art Game",
    },
    {
      id: 6,
      type: "vote",
      icon: CheckCircle2,
      title: "Voted on milestone",
      description: 'Approved "Beta Launch" milestone',
      date: "2024-01-15",
      project: "AI Recipe App",
    },
  ]

  const getActivityColor = (type: string) => {
    switch (type) {
      case "backing":
        return "text-accent"
      case "vote":
        return "text-green-400"
      case "comment":
        return "text-blue-400"
      case "nft":
        return "text-yellow-400"
      default:
        return "text-muted-foreground"
    }
  }

  const getActivityBadge = (type: string) => {
    switch (type) {
      case "backing":
        return "bg-accent/20 text-accent border-accent/30"
      case "vote":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "comment":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "nft":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

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
          <h1 className="font-sans text-4xl font-semibold mb-2 text-balance">What You've Done</h1>
          <p className="text-muted-foreground text-lg">Every bet. Every vote. Every move.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Actions</p>
            <p className="text-3xl font-semibold">156</p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Projects Backed</p>
            <p className="text-3xl font-semibold">12</p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Votes Cast</p>
            <p className="text-3xl font-semibold">34</p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">NFTs Earned</p>
            <p className="text-3xl font-semibold">8</p>
          </Card>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const Icon = activity.icon
              return (
                <div key={activity.id} className="relative">
                  {index !== activities.length - 1 && <div className="absolute left-6 top-12 w-0.5 h-full bg-border" />}
                  <div className="flex gap-4">
                    <div
                      className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0 ${getActivityColor(activity.type)}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold">{activity.title}</h3>
                            <Badge className={getActivityBadge(activity.type)}>{activity.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{activity.description}</p>
                          <p className="text-sm text-accent">{activity.project}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(activity.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
