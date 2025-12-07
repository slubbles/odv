"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { type LucideIcon, User, Wallet, Settings } from "lucide-react"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items?: {
    href: string
    title: string
    icon: LucideIcon | React.ComponentType<{ className?: string }>
  }[]
}

const defaultItems = [
  {
    title: "Profile Details",
    href: "/profile",
    icon: User,
  },
  {
    title: "Wallet Info",
    href: "/profile/wallet",
    icon: Wallet,
  },
  {
    title: "Account Settings",
    href: "/profile/account",
    icon: Settings,
  },
]

export function ProfileSidebar({ className, items = defaultItems, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 overflow-x-auto pb-2 lg:pb-0",
        className
      )}
      {...props}
    >
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors whitespace-nowrap",
              pathname === item.href
                ? "bg-accent text-accent-foreground"
                : "transparent",
              "justify-start"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
