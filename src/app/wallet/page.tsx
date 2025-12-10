"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Wallet, ExternalLink, Copy, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { useConnection } from "@solana/wallet-adapter-react"
import { toast } from "sonner"

export default function WalletPage() {
  const { publicKey, connected, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const { connection } = useConnection()
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchBalance = async () => {
    if (!publicKey) return
    setLoading(true)
    try {
      const bal = await connection.getBalance(publicKey)
      setBalance(bal / 1e9)
    } catch (error) {
      console.error("Failed to fetch balance", error)
      toast.error("Failed to fetch balance")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance()
    }
  }, [connected, publicKey])

  if (!connected) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
          <Card className="max-w-md w-full text-center p-8">
            <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wallet className="h-8 w-8 text-accent" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Connect Wallet</h1>
            <p className="text-muted-foreground mb-6">
              Connect your Solana wallet to view your balance and manage your assets.
            </p>
            <Button onClick={() => setVisible(true)} className="w-full">
              Connect Wallet
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Wallet Overview</h1>
        
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">
              {balance !== null ? `${balance.toFixed(4)} SOL` : <Loader2 className="h-8 w-8 animate-spin" />}
            </div>
            <p className="text-xs text-muted-foreground">
              Available on SOON Testnet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium">Wallet Address</p>
                <p className="text-xs font-mono text-muted-foreground break-all">
                  {publicKey?.toString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(publicKey?.toString() || "")
                  toast.success("Address copied")
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => window.open(`https://explorer.testnet.soo.network/address/${publicKey?.toString()}`, '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View on Explorer
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={fetchBalance}
                disabled={loading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            <Button 
              variant="destructive" 
              className="w-full mt-4"
              onClick={disconnect}
            >
              Disconnect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
