"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show shortcuts modal with ?
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
      // Close with Escape
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-labelledby="shortcuts-title"
      aria-modal="true"
    >
      <Card className="max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle id="shortcuts-title">Keyboard Shortcuts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Show shortcuts</span>
              <Badge variant="secondary">?</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Navigate projects</span>
              <div className="flex gap-2">
                <Badge variant="secondary">J</Badge>
                <Badge variant="secondary">K</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Search</span>
              <Badge variant="secondary">/</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Submit project</span>
              <Badge variant="secondary">C</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Go to dashboard</span>
              <Badge variant="secondary">G then D</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Go to wallet</span>
              <Badge variant="secondary">G then W</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
