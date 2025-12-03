"use client"

import { useState, useEffect } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Award, Loader2, AlertCircle, ExternalLink, Copy, Check } from "lucide-react"
import { toast } from "sonner"

interface Transaction {
  id: string
  project_id: string
  project_title: string
  amount: number
  transaction_signature: string
  created_at: string
}

interface NFTBadge {
  id: string
  project_id: string
  project_title: string
  tier: string
  earned_at: string
}

export default function WalletPage() {
  const { publicKey, connected } = useWallet()
  const { connection } = useConnection()
  const [solBalance, setSolBalance] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [badges, setBadges] = useState<NFTBadge[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!connected || !publicKey) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch SOL balance
        const balance = await connection.getBalance(publicKey)
        setSolBalance(balance / LAMPORTS_PER_SOL)

        // Fetch backing history (transactions)
        const txResponse = await fetch(`/api/wallet/transactions?wallet=${publicKey.toString()}`)
        if (txResponse.ok) {
          const txData = await txResponse.json()
          setTransactions(txData.transactions || [])
        }

        // For now, badges are derived from transactions
        // In future, this would fetch actual NFT metadata
        const badgesFromTx = transactions.map((tx) => ({
          id: tx.id,
          project_id: tx.project_id,
          project_title: tx.project_title,
          tier: tx.amount >= 25 ? "Gold" : tx.amount >= 10 ? "Silver" : "Bronze",
          earned_at: tx.created_at,
        }))
        setBadges(badgesFromTx)
      } catch (error) {
        console.error("Failed to fetch wallet data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [connected, publicKey, connection])

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString())
      setCopied(true)
      toast.success("Address copied!")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const totalBacked = transactions.reduce((sum, tx) => sum + tx.amount, 0)
  const projectsBacked = new Set(transactions.map((tx) => tx.project_id)).size

  if (!connected) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
          <Card className="border-yellow-500/30 bg-yellow-500/10">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Wallet Not Connected</h2>
              <p className="text-muted-foreground">Please connect your wallet to view your balance and transactions.</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-accent" />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-6xl pb-24 md:pb-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Wallet</h1>
          <p className="text-lg text-muted-foreground">Your balance and backing history</p>
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
                <p className="text-sm text-muted-foreground mb-2">SOL Balance</p>
                <p className="text-4xl font-bold mb-4">{solBalance?.toFixed(4) || "0"} SOL</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                    {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-6)}
                  </code>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={copyAddress}>
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Total Backed</p>
                <p className="text-2xl font-bold text-accent">${totalBacked.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">{transactions.length} transactions</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Projects Supported</p>
                <p className="text-2xl font-bold">{projectsBacked}</p>
                <p className="text-xs text-muted-foreground mt-1">unique projects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="transactions" className="w-full">
          <TabsList>
            <TabsTrigger value="transactions">Transactions ({transactions.length})</TabsTrigger>
            <TabsTrigger value="nfts">Badges ({badges.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Backing History</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No transactions yet</p>
                    <p className="text-sm mt-2">Back your first project to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-accent/50 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full flex items-center justify-center bg-accent/20">
                            <TrendingDown className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="font-semibold">Backed: {transaction.project_title}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(transaction.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-4">
                          <div>
                            <p className="font-bold text-lg text-accent">${transaction.amount}</p>
                            <Badge variant="secondary" className="text-xs">
                              completed
                            </Badge>
                          </div>
                          {transaction.transaction_signature && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() =>
                                window.open(
                                  `https://explorer.testnet.soo.network/tx/${transaction.transaction_signature}`,
                                  "_blank"
                                )
                              }
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nfts" className="mt-6">
            {badges.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No badges earned yet</p>
                  <p className="text-sm mt-2">Back projects to earn supporter badges!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {badges.map((badge) => (
                  <Card key={badge.id} className="overflow-hidden hover:border-accent/50 transition-all">
                    <div className="aspect-square bg-muted flex items-center justify-center">
                      <Award
                        className={`h-24 w-24 ${
                          badge.tier === "Gold"
                            ? "text-yellow-500"
                            : badge.tier === "Silver"
                              ? "text-gray-400"
                              : "text-amber-700"
                        }`}
                      />
                    </div>
                    <CardContent className="p-6">
                      <Badge
                        className={`mb-3 ${
                          badge.tier === "Gold"
                            ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                            : badge.tier === "Silver"
                              ? "bg-gray-400/20 text-gray-400 border-gray-400/30"
                              : "bg-amber-700/20 text-amber-700 border-amber-700/30"
                        }`}
                      >
                        {badge.tier} Supporter
                      </Badge>
                      <h3 className="text-lg font-bold mb-2">{badge.tier} Backer Badge</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{badge.project_title}</p>
                      <p className="text-xs text-muted-foreground">
                        Earned: {new Date(badge.earned_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
