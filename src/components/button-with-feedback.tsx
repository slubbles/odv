"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface ButtonWithFeedbackProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: any
  size?: any
}

export function ButtonWithFeedback({ children, onClick, className, variant, size }: ButtonWithFeedbackProps) {
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    setClicked(true)
    onClick?.()
    setTimeout(() => setClicked(false), 2000)
  }

  return (
    <Button className={className} variant={variant} size={size} onClick={handleClick} disabled={clicked}>
      {clicked ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Done!
        </>
      ) : (
        children
      )}
    </Button>
  )
}
