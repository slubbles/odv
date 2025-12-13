"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Shield, Users as UsersIcon, TrendingUp, AlertCircle } from "lucide-react"

export function UsersTab() {
  return (
    <div className="space-y-6">
      {/* Real Data Notice */}
      <Card className="p-6 border-accent/30 bg-accent/10">
        <div className="flex items-center gap-3">
          <UsersIcon className="h-5 w-5 text-accent" />
          <div>
            <p className="font-semibold text-accent-foreground">SOON Testnet - Real Data Only</p>
            <p className="text-sm text-muted-foreground mt-1">User data will populate as wallets connect and interact with the platform. No mock data.</p>
          </div>
        </div>
      </Card>

      {/* Stats - Empty State */}
      <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-4">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-muted-foreground">Total Users</p>
            <UsersIcon className="h-4 w-4 text-accent" />
          </div>
          <p className="text-2xl sm:text-3xl font-semibold">0</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Unique wallets</p>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-muted-foreground">Creators</p>
            <TrendingUp className="h-4 w-4 text-accent" />
          </div>
          <p className="text-2xl sm:text-3xl font-semibold">0</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Project submitters</p>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-muted-foreground">Backers</p>
            <Shield className="h-4 w-4 text-accent" />
          </div>
          <p className="text-2xl sm:text-3xl font-semibold">0</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Project funders</p>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-muted-foreground">Suspended</p>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-semibold">0</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Banned users</p>
        </Card>
      </div>

      {/* User List - Empty State */}
      <Card className="p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users by wallet address..." className="pl-10" disabled />
          </div>
        </div>

        <div className="py-12 text-center">
          <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No users yet</p>
          <p className="text-sm text-muted-foreground mt-2">Users will appear here as wallets connect and submit/back projects</p>
        </div>
      </Card>
    </div>
  )
}
