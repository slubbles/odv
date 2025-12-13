"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Droplets, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check,
  ExternalLink,
  Wallet,
  Clock,
  Coins
} from "lucide-react"
import { toast } from "sonner"

import { SuccessModal } from "@/components/success-modal"

interface FaucetInfo {
  mint: string
  amountPerRequest: number
  cooldownHours: number
  network: string
  explorerUrl: string
}

export default function FaucetPage() {
  const { publicKey, connected } = useWallet()
  const { setVisible: openWalletModal } = useWalletModal()
  const [walletAddress, setWalletAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [lastTx, setLastTx] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [faucetInfo, setFaucetInfo] = useState<FaucetInfo | null>(null)
  const [cooldownRemaining, setCooldownRemaining] = useState<number | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Auto-fill wallet address when connected
  useEffect(() => {
    if (connected && publicKey) {
      setWalletAddress(publicKey.toString())
    }
  }, [connected, publicKey])

  // Fetch faucet info on mount
  useEffect(() => {
    fetch("/api/faucet")
      .then((res) => res.json())
      .then((data) => setFaucetInfo(data))
      .catch(console.error)
  }, [])

  // Countdown timer for cooldown
  useEffect(() => {
    if (cooldownRemaining && cooldownRemaining > 0) {
      const timer = setInterval(() => {
        setCooldownRemaining((prev) => {
          if (prev && prev > 1000) return prev - 1000
          return null
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [cooldownRemaining])

  const handleRequest = async () => {
    if (!walletAddress) {
      toast.error("Please enter a wallet address")
      return
    }

    // Basic validation
    if (walletAddress.length < 32 || walletAddress.length > 44) {
      toast.error("Invalid wallet address format")
      return
    }

    setLoading(true)
    setSuccess(false)

    try {
      const response = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          setCooldownRemaining(data.cooldownRemaining)
        }
        throw new Error(data.error || "Request failed")
      }

      setSuccess(true)
      setLastTx(data.signature)
      setShowSuccessModal(true)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to request tokens")
    } finally {
      setLoading(false)
    }
  }

  const copyMintAddress = () => {
    if (faucetInfo?.mint) {
      navigator.clipboard.writeText(faucetInfo.mint)
      setCopied(true)
      toast.success("Mint address copied!")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatCooldown = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
        <SuccessModal
          open={showSuccessModal}
          onOpenChange={setShowSuccessModal}
          title="Tokens Sent Successfully!"
          description="10 Test USDC has been sent to your wallet. You can now use these tokens to back projects."
          txSignature={lastTx || undefined}
          explorerUrl={lastTx ? `https://explorer.testnet.soo.network/tx/${lastTx}` : undefined}
          actionLabel="Check Wallet"
          onAction={() => window.location.href = "/wallet"}
        />
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-6">
            <Droplets className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Test USDC Faucet</h1>
          <p className="text-muted-foreground text-lg">
            Get free test tokens to try out the platform on SOON Testnet
          </p>
        </div>

        {/* Main Faucet Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-accent" />
              Request Test USDC
            </CardTitle>
            <CardDescription>
              Paste your wallet address or connect your wallet to receive{" "}
              {faucetInfo?.amountPerRequest || 100} test USDC
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Wallet Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Wallet Address</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your Solana wallet address..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="font-mono text-sm"
                />
                {connected && publicKey && (
                  <Button
                    variant="outline"
                    onClick={() => setWalletAddress(publicKey.toString())}
                    className="shrink-0"
                  >
                    <Wallet className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {!connected && (
                <p className="text-xs text-muted-foreground">
                  Connect your wallet to auto-fill your address
                </p>
              )}
            </div>

            {/* Request Button */}
            {!connected ? (
              <Button
                onClick={() => openWalletModal(true)}
                className="w-full"
                size="lg"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet to Get Tokens
              </Button>
            ) : (
              <Button
                onClick={handleRequest}
                disabled={loading || !walletAddress || !!cooldownRemaining}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending tokens...
                  </>
                ) : cooldownRemaining ? (
                  <>
                    <Clock className="w-4 h-4 mr-2" />
                    Wait {formatCooldown(cooldownRemaining)}
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Request More
                  </>
                ) : (
                  <>
                    <Droplets className="w-4 h-4 mr-2" />
                    Request {faucetInfo?.amountPerRequest || 100} Test USDC
                  </>
                )}
              </Button>
            )}

            {/* Success Message */}
            {success && lastTx && (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="flex items-center gap-2 text-green-400 mb-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Tokens sent successfully!</span>
                </div>
                <a
                  href={`https://explorer.testnet.soo.network/tx/${lastTx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-accent flex items-center gap-1"
                >
                  View transaction
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Token Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Token Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Network</span>
              <Badge variant="outline">SOON Testnet</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Token</span>
              <span className="font-medium">Test USDC</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Amount per request</span>
              <span className="font-medium">{faucetInfo?.amountPerRequest || 100} USDC</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Cooldown</span>
              <span className="font-medium">{faucetInfo?.cooldownHours || 4} hours</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">Mint Address</span>
                <Button variant="ghost" size="sm" onClick={copyMintAddress}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <code className="text-xs font-mono text-muted-foreground break-all block p-2 bg-muted/50 rounded">
                {faucetInfo?.mint || "Loading..."}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Add Token to Wallet Instructions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="w-5 h-5 text-accent" />
              Add Token to Your Wallet
            </CardTitle>
            <CardDescription>
              Follow these steps to see Test USDC in your wallet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Phantom Instructions */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center text-xs">👻</span>
                Phantom Wallet
              </h4>
              <ol className="space-y-2 text-sm text-muted-foreground ml-8">
                <li>1. Open Phantom and go to your token list</li>
                <li>2. Scroll down and click <strong className="text-foreground">&quot;Manage token list&quot;</strong></li>
                <li>3. Click the <strong className="text-foreground">&quot;+&quot;</strong> button or search icon</li>
                <li>4. Paste the mint address below and click <strong className="text-foreground">&quot;Add&quot;</strong></li>
              </ol>
            </div>

            {/* Solflare Instructions */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-orange-500/20 flex items-center justify-center text-xs">🔥</span>
                Solflare Wallet
              </h4>
              <ol className="space-y-2 text-sm text-muted-foreground ml-8">
                <li>1. Open Solflare and go to your portfolio</li>
                <li>2. Click <strong className="text-foreground">&quot;Add Token&quot;</strong> or the <strong className="text-foreground">&quot;+&quot;</strong> icon</li>
                <li>3. Select <strong className="text-foreground">&quot;Add manually&quot;</strong></li>
                <li>4. Paste the mint address below and confirm</li>
              </ol>
            </div>

            {/* Token Details to Copy */}
            <div className="p-4 rounded-lg bg-muted/50 space-y-3">
              <h4 className="font-semibold text-sm">Token Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Token Name:</span>
                  <span className="font-mono">Test USDC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Symbol:</span>
                  <span className="font-mono">USDC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Decimals:</span>
                  <span className="font-mono">6</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Network:</span>
                  <Badge variant="outline" className="text-xs">SOON Testnet</Badge>
                </div>
              </div>
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-muted-foreground text-sm">Mint Address (copy this):</span>
                  <Button variant="ghost" size="sm" onClick={copyMintAddress}>
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <code className="text-xs font-mono text-accent break-all block p-2 bg-background rounded border">
                  {faucetInfo?.mint || "3PNhmxDckddYL24zEfrsHLFLXXvrdzBBoZgfRW8rruDs"}
                </code>
              </div>
            </div>

            {/* Network Configuration Instructions */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-semibold text-sm">Configure Your Wallet for SOON Testnet</h4>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center text-xs">👻</span>
                    Phantom: Add Custom Network
                  </p>
                  <ol className="space-y-1 text-xs text-muted-foreground ml-8">
                    <li>1. Settings → Developer Settings → Enable</li>
                    <li>2. Settings → Network → Custom RPC</li>
                    <li>3. Enter: <code className="text-accent">https://rpc.testnet.soo.network/rpc</code></li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-orange-500/20 flex items-center justify-center text-xs">🔥</span>
                    Solflare: Add Custom Network
                  </p>
                  <ol className="space-y-1 text-xs text-muted-foreground ml-8">
                    <li>1. Settings → Network → Add Network</li>
                    <li>2. Name: <code className="text-foreground">SOON Testnet</code></li>
                    <li>3. RPC: <code className="text-accent">https://rpc.testnet.soo.network/rpc</code></li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Note about SOON Testnet */}
            <div className="flex gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Important:</strong> Make sure your wallet is connected to{" "}
                <strong className="text-foreground">SOON Testnet</strong> (not Solana Mainnet or Devnet). 
                The token will only appear when on the correct network.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold shrink-0">
                  1
                </span>
                <span>
                  <strong className="text-foreground">Enter your wallet</strong> — Paste your Solana
                  wallet address or connect your wallet
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold shrink-0">
                  2
                </span>
                <span>
                  <strong className="text-foreground">Request tokens</strong> — Click the button to
                  receive {faucetInfo?.amountPerRequest || 100} test USDC
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold shrink-0">
                  3
                </span>
                <span>
                  <strong className="text-foreground">Back a project</strong> — Use your test USDC to
                  back projects and test the platform
                </span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Info Banner */}
        <div className="mt-8 p-4 rounded-lg bg-accent/10 border border-accent/30">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">Testnet Tokens Only</p>
              <p className="text-muted-foreground">
                These are test tokens on SOON Testnet with no real value. They are for testing the
                platform before mainnet launch.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
