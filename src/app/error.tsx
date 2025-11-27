"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[v0] Error caught:", error)
  }, [error])

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-16 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardContent className="p-8 text-center">
          <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-accent" />
          <h2 className="text-2xl font-bold mb-2">Something Broke</h2>
          <p className="text-muted-foreground mb-6">Not your fault. Probably ours. Try refreshing or head back home.</p>
          {error.message && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                Technical details
              </summary>
              <pre className="mt-2 p-4 bg-muted rounded text-xs overflow-auto">{error.message}</pre>
            </details>
          )}
          <div className="flex gap-4 justify-center">
            <Button onClick={reset} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
