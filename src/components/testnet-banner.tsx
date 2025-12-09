"use client"

import { useState } from "react"
import { AlertTriangle, X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function TestnetBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="bg-accent/10 border-b border-accent/20 px-4 py-2">
      <div className="container mx-auto flex items-center justify-center gap-4 relative">
        <div className="flex items-center gap-2 text-sm text-center">
          <AlertTriangle className="h-4 w-4 text-accent flex-shrink-0" />
          <span className="text-foreground/90">
            <strong>Testnet Mode:</strong> You are on SOON Testnet. All funds are simulated.{" "}
            <Link href="/faucet" className="underline hover:text-accent inline-flex items-center gap-1">
              Get Test USDC
            </Link>
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-yellow-500/20 absolute right-0"
          onClick={() => setDismissed(true)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </div>
    </div>
  )
}
