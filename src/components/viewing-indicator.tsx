"use client"

import { useEffect, useState } from "react"
import { Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function ViewingIndicator({ projectId }: { projectId: string }) {
  const [viewerCount, setViewerCount] = useState(0)

  useEffect(() => {
    // Simulate random viewer count
    const baseCount = Math.floor(Math.random() * 20) + 5
    setViewerCount(baseCount)

    const interval = setInterval(() => {
      setViewerCount((prev) => {
        const change = Math.floor(Math.random() * 5) - 2
        return Math.max(3, prev + change)
      })
    }, 8000)

    return () => clearInterval(interval)
  }, [projectId])

  if (viewerCount === 0) return null

  return (
    <Badge variant="secondary" className="animate-pulse-glow">
      <Eye className="mr-1 h-3 w-3" />
      {viewerCount} viewing now
    </Badge>
  )
}
