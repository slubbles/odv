"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { RefreshCw } from "lucide-react"

interface PullToRefreshProps {
  children: React.ReactNode
  onRefresh: () => Promise<void>
}

export function PullToRefresh({ children, onRefresh }: PullToRefreshProps) {
  const [pulling, setPulling] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef(0)
  const threshold = 80

  const handleTouchStart = (e: TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (startY.current === 0 || window.scrollY > 0) return

    const currentY = e.touches[0].clientY
    const distance = currentY - startY.current

    if (distance > 0) {
      setPulling(true)
      setPullDistance(Math.min(distance, threshold * 1.5))
    }
  }

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold && !refreshing) {
      setRefreshing(true)
      await onRefresh()
      setRefreshing(false)
    }
    setPulling(false)
    setPullDistance(0)
    startY.current = 0
  }

  useEffect(() => {
    const element = document.querySelector("main") || document.body
    element.addEventListener("touchstart", handleTouchStart as any)
    element.addEventListener("touchmove", handleTouchMove as any)
    element.addEventListener("touchend", handleTouchEnd as any)

    return () => {
      element.removeEventListener("touchstart", handleTouchStart as any)
      element.removeEventListener("touchmove", handleTouchMove as any)
      element.removeEventListener("touchend", handleTouchEnd as any)
    }
  }, [pullDistance, refreshing])

  return (
    <div className="relative">
      {pulling && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur transition-all"
          style={{ height: `${pullDistance}px` }}
        >
          <RefreshCw className={`h-6 w-6 text-accent ${refreshing ? "animate-spin" : ""}`} />
        </div>
      )}
      {children}
    </div>
  )
}
