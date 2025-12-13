"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, DollarSign, Users, Zap, BarChart3 } from "lucide-react"

export function AnalyticsTab() {
  return (
    <div className="space-y-6">
      {/* Real Data Notice */}
      <Card className="p-6 border-accent/30 bg-accent/10">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-5 w-5 text-accent" />
          <div>
            <p className="font-semibold text-accent-foreground">SOON Testnet - Real Data Only</p>
            <p className="text-sm text-muted-foreground mt-1">Analytics will populate as projects get submitted and backed on testnet. No mock data.</p>
          </div>
        </div>
      </Card>

      {/* Stats Overview - Empty State */}
      <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-4">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-muted-foreground">Total Revenue</p>
            <DollarSign className="h-4 w-4 text-accent" />
          </div>
          <p className="text-xl sm:text-3xl font-semibold">$0</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Awaiting first backing</p>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-muted-foreground">Active Projects</p>
            <Zap className="h-4 w-4 text-accent" />
          </div>
          <p className="text-xl sm:text-3xl font-semibold">0</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Approve projects from queue</p>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-muted-foreground">Total Users</p>
            <Users className="h-4 w-4 text-accent" />
          </div>
          <p className="text-xl sm:text-3xl font-semibold">0</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Connected wallets</p>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-muted-foreground">Success Rate</p>
            <TrendingUp className="h-4 w-4 text-accent" />
          </div>
          <p className="text-xl sm:text-3xl font-semibold">—</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Need completed projects</p>
        </Card>
      </div>

      {/* Charts - Coming Soon */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Revenue Over Time</h3>
          <div className="h-64 flex flex-col items-center justify-center border border-dashed border-border rounded-lg">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-sm">Chart populates with real backing data</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Project Categories</h3>
          <div className="h-64 flex flex-col items-center justify-center border border-dashed border-border rounded-lg">
            <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-sm">Distribution shows after submissions</p>
          </div>
        </Card>
      </div>

      {/* Top Projects - Empty State */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Top Performing Projects</h3>
        <div className="py-12 text-center">
          <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No funded projects yet</p>
          <p className="text-sm text-muted-foreground mt-2">Top projects will appear here once backers start funding</p>
        </div>
      </Card>
    </div>
  )
}
