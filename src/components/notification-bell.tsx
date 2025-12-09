"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: "project" | "milestone" | "system"
}

export function NotificationBell() {
  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Milestone Reached",
      message: "AI Recipe App reached 75% funding!",
      time: "2 hours ago",
      read: false,
      type: "project",
    },
    {
      id: "2",
      title: "Vote Required",
      message: "Milestone #2 voting is now open",
      time: "5 hours ago",
      read: false,
      type: "milestone",
    },
    {
      id: "3",
      title: "Project Update",
      message: "Sustainable Fashion posted a new update",
      time: "1 day ago",
      read: true,
      type: "project",
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground border-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 cursor-pointer">
              <div className="flex items-start justify-between w-full mb-1">
                <span className="font-semibold text-sm">{notification.title}</span>
                {!notification.read && <div className="h-2 w-2 rounded-full bg-accent mt-1" />}
              </div>
              <p className="text-xs text-muted-foreground mb-1">{notification.message}</p>
              <span className="text-xs text-muted-foreground">{notification.time}</span>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/notifications" className="w-full text-center text-sm text-accent">
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
