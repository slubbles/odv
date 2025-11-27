import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Download, Plus, Award } from "lucide-react"

const transactions = [
  {
    id: 1,
    type: "backed",
    description: "Backed: AI-Powered Recipe Discovery",
    amount: -25,
    date: "2025-01-15",
    status: "completed",
  },
  {
    id: 2,
    type: "backed",
    description: "Backed: Sustainable Fashion Marketplace",
    amount: -10,
    date: "2025-01-14",
    status: "completed",
  },
  {
    id: 3,
    type: "deposit",
    description: "Wallet Top-up",
    amount: 100,
    date: "2025-01-12",
    status: "completed",
  },
  {
    id: 4,
    type: "backed",
    description: "Backed: Indie Game Studio: Pixel Quest",
    amount: -50,
    date: "2025-01-10",
    status: "completed",
  },
  {
    id: 5,
    type: "withdraw",
    description: "Withdrawal to Bank",
    amount: -200,
    date: "2025-01-08",
    status: "completed",
  },
  {
    id: 6,
    type: "backed",
    description: "Backed: Mental Health Journaling App",
    amount: -15,
    date: "2025-01-05",
    status: "completed",
  },
  {
    id: 7,
    type: "deposit",
    description: "Wallet Top-up",
    amount: 250,
    date: "2025-01-01",
    status: "completed",
  },
]

const nftCollection = [
  {
    id: 1,
    name: "Gold Founder Badge",
    project: "AI-Powered Recipe Discovery",
    image: "/placeholder.svg?key=nft1",
    tier: "Gold Supporter",
    earnedDate: "2025-01-15",
  },
  {
    id: 2,
    name: "Gold Supporter Badge",
    project: "Indie Game Studio",
    image: "/placeholder.svg?key=nft2",
    tier: "Gold Supporter",
    earnedDate: "2025-01-10",
  },
  {
    id: 3,
    name: "Silver Supporter Badge",
    project: "Mental Health App",
    image: "/placeholder.svg?key=nft3",
    tier: "Silver Supporter",
    earnedDate: "2025-01-05",
  },
  {
    id: 4,
    name: "Silver Supporter Badge",
    project: "Sustainable Fashion",
    image: "/placeholder.svg?key=nft4",
    tier: "Silver Supporter",
    earnedDate: "2025-01-14",
  },
  {
    id: 5,
    name: "Bronze Supporter Badge",
    project: "Community Coffee Roastery",
    image: "/placeholder.svg?key=nft5",
    tier: "Bronze Supporter",
    earnedDate: "2024-12-28",
  },
  {
    id: 6,
    name: "Early Backer Badge",
    project: "Urban Vertical Garden",
    image: "/placeholder.svg?key=nft6",
    tier: "Early Backer",
    earnedDate: "2024-12-20",
  },
]

export default function WalletPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Wallet</h1>
          <p className="text-lg text-muted-foreground">Your earnings and NFT collection</p>
        </div>

        {/* Balance Card */}
        <Card className="mb-8 overflow-hidden relative">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: "linear-gradient(135deg, oklch(0.57 0.23 265) 0%, oklch(0.6 0.15 190) 100%)",
            }}
          />
          <CardContent className="relative p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Balance</p>
                <p className="text-4xl font-bold mb-4">$345.50</p>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Plus className="h-4 w-4 mr-1" />
                    Add funds
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Withdraw
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Available</p>
                <p className="text-2xl font-bold text-accent">$245.50</p>
                <p className="text-xs text-muted-foreground mt-1">Ready to back</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Locked</p>
                <p className="text-2xl font-bold">$100.00</p>
                <p className="text-xs text-muted-foreground mt-1">In active projects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="transactions" className="w-full">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="nfts">NFTs ({nftCollection.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-accent/50 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            transaction.type === "backed"
                              ? "bg-destructive/20"
                              : transaction.type === "deposit"
                                ? "bg-accent/20"
                                : "bg-muted"
                          }`}
                        >
                          {transaction.amount < 0 ? (
                            <TrendingDown
                              className={`h-5 w-5 ${
                                transaction.type === "backed" ? "text-destructive" : "text-muted-foreground"
                              }`}
                            />
                          ) : (
                            <TrendingUp className="h-5 w-5 text-accent" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold text-lg ${transaction.amount < 0 ? "text-destructive" : "text-accent"}`}
                        >
                          {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount)}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Button variant="outline">Show more</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nfts" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nftCollection.map((nft) => (
                <Card key={nft.id} className="overflow-hidden hover:border-accent/50 transition-all">
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <Award className="h-24 w-24 text-accent" />
                  </div>
                  <CardContent className="p-6">
                    <Badge className="mb-3 bg-accent/20 text-accent-foreground border-accent/30">{nft.tier}</Badge>
                    <h3 className="text-lg font-bold mb-2">{nft.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{nft.project}</p>
                    <p className="text-xs text-muted-foreground">Earned: {nft.earnedDate}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
