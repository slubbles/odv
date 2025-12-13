import Link from "next/link"
import Image from "next/image"
import { Shield, Twitter, Github, Disc } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 py-16" role="contentinfo">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Image 
                src="/logo.svg" 
                alt="OneDollarVentures" 
                width={180} 
                height={50} 
                className="h-14 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              The anti-VC platform. Your $1 might fund the next unicorn. Or at least a really cool sandwich shop.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="hover:text-accent hover:bg-accent/10">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-accent hover:bg-accent/10">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-accent hover:bg-accent/10">
                <Disc className="h-5 w-5" />
                <span className="sr-only">Discord</span>
              </Button>
            </div>
          </div>
          
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <nav aria-label="Platform links">
              <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-foreground/80">Platform</h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <Link href="/discover" className="text-muted-foreground hover:text-accent transition-colors duration-200">
                    Discover Projects
                  </Link>
                </li>
                <li>
                  <Link href="/creators" className="text-muted-foreground hover:text-accent transition-colors duration-200">
                    Meet Creators
                  </Link>
                </li>
                <li>
                  <Link href="/submit" className="text-muted-foreground hover:text-accent transition-colors duration-200">
                    Start Building
                  </Link>
                </li>
                <li>
                  <Link href="/faucet" className="text-muted-foreground hover:text-accent transition-colors duration-200">
                    Testnet Faucet
                  </Link>
                </li>
              </ul>
            </nav>
            <nav aria-label="Resource links">
              <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-foreground/80">Resources</h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <Link href="/how-it-works" className="text-muted-foreground hover:text-accent transition-colors duration-200">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-muted-foreground hover:text-accent transition-colors duration-200">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/community-guidelines" className="text-muted-foreground hover:text-accent transition-colors duration-200">
                    Guidelines
                  </Link>
                </li>
              </ul>
            </nav>
            <nav aria-label="Company links">
              <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-foreground/80">Legal</h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-accent transition-colors duration-200">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-accent transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-accent transition-colors duration-200">
                    About Us
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 OneDollarVentures. Built on SOON Network.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            Operational
          </div>
        </div>
      </div>
    </footer>
  )
}
