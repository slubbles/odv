"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, PieChart } from "lucide-react"
import { cn } from "@/lib/utils"

export function DashboardNav() {
    const pathname = usePathname()

    return (
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-4 gap-2">
            <Link href="/dashboard">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start gap-2",
                        pathname === "/dashboard" && "bg-muted"
                    )}
                >
                    <PieChart className="h-4 w-4" />
                    My Portfolio
                </Button>
            </Link>
            <Link href="/dashboard/creator">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start gap-2",
                        pathname === "/dashboard/creator" && "bg-muted"
                    )}
                >
                    <LayoutDashboard className="h-4 w-4" />
                    My Projects
                </Button>
            </Link>
        </nav>
    )
}
