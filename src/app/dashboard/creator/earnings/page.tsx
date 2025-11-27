import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Wallet, ArrowUpRight, Download } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function CreatorEarningsPage() {
  const transactions = [
    { id: 1, date: "2024-01-28", project: "AI Recipe App", amount: 450, backers: 34, status: "completed" },
    { id: 2, date: "2024-01-25", project: "Pixel Art Game", amount: 320, backers: 28, status: "completed" },
    { id: 3, date: "2024-01-22", project: "AI Recipe App", amount: 180, backers: 15, status: "completed" },
    { id: 4, date: "2024-01-20", project: "Sustainable Fashion", amount: 290, backers: 22, status: "pending" },
    { id: 5, date: "2024-01-18", project: "Pixel Art Game", amount: 510, backers: 41, status: "completed" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-sans text-4xl font-semibold mb-2 text-balance">Your Money</h1>
            <p className="text-muted-foreground text-lg">You earned it. Now cash out.</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90">
            <Wallet className="h-4 w-4 mr-2" />
            Request Payout
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Ready to Withdraw</p>
              <DollarSign className="h-4 w-4 text-accent" />
            </div>
            <p className="text-3xl font-semibold">$8,450.00</p>
            <p className="text-xs text-muted-foreground mt-1">It's yours</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">All Time</p>
              <TrendingUp className="h-4 w-4 text-accent" />
            </div>
            <p className="text-3xl font-semibold">$24,567.00</p>
            <p className="text-xs text-green-400 mt-1">+15.3% this month</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">In Transit</p>
              <ArrowUpRight className="h-4 w-4 text-yellow-500" />
            </div>
            <p className="text-3xl font-semibold">$290.00</p>
            <p className="text-xs text-muted-foreground mt-1">Processing</p>
          </Card>
        </div>

        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-sans text-2xl font-semibold">Transaction History</h2>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">{tx.project}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(tx.date).toLocaleDateString()} • {tx.backers} backers
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    className={
                      tx.status === "completed"
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    }
                  >
                    {tx.status}
                  </Badge>
                  <p className="text-xl font-semibold text-accent">${tx.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-sans text-2xl font-semibold mb-4">Payout Methods</h2>
          <div className="space-y-3">
            <div className="p-4 border border-border rounded-lg hover:border-accent/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold mb-1">Bank Account</p>
                  <p className="text-sm text-muted-foreground">••••••••1234</p>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Primary</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              Add Payout Method
            </Button>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
