"use client"

import type React from "react"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

interface PrefetchLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function PrefetchLink({ href, children, className }: PrefetchLinkProps) {
  const [prefetched, setPrefetched] = useState(false)
  const linkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !prefetched) {
            // Prefetch the route
            const link = document.createElement("link")
            link.rel = "prefetch"
            link.href = href
            document.head.appendChild(link)
            setPrefetched(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: "200px" },
    )

    if (linkRef.current) {
      observer.observe(linkRef.current)
    }

    return () => observer.disconnect()
  }, [href, prefetched])

  return (
    <Link href={href} className={className} ref={linkRef}>
      {children}
    </Link>
  )
}
