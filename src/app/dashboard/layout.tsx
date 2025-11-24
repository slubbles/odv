import type { Metadata } from 'next'
import Link from "next/link"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Manage your projects and contributions',
    robots: {
        index: false, // Dashboard shouldn't be indexed
        follow: false,
    },
}


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen w-full flex-col md:flex-row">
            <aside className="w-full md:w-64 border-r bg-muted/40">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <span className="">OneDollarVentures</span>
                    </Link>
                </div>
                <DashboardNav />
            </aside>
            <main className="flex-1 p-4 md:p-6 lg:p-8">
                {children}
            </main>
        </div>
    )
}
