"use client"

import { useEffect, useState } from "react"

export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!hasMounted) {
    return null
  }

  return <>{children}</>
}
