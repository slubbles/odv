"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@solana/wallet-adapter-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Rocket, Heart } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const { publicKey, connected } = useWallet()
  const [checking, setChecking] = useState(true)
  const [hasProjects, setHasProjects] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkUserType() {
      if (!connected || !publicKey) {
        setChecking(false)
        return
      }

      try {
        // Check if user has created any projects
        const response = await fetch(`/api/projects?creator=${publicKey.toString()}&limit=1`)
        const data = await response.json()
        
        if (data.projects && data.projects.length > 0) {
          // User is a creator - redirect to creator dashboard
          router.replace('/dashboard/creator')
        } else {
          // Check if user has backed any projects
          const backingResponse = await fetch(`/api/backing?wallet=${publicKey.toString()}&limit=1`)
          const backingData = await backingResponse.json()
          
          if (backingData.backings && backingData.backings.length > 0) {
            // User is a backer - redirect to backer dashboard
            router.replace('/dashboard/backer')
          } else {
            // New user - show choice
            setHasProjects(false)
            setChecking(false)
          }
        }
      } catch (error) {
        // On error, show choice screen
        setChecking(false)
        setHasProjects(false)
      }
    }

    checkUserType()
  }, [connected, publicKey, router])

  // Not connected - prompt to connect
  if (!connected) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4 pb-24 md:pb-12">
          <Card className="p-8 sm:p-12 text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h1>
            <p className="text-muted-foreground mb-6">
              Connect your wallet to view your projects and backed campaigns.
            </p>
            <p className="text-sm text-muted-foreground">
              Use the wallet button in the header to get started.
            </p>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  // Still checking user type
  if (checking) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // New user - show choice
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 pb-24 md:pb-12">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Welcome!</h1>
            <p className="text-lg text-muted-foreground">
              What brings you to OneDollarVote today?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Creator Option */}
            <Card className="p-8 hover:border-accent/50 transition-all cursor-pointer group">
              <Link href="/dashboard/creator" className="block">
                <div className="h-16 w-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-6 group-hover:bg-accent/30 transition-colors">
                  <Rocket className="h-8 w-8 text-accent" />
                </div>
                <h2 className="text-2xl font-bold mb-3">I'm a Creator</h2>
                <p className="text-muted-foreground mb-6">
                  Submit projects, track milestones, and connect with your backers.
                </p>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Go to Creator Dashboard
                </Button>
              </Link>
            </Card>

            {/* Backer Option */}
            <Card className="p-8 hover:border-accent/50 transition-all cursor-pointer group">
              <Link href="/dashboard/backer" className="block">
                <div className="h-16 w-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-6 group-hover:bg-accent/30 transition-colors">
                  <Heart className="h-8 w-8 text-accent" />
                </div>
                <h2 className="text-2xl font-bold mb-3">I'm a Backer</h2>
                <p className="text-muted-foreground mb-6">
                  Track your $1 bets, collect NFTs, and discover new projects.
                </p>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Go to Backer Dashboard
                </Button>
              </Link>
            </Card>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            You can always switch between dashboards using the sidebar navigation.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
