"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"
import { isAdminWallet, getAdminStatusMessage } from "@/lib/auth/admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldAlert, Wallet, Loader2 } from "lucide-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { publicKey, connected, connecting } = useWallet()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Small delay to ensure wallet state is loaded
    const timer = setTimeout(() => {
      setIsChecking(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [connected])

  // Show loading state while checking
  if (connecting || isChecking) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto mb-4" />
            <p className="text-muted-foreground">Verifying admin access...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Not connected
  if (!connected || !publicKey) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center">
                <Wallet className="h-8 w-8 text-accent" />
              </div>
              <CardTitle>Connect Wallet</CardTitle>
              <CardDescription>
                Please connect your wallet to access the admin panel.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <WalletMultiButton />
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  // Connected but not admin
  if (!isAdminWallet(publicKey.toString())) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-destructive/50">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/20 flex items-center justify-center">
                <ShieldAlert className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                {getAdminStatusMessage(publicKey.toString())}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Connected Wallet:</p>
                <code className="text-xs break-all">{publicKey.toString()}</code>
              </div>
              <div className="flex justify-center gap-2">
                <Button variant="outline" onClick={() => window.history.back()}>
                  Go Back
                </Button>
                <WalletMultiButton />
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  // Admin access granted
  return <>{children}</>
}
