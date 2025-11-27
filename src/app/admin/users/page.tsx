import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Shield, Users, TrendingUp, AlertCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function AdminUsersPage() {
  const users = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@email.com",
      role: "creator",
      projects: 3,
      backedProjects: 12,
      totalRaised: 45000,
      totalBacked: 89,
      status: "active",
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike@email.com",
      role: "creator",
      projects: 2,
      backedProjects: 8,
      totalRaised: 28000,
      totalBacked: 56,
      status: "active",
    },
    {
      id: 3,
      name: "Emma Davis",
      email: "emma@email.com",
      role: "backer",
      projects: 0,
      backedProjects: 24,
      totalRaised: 0,
      totalBacked: 145,
      status: "active",
    },
    {
      id: 4,
      name: "John Smith",
      email: "john@email.com",
      role: "creator",
      projects: 1,
      backedProjects: 5,
      totalRaised: 12000,
      totalBacked: 23,
      status: "suspended",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="font-sans text-4xl font-semibold mb-2 text-balance">Who's Here</h1>
          <p className="text-muted-foreground text-lg">Builders and backers. Keep them honest.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Users</p>
              <Users className="h-4 w-4 text-accent" />
            </div>
            <p className="text-3xl font-semibold">2,456</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Creators</p>
              <TrendingUp className="h-4 w-4 text-accent" />
            </div>
            <p className="text-3xl font-semibold">342</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Backers</p>
              <Shield className="h-4 w-4 text-accent" />
            </div>
            <p className="text-3xl font-semibold">2,114</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Suspended</p>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
            <p className="text-3xl font-semibold">12</p>
          </Card>
        </div>

        <Card className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users by name or email..." className="pl-10" />
            </div>
          </div>

          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-accent font-semibold">{user.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-semibold">{user.name}</p>
                      <Badge
                        className={
                          user.role === "creator"
                            ? "bg-accent/20 text-accent border-accent/30"
                            : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        }
                      >
                        {user.role}
                      </Badge>
                      <Badge
                        className={
                          user.status === "active"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                        }
                      >
                        {user.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="text-muted-foreground">{user.projects} projects created</span>
                      <span className="text-muted-foreground">{user.backedProjects} backed</span>
                      {user.totalRaised > 0 && (
                        <span className="text-accent">${user.totalRaised.toLocaleString()} raised</span>
                      )}
                      <span className="text-muted-foreground">${user.totalBacked} total backed</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={user.status === "suspended" ? "text-green-400" : "text-red-400"}
                  >
                    {user.status === "suspended" ? "Reinstate" : "Suspend"}
                  </Button>
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
