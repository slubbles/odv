"use client"

import Link from "next/link"
import { ChevronDown } from "lucide-react"
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
import { WalletButton } from "@/components/wallet-button"

// Import wallet adapter styles
import "@solana/wallet-adapter-react-ui/styles.css"

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

            <Link href="/submit" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Submit Project
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ClientOnly>
            <NotificationBell />
          </ClientOnly>
          <ClientOnly>
            <div className="wallet-button-wrapper">
              <WalletButton />
            </div>
          </ClientOnly>
        </div>
      </div>
    </header>
  )
}
