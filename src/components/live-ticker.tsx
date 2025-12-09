"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DollarSign } from "lucide-react"

const recentActivity = [
  { name: "Sarah M.", action: "backed", project: "AI Recipe App", amount: 1, time: "2m ago", avatar: "https://i.pravatar.cc/150?u=sarah" },
  {
    name: "Alex T.",
    action: "backed",
    project: "Pixel Quest",
    amount: 5,
    time: "5m ago",
    avatar: "https://i.pravatar.cc/150?u=alex",
  },
  {
    name: "Jordan L.",
    action: "backed",
    project: "Coffee Roastery",
    amount: 1,
    time: "8m ago",
    avatar: "https://i.pravatar.cc/150?u=jordan",
  },
  {
    name: "Emily W.",
    action: "backed",
    project: "Mental Health App",
    amount: 3,
    time: "12m ago",
    avatar: "https://i.pravatar.cc/150?u=emily",
  },
  {
    name: "Marcus G.",
    action: "launched",
    project: "Vertical Garden",
    amount: 0,
    time: "15m ago",
    avatar: "https://i.pravatar.cc/150?u=marcus",
  },
]

export function LiveTicker() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % recentActivity.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const activity = recentActivity[currentIndex]

  return (
    <div className="fixed bottom-20 md:bottom-4 right-4 z-40 animate-slide-up">
      <div className="bg-card border border-border rounded-lg shadow-lg p-4 max-w-xs backdrop-blur-sm bg-background/95">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={activity.avatar || "/placeholder.svg"} />
            <AvatarFallback>{activity.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              <span className="text-accent">{activity.name}</span> {activity.action}
            </p>
            <p className="text-xs text-muted-foreground truncate">{activity.project}</p>
          </div>
          {activity.amount > 0 && (
            <div className="flex items-center gap-1 text-accent">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm font-semibold">{activity.amount}</span>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">{activity.time}</p>
      </div>
    </div>
  )
}
