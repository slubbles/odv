"use client"

import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ExternalLink, RefreshCw, Loader2, Copy, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

const SOON_RPC_URL = 'https://rpc.testnet.soo.network/rpc'
const NETWORK_NAME = 'SOON Testnet'

interface NetworkGuardProps {
  children: React.ReactNode
}

// Detect which wallet is being used
function detectWalletType(): 'phantom' | 'okx' | 'solflare' | 'unknown' {
  if (typeof window === 'undefined') return 'unknown'
  
  const wallet = (window as any)
  if (wallet.okxwallet?.solana) return 'okx'
  if (wallet.phantom?.solana) return 'phantom'
  if (wallet.solflare) return 'solflare'
  return 'unknown'
}

// Check if we're connected to the right network
async function isConnectedToSOON(connection: any): Promise<boolean> {
  try {
    const endpoint = connection._rpcEndpoint || connection.rpcEndpoint || ''
    const isSOON = endpoint.toLowerCase().includes('soo.network') || endpoint.toLowerCase().includes('soon')
    console.log('[NetworkGuard] Checking connection:', endpoint, 'isSOON:', isSOON)
    return isSOON
  } catch {
    return false
  }
}

// Request Phantom to switch network (works with custom RPC)
async function switchToSOONNetwork(): Promise<boolean> {
  try {
    const phantom = (window as any).phantom?.solana
    
    if (!phantom) {
      toast.error("Phantom wallet not detected")
      return false
    }

    // For Phantom, we need to guide user to change network in settings
    // Phantom doesn't support programmatic network switching for custom RPCs
    // But we can show instructions
    
    toast.info("To switch to SOON Testnet:", {
      description: "Open Phantom → Settings → Developer Settings → Change Network to Custom RPC",
      duration: 8000,
    })
    
    return false
  } catch (error) {
    console.error("Failed to switch network:", error)
    return false
  }
}

export function NetworkGuard({ children }: NetworkGuardProps) {
  const { connection } = useConnection()
  const { connected, wallet, disconnect } = useWallet()
  const [networkMismatch, setNetworkMismatch] = useState(false)
  const [checking, setChecking] = useState(false)
  const [switching, setSwitching] = useState(false)

  const checkNetwork = useCallback(async () => {
    if (!connected) {
      setNetworkMismatch(false)
      return
    }

    setChecking(true)
    try {
      const isCorrect = await isConnectedToSOON(connection)
      
      if (!isCorrect && connected) {
        setNetworkMismatch(true)
        // Only show toast once
        toast.warning(`Please switch to ${NETWORK_NAME}`, {
          id: 'network-warning',
          description: "You're connected to a different network",
          duration: 5000,
        })
      } else {
        setNetworkMismatch(false)
      }
    } catch (error) {
      console.error('Network check failed:', error)
      setNetworkMismatch(false)
    } finally {
      setChecking(false)
    }
  }, [connected, connection])

  useEffect(() => {
    checkNetwork()
  }, [checkNetwork])

  const handleSwitchNetwork = async () => {
    setSwitching(true)
    try {
      await switchToSOONNetwork()
    } finally {
      setSwitching(false)
    }
  }

  const handleCopyRPC = () => {
    navigator.clipboard.writeText(SOON_RPC_URL)
    toast.success("RPC URL copied to clipboard!", {
      description: SOON_RPC_URL,
    })
  }

  const handleDisconnectAndReconnect = async () => {
    setSwitching(true)
    try {
      await disconnect()
      toast.info("Wallet disconnected. Please change network in Phantom and reconnect.", {
        duration: 5000,
      })
      setNetworkMismatch(false)
    } finally {
      setSwitching(false)
    }
  }

  if (networkMismatch && connected) {
    const walletType = detectWalletType()
    
    return (
      <>
        {children}
        {/* Network warning banner - floating */}
        <div className="fixed bottom-4 right-4 z-50 max-w-md">
          <Card className="border-yellow-500/50 bg-background/95 backdrop-blur shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <CardTitle className="text-sm">Switch to SOON Network</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-sm">
                Please switch your wallet to <strong className="text-foreground">{NETWORK_NAME}</strong> to use this dApp.
              </CardDescription>
              
              {/* OKX-specific instructions */}
              {walletType === 'okx' && (
                <div className="p-3 rounded-lg bg-muted/50 text-xs space-y-2">
                  <p className="font-medium text-primary">For OKX Wallet:</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Click the network dropdown in OKX</li>
                    <li>Search for <strong>"SOON"</strong></li>
                    <li>Select <strong>"SOON Testnet"</strong></li>
                    <li>Then reconnect to this dApp</li>
                  </ol>
                </div>
              )}
              
              {/* Phantom-specific instructions */}
              {walletType === 'phantom' && (
                <div className="p-3 rounded-lg bg-muted/50 text-xs space-y-2">
                  <p className="font-medium text-primary">For Phantom:</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Open Phantom → Settings (⚙️)</li>
                    <li>Go to "Developer Settings"</li>
                    <li>Enable "Testnet Mode"</li>
                    <li>Add Custom RPC with this URL:</li>
                  </ol>
                  <div className="flex items-center gap-2 mt-2">
                    <code className="flex-1 px-2 py-1 bg-background rounded text-xs font-mono truncate">
                      {SOON_RPC_URL}
                    </code>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-7 text-xs px-2"
                      onClick={handleCopyRPC}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Generic instructions */}
              {walletType === 'unknown' && (
                <div className="p-3 rounded-lg bg-muted/50 text-xs space-y-2">
                  <p className="font-medium">Setup SOON Testnet RPC:</p>
                  <div className="flex items-center gap-2 mt-2">
                    <code className="flex-1 px-2 py-1 bg-background rounded text-xs font-mono truncate">
                      {SOON_RPC_URL}
                    </code>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-7 text-xs px-2"
                      onClick={handleCopyRPC}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => setNetworkMismatch(false)}
                >
                  Dismiss
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={handleDisconnectAndReconnect}
                  disabled={switching}
                >
                  {switching ? (
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3 w-3 mr-1" />
                  )}
                  Reconnect
                </Button>
                <Button
                  size="sm"
                  className="text-xs"
                  onClick={() => window.open('https://faucet.testnet.soo.network/', '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Get Test SOL
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  return <>{children}</>
}
