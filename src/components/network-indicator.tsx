"use client"

import { useConnection } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

const SOON_RPC_URL = 'https://rpc.testnet.soo.network/rpc'

type NetworkStatus = 'checking' | 'connected' | 'wrong-network' | 'error'

export function NetworkIndicator() {
  const { connection } = useConnection()
  const [status, setStatus] = useState<NetworkStatus>('checking')
  const [latency, setLatency] = useState<number | null>(null)

  useEffect(() => {
    const checkNetwork = async () => {
      setStatus('checking')
      try {
        // Get RPC endpoint from connection
        const endpoint = (connection as any)._rpcEndpoint || 
                        (connection as any).rpcEndpoint || 
                        (connection as any)._rpcWsEndpoint ||
                        ''
        
        // Log for debugging
        console.log('[NetworkIndicator] RPC Endpoint:', endpoint)
        
        // Check if connected to SOON Network
        const isSOON = endpoint.toLowerCase().includes('soo.network') || 
                       endpoint.toLowerCase().includes('soon')
        
        if (isSOON) {
          // Measure latency by making a simple RPC call
          const start = Date.now()
          try {
            await connection.getSlot()
            const end = Date.now()
            setLatency(end - start)
            setStatus('connected')
            console.log('[NetworkIndicator] Connected to SOON Testnet, latency:', end - start, 'ms')
          } catch (rpcError) {
            console.warn('[NetworkIndicator] RPC call failed:', rpcError)
            // Still consider connected if endpoint is SOON
            setStatus('connected')
            setLatency(null)
          }
        } else {
          console.warn('[NetworkIndicator] Not connected to SOON Network. Current endpoint:', endpoint)
          setStatus('wrong-network')
        }
      } catch (error) {
        console.error('[NetworkIndicator] Network check failed:', error)
        setStatus('error')
      }
    }

    checkNetwork()
    
    // Re-check every 30 seconds
    const interval = setInterval(checkNetwork, 30000)
    return () => clearInterval(interval)
  }, [connection])

  const getStatusConfig = () => {
    switch (status) {
      case 'checking':
        return {
          icon: <Loader2 className="h-3 w-3 animate-spin" />,
          text: 'Checking...',
          className: 'bg-muted text-muted-foreground',
          tooltip: 'Checking network connection...',
        }
      case 'connected':
        return {
          icon: <CheckCircle2 className="h-3 w-3" />,
          text: 'SOON Testnet',
          className: 'bg-green-500/20 text-green-400 border-green-500/30',
          tooltip: `Connected to SOON Testnet${latency ? ` (${latency}ms)` : ''}`,
        }
      case 'wrong-network':
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          text: 'Wrong Network',
          className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
          tooltip: 'Please switch to SOON Testnet',
        }
      case 'error':
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          text: 'Disconnected',
          className: 'bg-red-500/20 text-red-400 border-red-500/30',
          tooltip: 'Network connection error',
        }
    }
  }

  const config = getStatusConfig()

  return (
    <Badge 
      variant="outline" 
      className={`cursor-default flex items-center gap-1.5 text-xs ${config.className}`}
      title={config.tooltip}
    >
      {config.icon}
      <span className="hidden sm:inline">{config.text}</span>
    </Badge>
  )
}
