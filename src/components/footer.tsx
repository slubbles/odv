import Link from "next/link"
import { Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border py-12" role="contentinfo">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent" aria-hidden="true">
                <Shield className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="text-lg font-semibold">OneDollarVentures</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your $1 might fund the next big thing. Or at least something really cool.
            </p>
          </div>
          <nav aria-label="Platform links">
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/discover" className="hover:text-foreground transition-colors">
                  Discover
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-foreground transition-colors">
                  Browse
                </Link>
              </li>
              <li>
                <Link href="/creators" className="hover:text-foreground transition-colors">
                  Creators
                </Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Resource links">
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/how-it-works" className="hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-foreground transition-colors">
                  Help
                </Link>
              </li>
              <li>
                <Link href="/community-guidelines" className="hover:text-foreground transition-colors">
                  Guidelines
                </Link>
              </li>
              <li>
                <Link href="/stats" className="hover:text-foreground transition-colors">
                  Stats
                </Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Company links">
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; 2025 OneDollarVentures. Built for builders who ship.</p>
        </div>
      </div>
    </footer>
  )
}
