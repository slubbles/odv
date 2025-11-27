"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DollarSign, Trophy, Rocket, TrendingUp } from "lucide-react"

interface Activity {
  id: string
  type: "back" | "milestone" | "launch" | "funded"
  user: {
    name: string
    avatar: string
  }
  project: string
  amount?: number
  timestamp: string
}

const activities: Activity[] = [
  {
    id: "1",
    type: "back",
    user: { name: "Sarah M.", avatar: "/placeholder.svg?height=40&width=40" },
    project: "AI Recipe Platform",
    amount: 25,
    timestamp: "2 minutes ago",
  },
  {
    id: "2",
    type: "milestone",
    user: { name: "Alex T.", avatar: "/placeholder.svg?height=40&width=40" },
    project: "Pixel Quest Game",
    timestamp: "15 minutes ago",
  },
  {
    id: "3",
    type: "launch",
    user: { name: "Jordan L.", avatar: "/placeholder.svg?height=40&width=40" },
    project: "Urban Garden System",
    timestamp: "1 hour ago",
  },
  {
    id: "4",
    type: "funded",
    user: { name: "Emily W.", avatar: "/placeholder.svg?height=40&width=40" },
    project: "Mental Health App",
    timestamp: "3 hours ago",
  },
  {
    id: "5",
    type: "back",
    user: { name: "Marcus G.", avatar: "/placeholder.svg?height=40&width=40" },
    project: "Coffee Roastery",
    amount: 10,
    timestamp: "5 hours ago",
  },
]

export function ActivityFeed() {
  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "back":
        return <DollarSign className="h-5 w-5 text-accent" />
      case "milestone":
        return <Trophy className="h-5 w-5 text-accent" />
      case "launch":
        return <Rocket className="h-5 w-5 text-accent" />
      case "funded":
        return <TrendingUp className="h-5 w-5 text-accent" />
    }
  }

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case "back":
        return `backed ${activity.project} with $${activity.amount}`
      case "milestone":
        return `achieved a milestone in ${activity.project}`
      case "launch":
        return `launched ${activity.project}`
      case "funded":
        return `${activity.project} reached its funding goal!`
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          Live Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
            <Avatar className="h-10 w-10">
              <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
              <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {getActivityIcon(activity.type)}
                <span className="font-semibold text-sm">{activity.user.name}</span>
              </div>
              <p className="text-sm text-muted-foreground">{getActivityText(activity)}</p>
              <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
