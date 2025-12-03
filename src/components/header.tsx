"use client"

import Link from "next/link"
import { ChevronDown, Shield } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
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

// Admin wallet address (upgrade authority)
const ADMIN_WALLET = "4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw"

function HeaderContent() {
  const { publicKey, connected } = useWallet()
  const isAdmin = connected && publicKey?.toString() === ADMIN_WALLET

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
              <DropdownMenuContent align="start" className="py-2">
                <DropdownMenuItem asChild className="py-2 px-3">
                  <Link href="/discover">Discover Projects</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="py-2 px-3">
                  <Link href="/creators">Creators</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="py-2 px-3">
                  <Link href="/stats">Platform Stats</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-0 focus-visible:outline-none">
                My Portfolio <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="py-2">
                <DropdownMenuItem asChild className="py-2 px-3">
                  <Link href="/portfolio">Backed Projects</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="py-2 px-3">
                  <Link href="/dashboard/backer">Backer Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="py-2 px-3">
                  <Link href="/dashboard/creator">Creator Dashboard</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/submit" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Submit Project
            </Link>

            {/* Admin Menu - Only visible to admin wallet */}
            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors focus-visible:ring-0 focus-visible:outline-none">
                  <Shield className="h-4 w-4" />
                  Admin <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="py-2">
                  <DropdownMenuItem asChild className="py-2 px-3">
                    <Link href="/admin">Queue Review</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-2 px-3">
                    <Link href="/admin/milestones">Milestones</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="py-2 px-3">
                    <Link href="/admin/analytics">Analytics</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-2 px-3">
                    <Link href="/admin/users">Users</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-2 px-3">
                    <Link href="/admin/initialize">Initialize Platform</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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

export function Header() {
  return (
    <ClientOnly>
      <HeaderContent />
    </ClientOnly>
  )
}
