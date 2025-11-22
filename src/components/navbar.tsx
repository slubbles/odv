"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import { useState } from "react"

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/submit", label: "Submit Project" },
    { href: "/queue", label: "Queue" },
    { href: "/dashboard", label: "Dashboard" },
]

export function Navbar() {
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        OneDollarVentures
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex md:items-center md:gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === link.href
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Wallet Button */}
                <div className="hidden md:block">
                    <WalletMultiButton />
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t">
                    <div className="container py-4 space-y-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    "block py-2 text-sm font-medium transition-colors",
                                    pathname === link.href
                                        ? "text-foreground"
                                        : "text-muted-foreground hover:text-primary"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-2">
                            <WalletMultiButton />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
