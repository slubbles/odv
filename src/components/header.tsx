"use client"

import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { NotificationBell } from "@/components/notification-bell"
import { MobileNav } from "@/components/mobile-nav"
import { ClientOnly } from "@/components/client-only"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <ClientOnly>
            <MobileNav />
          </ClientOnly>

          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight">OneDollarVentures</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <ClientOnly>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-0 focus-visible:outline-none">
                  Explore <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link href="/discover">Discover</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/projects">Browse Projects</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/creators">Creators</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/stats">Platform Stats</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ClientOnly>

          <ClientOnly>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-0 focus-visible:outline-none">
                My Portfolio <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link href="/portfolio">Backed Projects</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/portfolio/activity">Activity History</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/portfolio/following">Following</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/backer">Backer Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/creator">Creator Dashboard</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ClientOnly>

            <Link href="/submit" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Submit Project
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ClientOnly>
            <NotificationBell />
          </ClientOnly>
          <Button className="hidden sm:flex bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-0">
            Connect Wallet
          </Button>
        </div>
      </div>
    </header>
  )
}
