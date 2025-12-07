"use client"

import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { 
  Wallet, 
  LogOut, 
  Copy, 
  ExternalLink, 
  ChevronDown,
  Loader2,
  User,
  LayoutDashboard,
  Heart,
  HelpCircle,
  CheckCircle2
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// SOON Testnet config
const SOON_EXPLORER = 'https://explorer.testnet.soo.network'

function truncateAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function WalletButton() {
  const { publicKey, wallet, disconnect, connecting, connected } = useWallet()
  const { connection } = useConnection()
  const { setVisible } = useWalletModal()
  const [balance, setBalance] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  // Fetch SOL balance
  useEffect(() => {
    if (!publicKey || !connection) {
      // Only reset if we actually have a balance to clear, to avoid redundant updates
      const timer = setTimeout(() => {
        setBalance((prev) => (prev !== null ? null : prev))
      }, 0)
      return () => clearTimeout(timer)
    }

    const fetchBalance = async () => {
      try {
        const bal = await connection.getBalance(publicKey)
        setBalance(bal / 1e9) // Convert lamports to SOL
      } catch (error) {
        console.error('Failed to fetch balance:', error)
        setBalance(null)
      }
    }

    fetchBalance()
    
    // Refresh balance every 30 seconds
    const interval = setInterval(fetchBalance, 30000)
    return () => clearInterval(interval)
  }, [publicKey, connection])

  const handleConnect = () => {
    setVisible(true)
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
      toast.success("Wallet disconnected")
    } catch (error) {
      console.error('Disconnect error:', error)
    }
  }

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString())
      setCopied(true)
      toast.success("Address copied!")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleOpenExplorer = () => {
    if (publicKey) {
      window.open(`${SOON_EXPLORER}/address/${publicKey.toString()}`, '_blank')
    }
  }

  // Not connected state
  if (!connected) {
    return (
      <Button
        onClick={handleConnect}
        disabled={connecting}
        className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
      >
        {connecting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </>
        )}
      </Button>
    )
  }

  // Connected state - Avatar Dropdown only
  return (
    <div className="flex items-center gap-3">
      {/* Network Badge */}
      <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-medium text-emerald-400">SOON Testnet</span>
      </div>

      {/* Profile Avatar Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-transparent focus-visible:ring-0">
            <Avatar className="h-10 w-10 border border-border transition-transform hover:scale-105">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${publicKey?.toString()}`} alt="Wallet Avatar" />
              <AvatarFallback>
                <User className="h-5 w-5 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-64 p-2">
          <div className="flex flex-col p-2 mb-2 bg-muted/30 rounded-lg">
            <span className="text-xs text-muted-foreground mb-1">Wallet Balance</span>
            <span className="text-lg font-bold flex items-center gap-1">
              {balance !== null ? `${balance.toFixed(4)}` : '...'} 
              <span className="text-sm font-normal text-muted-foreground">SOL</span>
            </span>
            <span className="text-xs font-mono text-muted-foreground mt-1 truncate">
              {publicKey ? truncateAddress(publicKey.toString(), 6) : ''}
            </span>
          </div>

          <DropdownMenuItem onClick={handleCopyAddress} className="cursor-pointer">
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy Address</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleOpenExplorer} className="cursor-pointer">
            <ExternalLink className="mr-2 h-4 w-4" />
            <span>View on Explorer</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/help">
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help & Support</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleDisconnect} className="text-destructive focus:text-destructive cursor-pointer">
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
