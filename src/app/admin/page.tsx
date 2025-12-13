"use client"

import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, BarChart3, CheckSquare, Users as UsersIcon, Activity, Calendar, Settings } from "lucide-react"
import { Footer } from "@/components/footer"
import { AdminGuard } from "@/components/admin/admin-guard"
import { QueueTab } from "@/components/admin/tabs/queue-tab"
import { MilestonesTab } from "@/components/admin/tabs/milestones-tab"
import { AnalyticsTab } from "@/components/admin/tabs/analytics-tab"
import { UsersTab } from "@/components/admin/tabs/users-tab"

function AdminPageContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex flex-1">
        <div className="flex-1 container px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24 md:pb-12 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-accent" />
              <Badge className="bg-accent/20 text-accent-foreground border-accent/30">Admin Panel</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Gatekeeper</h1>
            <p className="text-xl text-muted-foreground">The community votes. You decide who ships.</p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="queue" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7 max-w-4xl">
              <TabsTrigger value="queue" className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Queue</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="milestones" className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Milestones</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Activity</span>
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Schedule</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="queue">
              <QueueTab />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsTab />
            </TabsContent>

            <TabsContent value="milestones">
              <MilestonesTab />
            </TabsContent>

            <TabsContent value="users">
              <UsersTab />
            </TabsContent>

            <TabsContent value="activity">
              <div className="text-center py-12 text-muted-foreground">
                Activity tab - Coming soon
              </div>
            </TabsContent>

            <TabsContent value="schedule">
              <div className="text-center py-12 text-muted-foreground">
                Schedule tab - Coming soon
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="text-center py-12 text-muted-foreground">
                Settings tab - Coming soon
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  )
}

// Wrap the admin page with access control
export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminPageContent />
    </AdminGuard>
  )
}
