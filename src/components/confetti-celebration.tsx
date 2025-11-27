"use client"

import { useEffect, useState } from "react"

interface ConfettiParticle {
  id: number
  x: number
  y: number
  color: string
  rotation: number
  velocity: { x: number; y: number }
}

export function ConfettiCelebration({ trigger }: { trigger: boolean }) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([])

  useEffect(() => {
    if (!trigger) return

    const colors = ["oklch(0.55 0.22 25)", "oklch(0.6 0.18 35)", "oklch(0.65 0.15 45)", "oklch(0.7 0.12 55)"]

    const newParticles: ConfettiParticle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: 50,
      y: 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      velocity: {
        x: (Math.random() - 0.5) * 10,
        y: -Math.random() * 10 - 5,
      },
    }))

    setParticles(newParticles)

    setTimeout(() => setParticles([]), 3000)
  }, [trigger])

  if (particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 animate-confetti-fall"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            animation: `confetti-fall 3s ease-out forwards`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(var(--x), 100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
