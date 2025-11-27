"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, PlusCircle, Wallet, User } from "lucide-react"

export function BottomNav() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors ${
            isActive("/") ? "text-accent" : "text-muted-foreground"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </Link>

        <Link
          href="/discover"
          className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors ${
            isActive("/discover") ? "text-accent" : "text-muted-foreground"
          }`}
        >
          <Search className="h-5 w-5" />
          <span className="text-xs">Discover</span>
        </Link>

        <Link
          href="/submit"
          className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-full bg-accent text-accent-foreground -mt-8 shadow-lg"
        >
          <PlusCircle className="h-6 w-6" />
          <span className="text-xs font-semibold">Submit</span>
        </Link>

        <Link
          href="/wallet"
          className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors ${
            isActive("/wallet") ? "text-accent" : "text-muted-foreground"
          }`}
        >
          <Wallet className="h-5 w-5" />
          <span className="text-xs">Wallet</span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors ${
            isActive("/profile") ? "text-accent" : "text-muted-foreground"
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </nav>
  )
}
