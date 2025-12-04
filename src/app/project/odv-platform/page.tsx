"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Clock, CheckCircle, Circle, Github, Globe, Twitter, ExternalLink, Sparkles, Heart } from "lucide-react"
import { SocialShare } from "@/components/social-share"
import { BackProjectButton } from "@/components/back-project-button"
import Link from "next/link"

// ODV Platform Campaign Data
const ODV_CAMPAIGN = {
  id: "odv-platform",
  title: "OneDollarVentures",
  tagline: "The $1 crowdfunding platform, crowdfunding itself for $1",
  category: "Technology",
  goal: 500,
  raised: 0,
  backers_count: 0,
  creator_wallet: "4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw",
  creator_name: "ODV Team",
  creator_bio: "Building the future of micro-crowdfunding on Solana. One dollar at a time.",
  status: "active",
  deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  created_at: new Date().toISOString(),
}

const MILESTONES = [
  {
    id: "m1",
    title: "Mainnet Launch",
    description: "Deploy smart contracts to SOON Mainnet and enable real USDC transactions.",
    percentage: 25,
    deadline: "Q1 2025",
    status: "active" as "active" | "locked" | "completed",
  },
  {
    id: "m2", 
    title: "First 10 External Projects",
    description: "Onboard and launch 10 external creator projects on the platform.",
    percentage: 25,
    deadline: "Q1 2025",
    status: "locked" as "active" | "locked" | "completed",
  },
  {
    id: "m3",
    title: "NFT Badges for Backers",
    description: "Launch the NFT reward system - founding backers get exclusive badges.",
    percentage: 25,
    deadline: "Q2 2025",
    status: "locked" as "active" | "locked" | "completed",
  },
  {
    id: "m4",
    title: "Mobile Experience",
    description: "Responsive redesign and PWA support for mobile users.",
    percentage: 25,
    deadline: "Q2 2025",
    status: "locked" as "active" | "locked" | "completed",
  },
]

const FULL_DESCRIPTION = `
## The Problem

Crowdfunding is broken:
- **Kickstarter/Indiegogo**: Don't support most countries (including Philippines, where we're building from)
- **High barriers**: Minimum pledges of $10-50 scare away casual supporters
- **All or nothing**: Miss your goal by $1? Get nothing.
- **Fees**: 5-10% platform fees on top of payment processing

## The Solution

**OneDollarVentures**: A crowdfunding platform where:
- Every project gets backed for exactly **$1 USDC**
- Built on **SOON Network** (Solana-compatible, low fees)
- **No country restrictions** - if you have a wallet, you can participate
- **Milestone-based releases** - funds unlock as creators deliver
- **Transparent**: Everything on-chain

## Why Back This?

You're not just backing a project. You're:
1. **Proving the concept** - Can a $1 crowdfunding platform work?
2. **Becoming a founding member** - Your wallet will be recorded forever
3. **Getting early access** - First to test new features
4. **Potentially getting an NFT** - Founding Backer badge coming soon

## The Meta Irony

We needed funding to finish building this platform. Traditional crowdfunding sites don't work for us.

So we're crowdfunding our crowdfunding platform... on our own crowdfunding platform.

If this works, it proves the entire concept.

## How Funds Will Be Used

- **Smart Contract Auditing**: Security review before mainnet
- **Infrastructure**: RPC costs, hosting, domain
- **Design**: Professional UI/UX improvements  
- **Marketing**: Launch campaign for creator acquisition

## The Team

Solo developer from the Philippines, building in public. Check the GitHub - every commit is there.

## Risk Disclosure

This is a testnet beta. You're backing with test USDC. The risk is:
- The platform might not reach mainnet
- Test USDC has no real value
- We might pivot the concept

But hey, it's $1 (test dollars). WAGMI.
`

export default function ODVCampaignPage() {
  const progress = (ODV_CAMPAIGN.raised / ODV_CAMPAIGN.goal) * 100
  const daysLeft = Math.max(0, Math.ceil((new Date(ODV_CAMPAIGN.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="container px-4 sm:px-6 py-8 sm:py-12 flex-1 pb-24 md:pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Header */}
            <div>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <Badge className="bg-accent/20 text-accent border-accent/30">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Meta Campaign
                </Badge>
                <Badge variant="secondary">{ODV_CAMPAIGN.category}</Badge>
                <div className="flex items-center gap-2 ml-auto">
                  <Button size="icon" variant="outline">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <SocialShare 
                    title={ODV_CAMPAIGN.title} 
                    description={ODV_CAMPAIGN.tagline} 
                  />
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{ODV_CAMPAIGN.title}</h1>
              <p className="text-xl text-accent font-medium mb-6">{ODV_CAMPAIGN.tagline}</p>

              {/* Creator Info */}
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xl">
                  O
                </div>
                <div>
                  <p className="font-semibold">{ODV_CAMPAIGN.creator_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {ODV_CAMPAIGN.creator_wallet.slice(0, 8)}...{ODV_CAMPAIGN.creator_wallet.slice(-6)}
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Image/Video */}
            <div className="aspect-video bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg overflow-hidden flex items-center justify-center border border-accent/20">
              <div className="text-center p-8">
                <p className="text-6xl mb-4">💸</p>
                <p className="text-2xl font-bold">OneDollarVentures</p>
                <p className="text-muted-foreground">The $1 crowdfunding platform</p>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Campaign</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none">
                <div 
                  className="text-muted-foreground leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ 
                    __html: FULL_DESCRIPTION
                      .replace(/## /g, '<h3 class="text-lg font-semibold text-foreground mt-6 mb-2">')
                      .replace(/\n\n/g, '</h3><p class="mb-4">')
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
                      .replace(/- (.*?)(?=\n|$)/g, '<li>$1</li>')
                  }}
                />
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card>
              <CardHeader>
                <CardTitle>Milestones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {MILESTONES.map((milestone, index) => (
                  <div key={milestone.id} className="flex gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="mt-1">
                      {milestone.status === "completed" ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : milestone.status === "active" ? (
                        <Circle className="h-6 w-6 text-accent fill-accent/20" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h4 className="font-semibold">{milestone.title}</h4>
                        <Badge variant={milestone.status === "active" ? "default" : "outline"}>
                          {milestone.percentage}%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                      <p className="text-xs text-muted-foreground">Target: {milestone.deadline}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Links */}
            <Card>
              <CardHeader>
                <CardTitle>Links & Resources</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button variant="outline" asChild>
                  <a href="https://github.com/slubbles/odv" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub Repository
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://explorer.testnet.soo.network/address/4TVVaLhxNsoW82qhRiA9Fmspg4RUq26QvcmczW1JqijA" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Smart Contract
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://faucet.testnet.soo.network" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Get Test USDC
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Funding Stats */}
            <Card className="sticky top-20 border-accent/30">
              <CardContent className="p-6 space-y-6">
                <div>
                  <p className="text-3xl font-bold mb-1">${ODV_CAMPAIGN.raised}</p>
                  <p className="text-muted-foreground mb-4">pledged of ${ODV_CAMPAIGN.goal} goal</p>
                  <Progress value={progress} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold">{ODV_CAMPAIGN.backers_count}</p>
                    <p className="text-sm text-muted-foreground">backers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{daysLeft}</p>
                    <p className="text-sm text-muted-foreground">days left</p>
                  </div>
                </div>

                <BackProjectButton
                  projectId={ODV_CAMPAIGN.id}
                  creatorWallet={ODV_CAMPAIGN.creator_wallet}
                  projectStatus={ODV_CAMPAIGN.status}
                  size="lg"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                />

                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    $1 USDC on SOON Testnet
                  </p>
                  <a 
                    href="https://faucet.testnet.soo.network" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-accent hover:underline"
                  >
                    Get test USDC from faucet →
                  </a>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                  <Clock className="h-4 w-4" />
                  <span>{daysLeft} days left</span>
                </div>
              </CardContent>
            </Card>

            {/* How to Back */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How to Back</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">1</div>
                  <p className="text-muted-foreground">Connect your Phantom or Solflare wallet</p>
                </div>
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">2</div>
                  <p className="text-muted-foreground">
                    Get test USDC from{" "}
                    <a href="https://faucet.testnet.soo.network" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                      SOON faucet
                    </a>
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">3</div>
                  <p className="text-muted-foreground">Click "Back for $1" and approve the transaction</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
