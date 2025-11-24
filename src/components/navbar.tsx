"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ClientOnlyWalletButton } from "@/components/wallet/client-only-wallet-button"
import { cn } from "@/lib/utils"
import { Menu, X, Compass, List, PlusCircle } from "lucide-react"
import { useState } from "react"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const navLinks = [
    { href: "/", label: "Home" },
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
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <Link href="/" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Home
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                        <li className="row-span-3">
                                            <NavigationMenuLink asChild>
                                                <a
                                                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                                    href="/discover"
                                                >
                                                    <Compass className="h-6 w-6" />
                                                    <div className="mb-2 mt-4 text-lg font-medium">
                                                        Discover Projects
                                                    </div>
                                                    <p className="text-sm leading-tight text-muted-foreground">
                                                        Find the next big thing. Browse projects by category, popularity, and more.
                                                    </p>
                                                </a>
                                            </NavigationMenuLink>
                                        </li>
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href="/queue"
                                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                >
                                                    <div className="flex items-center gap-2 text-sm font-medium leading-none">
                                                        <List className="h-4 w-4" />
                                                        Queue
                                                    </div>
                                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                        See what&apos;s coming up next.
                                                    </p>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href="/submit"
                                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                >
                                                    <div className="flex items-center gap-2 text-sm font-medium leading-none">
                                                        <PlusCircle className="h-4 w-4" />
                                                        Submit Project
                                                    </div>
                                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                        Launch your own idea for $1.
                                                    </p>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <Link href="/dashboard" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Dashboard
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Wallet Button */}
                <div className="hidden md:block">
                    <ClientOnlyWalletButton />
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
                        <Link
                            href="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                                "block py-2 text-sm font-medium transition-colors",
                                pathname === "/" ? "text-foreground" : "text-muted-foreground hover:text-primary"
                            )}
                        >
                            Home
                        </Link>
                        <Link
                            href="/discover"
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                                "block py-2 text-sm font-medium transition-colors",
                                pathname === "/discover" ? "text-foreground" : "text-muted-foreground hover:text-primary"
                            )}
                        >
                            Discover
                        </Link>
                        <Link
                            href="/queue"
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                                "block py-2 text-sm font-medium transition-colors",
                                pathname === "/queue" ? "text-foreground" : "text-muted-foreground hover:text-primary"
                            )}
                        >
                            Queue
                        </Link>
                        <Link
                            href="/submit"
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                                "block py-2 text-sm font-medium transition-colors",
                                pathname === "/submit" ? "text-foreground" : "text-muted-foreground hover:text-primary"
                            )}
                        >
                            Submit Project
                        </Link>
                        <Link
                            href="/dashboard"
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                                "block py-2 text-sm font-medium transition-colors",
                                pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground hover:text-primary"
                            )}
                        >
                            Dashboard
                        </Link>
                        <div className="pt-2">
                            <ClientOnlyWalletButton />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
