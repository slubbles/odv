import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, FolderOpen, TrendingUp } from "lucide-react"

interface StatsOverviewProps {
    totalBacked: number
    totalInvested: number
    portfolioValue: number
}

export function StatsOverview({ totalBacked, totalInvested, portfolioValue }: StatsOverviewProps) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalBacked}</div>
                    <p className="text-xs text-muted-foreground">Projects backed</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalInvested.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Lifetime investment</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${portfolioValue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        {portfolioValue >= totalInvested ? "+" : ""}
                        {totalInvested > 0 ? ((portfolioValue - totalInvested) / totalInvested * 100).toFixed(1) : 0}% return
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
