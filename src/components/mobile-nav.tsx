"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Zap, Shield, Wallet, LogOut, Copy, ExternalLink, CheckCircle2, Droplets } from "lucide-react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "sonner"

const ADMIN_WALLET = "4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw"
const SOON_EXPLORER = 'https://explorer.testnet.soo.network'

function truncateAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [balance, setBalance] = useState<number | null>(null)
  const { publicKey, connected, wallet, disconnect } = useWallet()
  const { connection } = useConnection()
  const { setVisible } = useWalletModal()
  const isAdmin = connected && publicKey?.toString() === ADMIN_WALLET

  // Fetch SOL balance
  useEffect(() => {
    if (!publicKey || !connection) {
      const timer = setTimeout(() => {
        setBalance((prev) => (prev !== null ? null : prev))
      }, 0)
      return () => clearTimeout(timer)
    }

    const fetchBalance = async () => {
      try {
        const bal = await connection.getBalance(publicKey)
        setBalance(bal / 1e9)
      } catch (error) {
        console.error('Failed to fetch balance:', error)
        setBalance(null)
      }
    }

    fetchBalance()
    const interval = setInterval(fetchBalance, 30000)
    return () => clearInterval(interval)
  }, [publicKey, connection])

  const handleConnect = () => {
    setOpen(false)
    setTimeout(() => setVisible(true), 200)
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
      toast.success("Wallet disconnected")
      setOpen(false)
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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden focus-visible:ring-0 focus-visible:ring-offset-0">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-full p-0 flex flex-col">
        <SheetHeader className="p-4 pb-0">
          <SheetTitle asChild>
            <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <Image 
                src="/logo.svg" 
                alt="OneDollarVentures" 
                width={140} 
                height={36} 
                className="h-10 w-auto object-contain"
              />
            </Link>
          </SheetTitle>
        </SheetHeader>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="explore" className="border-b-0">
              <AccordionTrigger className="hover:no-underline py-3">Explore</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-1">
                  <Link
                    href="/discover"
                    className="py-2.5 px-4 hover:bg-accent/10 rounded-md text-sm flex flex-col gap-0.5"
                    onClick={() => setOpen(false)}
                  >
                    <span className="font-medium">Discover Projects</span>
                    <span className="text-xs text-muted-foreground">Browse all active campaigns</span>
                  </Link>
                  <Link
                    href="/creators"
                    className="py-2.5 px-4 hover:bg-accent/10 rounded-md text-sm flex flex-col gap-0.5"
                    onClick={() => setOpen(false)}
                  >
                    <span className="font-medium">Creators</span>
                    <span className="text-xs text-muted-foreground">Meet the people behind the projects</span>
                  </Link>

                  <Link
                    href="/faucet"
                    className="py-2.5 px-4 hover:bg-accent/10 rounded-md text-sm flex flex-col gap-0.5"
                    onClick={() => setOpen(false)}
                  >
                    <div className="flex items-center gap-2 font-medium">
                      <Droplets className="h-4 w-4 text-accent" />
                      Test USDC Faucet
                    </div>
                    <span className="text-xs text-muted-foreground">Get test tokens for development</span>
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="fund-projects" className="border-b-0">
              <AccordionTrigger className="hover:no-underline py-3">Fund Projects</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-1">
                  <Link
                    href="/discover"
                    className="py-2.5 px-4 hover:bg-accent/10 rounded-md text-sm flex flex-col gap-0.5"
                    onClick={() => setOpen(false)}
                  >
                    <span className="font-medium">Discover Projects</span>
                    <span className="text-xs text-muted-foreground">Browse all active campaigns</span>
                  </Link>
                  <Link
                    href="/portfolio"
                    className="py-2.5 px-4 hover:bg-accent/10 rounded-md text-sm flex flex-col gap-0.5"
                    onClick={() => setOpen(false)}
                  >
                    <span className="font-medium">Your Portfolio</span>
                    <span className="text-xs text-muted-foreground">View projects you've backed</span>
                  </Link>

                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="launch-project" className="border-b-0">
              <AccordionTrigger className="hover:no-underline py-3">Launch a Project</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-1">
                  <Link
                    href="/dashboard/creator"
                    className="py-2.5 px-4 hover:bg-accent/10 rounded-md text-sm flex flex-col gap-0.5"
                    onClick={() => setOpen(false)}
                  >
                    <span className="font-medium">Creator Dashboard</span>
                    <span className="text-xs text-muted-foreground">Manage your campaigns</span>
                  </Link>
                  <Link
                    href="/submit"
                    className="py-2.5 px-4 hover:bg-accent/10 rounded-md text-sm flex flex-col gap-0.5"
                    onClick={() => setOpen(false)}
                  >
                    <span className="font-medium">Start a Project</span>
                    <span className="text-xs text-muted-foreground">Launch a new campaign</span>
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="account" className="border-b-0">
              <AccordionTrigger className="hover:no-underline py-3">Account</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-1">
                  <Link
                    href="/notifications"
                    className="py-2.5 px-4 hover:bg-accent/10 rounded-md text-sm flex flex-col gap-0.5"
                    onClick={() => setOpen(false)}
                  >
                    <span className="font-medium">Notifications</span>
                    <span className="text-xs text-muted-foreground">View your latest updates</span>
                  </Link>
                  <Link
                    href="/profile/account"
                    className="py-2.5 px-4 hover:bg-accent/10 rounded-md text-sm flex flex-col gap-0.5"
                    onClick={() => setOpen(false)}
                  >
                    <span className="font-medium">Settings</span>
                    <span className="text-xs text-muted-foreground">Manage your account settings</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="py-2.5 px-4 hover:bg-accent/10 rounded-md text-sm flex flex-col gap-0.5"
                    onClick={() => setOpen(false)}
                  >
                    <span className="font-medium">Profile</span>
                    <span className="text-xs text-muted-foreground">View and edit your public profile</span>
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Admin Section - Only visible to admin wallet */}
            {isAdmin && (
              <AccordionItem value="admin" className="border-b-0">
                <AccordionTrigger className="hover:no-underline py-3 text-accent">
                  <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Admin
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/admin"
                      className="py-2.5 px-4 hover:bg-accent/10 rounded-md text-sm"
                      onClick={() => setOpen(false)}
                    >
                      Queue Review
                    </Link>
                    <Link
                      href="/admin/milestones"
                      className="py-2.5 px-4 hover:bg-accent/10 rounded-md text-sm"
                      onClick={() => setOpen(false)}
                    >
                      Milestones
                    </Link>
                    <Link
                      href="/admin/analytics"
                      className="py-2.5 px-4 hover:bg-accent/10 rounded-md text-sm"
                      onClick={() => setOpen(false)}
                    >
                      Analytics
                    </Link>
                    <Link
                      href="/admin/users"
                      className="py-2.5 px-4 hover:bg-accent/10 rounded-md text-sm"
                      onClick={() => setOpen(false)}
                    >
                      Users
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>

          <div className="mt-4">
            <Link href="/submit" onClick={() => setOpen(false)}>
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                I built something
              </Button>
            </Link>
          </div>
        </div>

        {/* Wallet Section - Fixed at Bottom */}
        <div className="border-t border-border p-4 bg-card/50">
          {/* Network Badge */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">SOON Testnet</span>
          </div>

          {connected && publicKey ? (
            <div className="space-y-3">
              {/* Wallet Info */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                {wallet?.adapter.icon && (
                  <img 
                    src={wallet.adapter.icon} 
                    alt={wallet.adapter.name}
                    className="w-8 h-8 rounded-lg"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm font-medium truncate">
                    {truncateAddress(publicKey.toString(), 6)}
                  </p>
                  {balance !== null && (
                    <p className="text-xs text-muted-foreground">
                      {balance.toFixed(4)} SOL
                    </p>
                  )}
                </div>
              </div>

              {/* Wallet Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopyAddress}
                  className="text-xs"
                >
                  {copied ? (
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  Copy
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleOpenExplorer}
                  className="text-xs"
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  Explorer
                </Button>
              </div>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDisconnect}
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleConnect}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
