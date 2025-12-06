import Link from "next/link"
import { Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border py-16" role="contentinfo">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent" aria-hidden="true">
                <Shield className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="text-lg font-semibold">OneDollarVentures</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your $1 might fund the next big thing. Or at least something really cool.
            </p>
          </div>
          <nav aria-label="Platform links">
            <h4 className="font-semibold mb-4 text-sm">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/discover" className="text-muted-foreground hover:text-accent transition-colors duration-300">
                  Discover
                </Link>
              </li>
              <li>
                <Link href="/creators" className="text-muted-foreground hover:text-accent transition-colors duration-300">
                  Creators
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-muted-foreground hover:text-accent transition-colors duration-300">
                  Submit Project
                </Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Resource links">
            <h4 className="font-semibold mb-4 text-sm">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/how-it-works" className="text-muted-foreground hover:text-accent transition-colors duration-300">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-accent transition-colors duration-300">
                  Help
                </Link>
              </li>
              <li>
                <Link href="/community-guidelines" className="text-muted-foreground hover:text-accent transition-colors duration-300">
                  Guidelines
                </Link>
              </li>
              <li>
                <Link href="/stats" className="text-muted-foreground hover:text-accent transition-colors duration-300">
                  Stats
                </Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Company links">
            <h4 className="font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-accent transition-colors duration-300">
                  About
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-accent transition-colors duration-300">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-accent transition-colors duration-300">
                  Privacy
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">&copy; 2025 OneDollarVentures. Built for builders who ship.</p>
        </div>
      </div>
    </footer>
  )
}
