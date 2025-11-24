"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardNav() {
    const pathname = usePathname()
    const { publicKey, connected } = useWallet()
    const [isCreator, setIsCreator] = useState(false)
    const [isBacker, setIsBacker] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function checkUserRole() {
            if (!connected || !publicKey) {
                setLoading(false)
                return
            }

            try {
                // Check if user has created any projects
                const { data: projects } = await supabase
                    .from('projects')
                    .select('id')
                    .eq('creator_wallet', publicKey.toBase58())
                    .limit(1)

                // Check if user has backed any projects
                const { data: backings } = await supabase
                    .from('backers')
                    .select('id')
                    .eq('wallet_address', publicKey.toBase58())
                    .limit(1)

                setIsCreator((projects && projects.length > 0) || false)
                setIsBacker((backings && backings.length > 0) || false)
            } catch (error) {
                console.error("Error checking user role:", error)
            } finally {
                setLoading(false)
            }
        }

        checkUserRole()
    }, [connected, publicKey])

    if (loading) {
        return <Skeleton className="h-10 w-48" />
    }

    // Navigation items based on role
    const navItems = []

    if (isCreator) {
        navItems.push({
            href: "/dashboard/creator",
            label: "My Projects",
        })
    }

    if (isBacker) {
        navItems.push({
            href: "/dashboard/backer",
            label: "Backed",
        })
    }

    // If neither, show default
    if (!isCreator && !isBacker) {
        navItems.push({
            href: "/dashboard",
            label: "Dashboard",
        })
    }

    return (
        <div className="flex items-center gap-4">
            <div className="flex gap-2 p-1 bg-muted rounded-lg">
                {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                        <Button
                            variant={pathname === item.href ? "secondary" : "ghost"}
                            size="sm"
                        >
                            {item.label}
                        </Button>
                    </Link>
                ))}
            </div>

            {/* Role Badge */}
            <div className="flex gap-2">
                {isCreator && (
                    <Badge variant="outline" className="text-xs">
                        Creator
                    </Badge>
                )}
                {isBacker && (
                    <Badge variant="outline" className="text-xs">
                        Backer
                    </Badge>
                )}
            </div>
        </div>
    )
}
