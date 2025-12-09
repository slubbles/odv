"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FolderOpen,
  Target,
  DollarSign,
  MessageSquare,
  BarChart3,
  Users,
  Clock,
  CheckCircle2,
  Shield,
  Settings,
} from "lucide-react"

interface SidebarItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface DashboardSidebarProps {
  type: "creator" | "backer" | "admin"
}

const creatorItems: SidebarItem[] = [
  { label: "Overview", href: "/dashboard/creator", icon: LayoutDashboard },
  { label: "My Projects", href: "/dashboard/creator", icon: FolderOpen },
  { label: "Milestones", href: "/dashboard/creator/milestones", icon: Target },
  { label: "Earnings", href: "/dashboard/creator/earnings", icon: DollarSign },
  { label: "Messages", href: "/dashboard/creator/messages", icon: MessageSquare },
  { label: "Analytics", href: "/dashboard/creator/analytics", icon: BarChart3 },
]

const backerItems: SidebarItem[] = [
  { label: "Overview", href: "/dashboard/backer", icon: LayoutDashboard },
  { label: "Backed Projects", href: "/dashboard/backer", icon: FolderOpen },
  { label: "Milestones", href: "/portfolio", icon: Target },
  { label: "Following", href: "/portfolio/following", icon: Users },
  { label: "Activity", href: "/portfolio/activity", icon: Clock },
]

const adminItems: SidebarItem[] = [
  { label: "Queue Review", href: "/admin", icon: Shield },
  { label: "Milestones", href: "/admin/milestones", icon: CheckCircle2 },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Activity Log", href: "/admin/activity", icon: Clock },
]

export function DashboardSidebar({ type }: DashboardSidebarProps) {
  const pathname = usePathname()

  const items =
    type === "creator"
      ? creatorItems
      : type === "backer"
        ? backerItems
        : adminItems

  const title =
    type === "creator"
      ? "Creator Dashboard"
      : type === "backer"
        ? "Backer Dashboard"
        : "Admin Panel"

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card/50 min-h-[calc(100vh-64px)]">
      <div className="p-6 border-b border-border">
        <h2 className="font-semibold text-lg">{title}</h2>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-border">
        <Link
          href="/profile/account"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </aside>
  )
}
