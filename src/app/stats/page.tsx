import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, DollarSign, Award, Clock } from "lucide-react"

export default function StatsPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <div className="container py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">The Numbers</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real data. No fluff. This is what happens when you let the internet decide.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-accent/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground font-normal">Dollars Raised</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-3xl font-bold">$2.3M</p>
                  <p className="text-xs text-muted-foreground">+12.5% this month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground font-normal">Projects Funded</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-3xl font-bold">1,247</p>
                  <p className="text-xs text-muted-foreground">892 shipped successfully</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground font-normal">Believers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-3xl font-bold">45,234</p>
                  <p className="text-xs text-muted-foreground">+1,203 this week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground font-normal">Ship Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-3xl font-bold">89%</p>
                  <p className="text-xs text-muted-foreground">Creators who deliver</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Active Projects</h3>
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <p className="text-3xl font-bold mb-1">156</p>
              <p className="text-sm text-muted-foreground">Currently accepting backing</p>
            </CardContent>
          </Card>

          <Card className="border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Avg Funding</h3>
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
              <p className="text-3xl font-bold mb-1">$1,847</p>
              <p className="text-sm text-muted-foreground">Per successful project</p>
            </CardContent>
          </Card>

          <Card className="border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">NFTs Minted</h3>
                <Award className="h-5 w-5 text-accent" />
              </div>
              <p className="text-3xl font-bold mb-1">67,892</p>
              <p className="text-sm text-muted-foreground">Unique backer badges</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Projects by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Technology", count: 342, percentage: 27 },
                { name: "Art & Design", count: 298, percentage: 24 },
                { name: "Social Impact", count: 261, percentage: 21 },
                { name: "Gaming", count: 187, percentage: 15 },
                { name: "Food & Beverage", count: 99, percentage: 8 },
                { name: "Other", count: 60, percentage: 5 },
              ].map((category) => (
                <div key={category.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {category.count} projects ({category.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${category.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Growth Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Growth Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <p className="text-sm text-muted-foreground mb-2">This Week</p>
                <p className="text-2xl font-bold text-accent">$47.2K</p>
                <p className="text-xs text-muted-foreground">+23% vs last week</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">This Month</p>
                <p className="text-2xl font-bold text-accent">$189.5K</p>
                <p className="text-xs text-muted-foreground">+15% vs last month</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">This Quarter</p>
                <p className="text-2xl font-bold text-accent">$534.8K</p>
                <p className="text-xs text-muted-foreground">+28% vs last quarter</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">All Time</p>
                <p className="text-2xl font-bold text-accent">$2.3M</p>
                <p className="text-xs text-muted-foreground">Since launch</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
