"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, DollarSign, Users, Zap } from "lucide-react"

export function AnalyticsTab() {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-4">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-muted-foreground">Total Revenue</p>
            <DollarSign className="h-4 w-4 text-accent" />
          </div>
          <p className="text-xl sm:text-3xl font-semibold">$245,670</p>
          <p className="text-[10px] sm:text-xs text-green-400 mt-1">+18.2% from last month</p>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-muted-foreground">Active Projects</p>
            <Zap className="h-4 w-4 text-accent" />
          </div>
          <p className="text-xl sm:text-3xl font-semibold">87</p>
          <p className="text-[10px] sm:text-xs text-green-400 mt-1">+12 this week</p>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-muted-foreground">Total Users</p>
            <Users className="h-4 w-4 text-accent" />
          </div>
          <p className="text-xl sm:text-3xl font-semibold">2,456</p>
          <p className="text-[10px] sm:text-xs text-green-400 mt-1">+89 this week</p>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-muted-foreground">Success Rate</p>
            <TrendingUp className="h-4 w-4 text-accent" />
          </div>
          <p className="text-xl sm:text-3xl font-semibold">78%</p>
          <p className="text-[10px] sm:text-xs text-green-400 mt-1">+5% increase</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
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

      {/* Top Projects */}
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
  )
}
