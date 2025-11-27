import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, TrendingUp, Vote, CheckCircle } from "lucide-react"
import Link from "next/link"

const notifications = [
  {
    id: 1,
    type: "milestone",
    icon: Vote,
    title: "Milestone Voting Required",
    description: 'AI-Powered Recipe Discovery needs your vote on "Mobile App Development"',
    project: "AI-Powered Recipe Discovery",
    projectId: "1",
    timestamp: "2 hours ago",
    read: false,
    action: { label: "Vote Now", href: "/voting" },
  },
  {
    id: 2,
    type: "comment",
    icon: MessageCircle,
    title: "New Comment",
    description: "Sarah Chen replied to your comment on AI-Powered Recipe Discovery",
    project: "AI-Powered Recipe Discovery",
    projectId: "1",
    timestamp: "5 hours ago",
    read: false,
    action: { label: "Reply", href: "/project/1" },
  },
  {
    id: 3,
    type: "update",
    icon: TrendingUp,
    title: "Project Update",
    description: "Indie Game Studio: Pixel Quest reached 80% funding milestone",
    project: "Indie Game Studio: Pixel Quest",
    projectId: "3",
    timestamp: "1 day ago",
    read: true,
    action: { label: "View Project", href: "/project/3" },
  },
  {
    id: 4,
    type: "milestone",
    icon: Vote,
    title: "Milestone Voting Required",
    description: 'Sustainable Fashion Marketplace needs your vote on "Platform Launch"',
    project: "Sustainable Fashion Marketplace",
    projectId: "2",
    timestamp: "1 day ago",
    read: false,
    action: { label: "Vote Now", href: "/voting" },
  },
  {
    id: 5,
    type: "milestone",
    icon: CheckCircle,
    title: "Milestone Completed",
    description: 'Urban Vertical Garden System completed "Production Setup" milestone',
    project: "Urban Vertical Garden System",
    projectId: "6",
    timestamp: "2 days ago",
    read: true,
    action: { label: "View Project", href: "/project/6" },
  },
  {
    id: 6,
    type: "update",
    icon: TrendingUp,
    title: "Funding Milestone",
    description: "Mental Health Journaling App reached $5,000 in funding",
    project: "Mental Health Journaling App",
    projectId: "5",
    timestamp: "3 days ago",
    read: true,
    action: { label: "View Project", href: "/project/5" },
  },
  {
    id: 7,
    type: "comment",
    icon: MessageCircle,
    title: "New Comment",
    description: "Alex Turner mentioned you in a comment",
    project: "Indie Game Studio: Pixel Quest",
    projectId: "3",
    timestamp: "3 days ago",
    read: true,
    action: { label: "View Comment", href: "/project/3" },
  },
  {
    id: 8,
    type: "milestone",
    icon: Vote,
    title: "Vote Reminder",
    description: "Local Artist Collaboration Platform voting ends in 2 days",
    project: "Local Artist Collaboration",
    projectId: "7",
    timestamp: "4 days ago",
    read: true,
    action: { label: "Vote Now", href: "/voting" },
  },
]

export default function NotificationsPage() {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container py-12 max-w-4xl">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold">What's Happening</h1>
            {unreadCount > 0 && <Badge className="bg-accent text-accent-foreground">{unreadCount} new</Badge>}
          </div>
          <p className="text-lg text-muted-foreground">Projects you backed. People who need you.</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6 space-y-4">
            {notifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </TabsContent>

          <TabsContent value="milestones" className="mt-6 space-y-4">
            {notifications
              .filter((n) => n.type === "milestone")
              .map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
          </TabsContent>

          <TabsContent value="comments" className="mt-6 space-y-4">
            {notifications
              .filter((n) => n.type === "comment")
              .map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
          </TabsContent>

          <TabsContent value="updates" className="mt-6 space-y-4">
            {notifications
              .filter((n) => n.type === "update")
              .map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Button variant="outline">Mark All as Read</Button>
        </div>
      </div>
    </div>
  )
}

function NotificationCard({ notification }: { notification: (typeof notifications)[0] }) {
  const Icon = notification.icon

  return (
    <Card
      className={`overflow-hidden transition-all hover:border-accent/50 ${
        !notification.read ? "border-accent/30 bg-accent/5" : ""
      }`}
    >
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div
            className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              notification.type === "milestone"
                ? "bg-accent/20"
                : notification.type === "comment"
                  ? "bg-chart-2/20"
                  : "bg-chart-3/20"
            }`}
          >
            <Icon
              className={`h-6 w-6 ${
                notification.type === "milestone"
                  ? "text-accent"
                  : notification.type === "comment"
                    ? "text-[oklch(0.6_0.15_190)]"
                    : "text-[oklch(0.65_0.18_150)]"
              }`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{notification.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{notification.description}</p>
              </div>
              {!notification.read && <div className="h-2 w-2 rounded-full bg-accent flex-shrink-0 mt-2" />}
            </div>

            <div className="flex items-center justify-between gap-4 mt-4">
              <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
              <Button size="sm" variant="outline" asChild>
                <Link href={notification.action.href}>{notification.action.label}</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
