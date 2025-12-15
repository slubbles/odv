"use client"

import Link from "next/link"
import Image from "next/image"
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
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          {/* Mobile: Show favicon logo */}
          <Link href="/" className="md:hidden flex items-center">
            <Image 
              src="/odv logo - favicon 512x512.svg" 
              alt="OneDollarVentures" 
              width={36} 
              height={36} 
              className="h-9 w-9 object-contain"
              priority
            />
          </Link>
          {/* Desktop: Show full logo */}
          <Link href="/" className="hidden md:flex items-center gap-2">
            <Image 
              src="/logo.svg" 
              alt="OneDollarVentures" 
              width={180} 
              height={50} 
              className="h-14 w-auto object-contain"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-0 focus-visible:outline-none">
                Fund Projects <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[240px] p-2">
                <DropdownMenuItem asChild className="p-2 cursor-pointer">
                  <Link href="/discover" className="flex flex-col items-start gap-1">
                    <div className="font-medium leading-none">Discover Projects</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      Browse all active campaigns
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="p-2 cursor-pointer">
                  <Link href="/portfolio" className="flex flex-col items-start gap-1">
                    <div className="font-medium leading-none">Your Portfolio</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      View projects you've backed
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-0 focus-visible:outline-none">
                Explore <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[240px] p-2">
                <DropdownMenuItem asChild className="p-2 cursor-pointer">
                  <Link href="/faucet" className="flex flex-col items-start gap-1">
                    <div className="font-medium leading-none">Test USDC Faucet</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      Get test tokens for development
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-0 focus-visible:outline-none">
                Launch a Project <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[240px] p-2">
                <DropdownMenuItem asChild className="p-2 cursor-pointer">
                  <Link href="/dashboard/creator" className="flex flex-col items-start gap-1">
                    <div className="font-medium leading-none">Your Projects</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      Manage your campaigns
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="p-2 cursor-pointer">
                  <Link href="/submit" className="flex flex-col items-start gap-1">
                    <div className="font-medium leading-none">Start a Project</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      Launch a new campaign
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Admin Menu - Only visible to admin wallet */}
            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors focus-visible:ring-0 focus-visible:outline-none">
                  <Shield className="h-4 w-4" />
                  Admin <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[240px] p-2">
                  <DropdownMenuItem asChild className="p-2 cursor-pointer">
                    <Link href="/admin" className="flex flex-col items-start gap-1">
                      <div className="font-medium leading-none">Admin Dashboard</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        All admin controls in one place
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Wallet button visible on mobile (optimized to avatar only) */}
          <ClientOnly>
            <div className="wallet-button-wrapper block">
              <WalletButton />
            </div>
          </ClientOnly>
          <ClientOnly>
            <MobileNav />
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
