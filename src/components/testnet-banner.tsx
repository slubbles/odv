"use client"

import { useState } from "react"
import { AlertTriangle, X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function TestnetBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="bg-yellow-500/10 border-b border-yellow-500/30 px-4 py-2">
      <div className="container mx-auto flex items-center justify-center gap-4 relative">
        <div className="flex items-center gap-2 text-sm">
          <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
          <span className="text-yellow-200">
            <strong>Beta on SOON Testnet</strong> — Use test USDC from{" "}
            <a 
              href="https://faucet.testnet.soo.network" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-yellow-100 inline-flex items-center gap-1"
            >
              faucet <ExternalLink className="h-3 w-3" />
            </a>
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
