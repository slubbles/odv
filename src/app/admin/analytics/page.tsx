import { Card } from "@/components/ui/card"
import { TrendingUp, DollarSign, Users, Zap } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function AdminAnalyticsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="font-sans text-4xl font-semibold mb-2 text-balance">The Numbers</h1>
          <p className="text-muted-foreground text-lg">What's working. What's not.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <DollarSign className="h-4 w-4 text-accent" />
            </div>
            <p className="text-3xl font-semibold">$245,670</p>
            <p className="text-xs text-green-400 mt-1">+18.2% from last month</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Active Projects</p>
              <Zap className="h-4 w-4 text-accent" />
            </div>
            <p className="text-3xl font-semibold">87</p>
            <p className="text-xs text-green-400 mt-1">+12 this week</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Users</p>
              <Users className="h-4 w-4 text-accent" />
            </div>
            <p className="text-3xl font-semibold">2,456</p>
            <p className="text-xs text-green-400 mt-1">+89 this week</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <TrendingUp className="h-4 w-4 text-accent" />
            </div>
            <p className="text-3xl font-semibold">78%</p>
            <p className="text-xs text-green-400 mt-1">+5% increase</p>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="p-6">
            <h3 className="font-sans text-xl font-semibold mb-4">Revenue Over Time</h3>
            <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground">Chart: Revenue trend line</p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-sans text-xl font-semibold mb-4">Project Categories</h3>
            <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground">Chart: Category distribution</p>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="font-sans text-xl font-semibold mb-4">Projects That Won</h3>
          <div className="space-y-4">
            {[
              { name: "AI Recipe App", revenue: "$45,230", backers: 567, growth: "+23%" },
              { name: "Pixel Art Game", revenue: "$38,920", backers: 423, growth: "+18%" },
              { name: "Sustainable Fashion", revenue: "$29,870", backers: 344, growth: "+15%" },
            ].map((project, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-semibold mb-1">{project.name}</p>
                  <p className="text-sm text-muted-foreground">{project.backers} backers</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold text-accent">{project.revenue}</p>
                  <p className="text-xs text-green-400">{project.growth}</p>
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
