"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Clock, Sparkles, ExternalLink, Github, ArrowRight } from "lucide-react"
import { BackProjectButton } from "@/components/back-project-button"
import { useState, useEffect } from "react"

// This is the ODV platform's own campaign - hardcoded as the flagship project
const ODV_CAMPAIGN = {
  id: "odv-platform",
  title: "OneDollarVentures",
  tagline: "The $1 crowdfunding platform, crowdfunding itself for $1",
  description: `We built a crowdfunding platform where every project gets backed for exactly $1. 

Now we're using it to fund... itself.

Fund this project for $1 and you'll:
• Be a founding backer of the platform
• Get a Founding Member NFT (when we launch them)
• Help prove this crazy idea works

It's meta. It's recursive. It might just work.`,
  category: "Technology",
  goal: 500, // $500 = 500 backers
  raised: 0, // Will be dynamic from Supabase
  backers_count: 0, // Will be dynamic
  creator_wallet: "4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw",
  creator_name: "ODV Team",
  status: "active",
  deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  milestones: [
    { title: "Mainnet Launch", percentage: 25 },
    { title: "First 10 External Projects", percentage: 25 },
    { title: "NFT Badges for Backers", percentage: 25 },
    { title: "Mobile Experience", percentage: 25 },
  ],
  links: {
    github: "https://github.com/slubbles/odv",
    website: "https://onedollarventures.com",
  }
}

interface ODVFeaturedCampaignProps {
  raised?: number
  backersCount?: number
}

export function ODVFeaturedCampaign({ raised = 0, backersCount = 0 }: ODVFeaturedCampaignProps) {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const progress = (raised / ODV_CAMPAIGN.goal) * 100
  const daysLeft = now ? Math.max(0, Math.ceil((new Date(ODV_CAMPAIGN.deadline).getTime() - now) / (1000 * 60 * 60 * 24))) : 0

  return (
    <Card className="relative overflow-hidden border-accent/50 bg-gradient-to-br from-accent/5 to-transparent">
      {/* Glow effect */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at top left, rgba(232, 76, 39, 0.3) 0%, transparent 50%)",
        }}
      />
      
      <CardContent className="relative p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left: Content */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-accent/20 text-accent border-accent/30">
                <Sparkles className="h-3 w-3 mr-1" />
                Meta Campaign
              </Badge>
              <Badge variant="outline">{ODV_CAMPAIGN.category}</Badge>
            </div>
            
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">{ODV_CAMPAIGN.title}</h2>
              <p className="text-lg text-accent font-medium">{ODV_CAMPAIGN.tagline}</p>
            </div>
            
            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
              {ODV_CAMPAIGN.description}
            </p>
            
            {/* Milestones Preview */}
            <div className="pt-2">
              <p className="text-sm font-medium mb-2">Milestones:</p>
              <div className="flex flex-wrap gap-2">
                {ODV_CAMPAIGN.milestones.map((m, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {m.title} ({m.percentage}%)
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Links */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href={ODV_CAMPAIGN.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                by {ODV_CAMPAIGN.creator_name}
              </span>
            </div>
          </div>
          
          {/* Right: Stats & CTA */}
          <div className="lg:w-72 space-y-4">
            <div className="bg-card/50 rounded-lg p-4 space-y-4 border">
              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-bold text-lg">${raised}</span>
                  <span className="text-muted-foreground">of ${ODV_CAMPAIGN.goal} goal</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {progress.toFixed(0)}% funded
                </p>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 py-2">
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                    <Users className="h-3 w-3" />
                    Backers
                  </div>
                  <p className="font-bold text-lg">{backersCount}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                    <Clock className="h-3 w-3" />
                    Days Left
                  </div>
                  <p className="font-bold text-lg">{daysLeft}</p>
                </div>
              </div>
              
              {/* CTA */}
              <BackProjectButton
                projectId={ODV_CAMPAIGN.id}
                creatorWallet={ODV_CAMPAIGN.creator_wallet}
                projectStatus={ODV_CAMPAIGN.status}
                size="lg"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              />
              
              <p className="text-xs text-center text-muted-foreground">
                $1 USDC on SOON Testnet
              </p>
            </div>
            
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/project/${ODV_CAMPAIGN.id}`}>
                View Full Campaign
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
