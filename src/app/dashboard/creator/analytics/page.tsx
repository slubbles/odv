import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Users, DollarSign, Eye, Download } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function CreatorAnalyticsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-sans text-4xl font-semibold mb-2 text-balance">The Numbers</h1>
            <p className="text-muted-foreground text-lg">No fluff. Just what's working.</p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Money In</p>
              <DollarSign className="h-4 w-4 text-accent" />
            </div>
            <p className="text-3xl font-semibold">$24,567</p>
            <p className="text-xs text-green-400 mt-1">+12.5% from last month</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Believers</p>
              <Users className="h-4 w-4 text-accent" />
            </div>
            <p className="text-3xl font-semibold">1,234</p>
            <p className="text-xs text-green-400 mt-1">+89 this week</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Eyeballs</p>
              <Eye className="h-4 w-4 text-accent" />
            </div>
            <p className="text-3xl font-semibold">45.2K</p>
            <p className="text-xs text-green-400 mt-1">+23% this month</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Close Rate</p>
              <TrendingUp className="h-4 w-4 text-accent" />
            </div>
            <p className="text-3xl font-semibold">2.73%</p>
            <p className="text-xs text-green-400 mt-1">+0.5% increase</p>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="p-6">
            <h3 className="font-sans text-xl font-semibold mb-4">Money Over Time</h3>
            <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground">Chart: Revenue line graph</p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-sans text-xl font-semibold mb-4">People Who Believed</h3>
            <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground">Chart: Backer growth curve</p>
            </div>
          </Card>
        </div>

        <Card className="p-6 mb-8">
          <h3 className="font-sans text-xl font-semibold mb-4">What's Crushing It</h3>
          <div className="space-y-4">
            {[
              { name: "AI Recipe App", revenue: "$12,450", backers: 567, views: "23.4K" },
              { name: "Pixel Art Game", revenue: "$8,920", backers: 423, views: "15.2K" },
              { name: "Sustainable Fashion", revenue: "$3,197", backers: 244, views: "6.6K" },
            ].map((project, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-accent/50 transition-colors"
              >
                <div>
                  <p className="font-semibold mb-1">{project.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {project.backers} backers • {project.views} views
                  </p>
                </div>
                <p className="text-xl font-semibold text-accent">{project.revenue}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
