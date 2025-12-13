"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  Rocket, 
  Target, 
  Zap, 
  Shield, 
  Users, 
  TrendingUp,
  Code2,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Github,
  ExternalLink,
  Timer,
  DollarSign,
  Lock
} from "lucide-react"
import Link from "next/link"

export default function DocsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-accent/20 text-accent-foreground border-accent/30">
            Platform Documentation
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Build. Fund. Ship.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about ODV - the crowdfunding platform where 1,000 believers fund your project at $1 each.
          </p>
        </div>

        {/* Quick Start Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="border-accent/20 hover:border-accent/40 transition-colors">
            <CardHeader>
              <Rocket className="h-8 w-8 text-accent mb-2" />
              <CardTitle>For Creators</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Launch your project in 10 minutes. No VC meetings, no pitch decks.
              </p>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="#creators">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-accent/20 hover:border-accent/40 transition-colors">
            <CardHeader>
              <Target className="h-8 w-8 text-accent mb-2" />
              <CardTitle>For Backers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Fund projects you believe in for just $1. Track milestones, see progress.
              </p>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="#backers">Learn More <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-accent/20 hover:border-accent/40 transition-colors">
            <CardHeader>
              <Code2 className="h-8 w-8 text-accent mb-2" />
              <CardTitle>Technical Docs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Deep dive into smart contracts, blockchain architecture, and APIs.
              </p>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="#technical">View Docs <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* What is ODV? */}
        <section id="introduction" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-6 w-6 text-accent" />
            <h2 className="text-3xl font-bold">What is ODV?</h2>
          </div>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              ODV (One Dollar Vote) is a decentralized crowdfunding platform built on the SOON network (SVM rollup). 
              We reimagine project funding by democratizing access to capital - where 1,000 people backing your project 
              at $1 each is more powerful than one VC writing a check.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="h-5 w-5 text-accent" />
                    The Problem We Solve
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-0.5">•</span>
                      <span>Traditional crowdfunding platforms take 5-15% fees</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-0.5">•</span>
                      <span>Creators wait weeks for fund release</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-0.5">•</span>
                      <span>No transparency in where money goes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-0.5">•</span>
                      <span>Geographic restrictions limit global access</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-accent/5 border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Lightbulb className="h-5 w-5 text-accent" />
                    Our Solution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>0% platform fees (only blockchain gas)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Milestone-based fund release (trustless escrow)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>100% transparent on-chain transactions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Global access, anyone with a wallet can participate</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Target className="h-6 w-6 text-accent" />
            <h2 className="text-3xl font-bold">How It Works</h2>
          </div>

          <div className="space-y-6">
            {/* Step 1 */}
            <Card className="border-l-4 border-l-accent">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <CardTitle>Creator Submits Project</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      Fill out a simple form: title, description, funding goal, and milestones. No 50-page pitch deck required.
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Step 2 */}
            <Card className="border-l-4 border-l-accent">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <CardTitle>Campaign Initialized On-Chain</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      Your project is deployed as a smart contract on SOON network. All milestones, deadlines, and funding goals are immutably stored.
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Step 3 */}
            <Card className="border-l-4 border-l-accent">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <CardTitle>Backers Fund the Project</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      Each backer sends $1 (in USDC) directly to the escrow smart contract. No intermediary holds the funds.
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Step 4 */}
            <Card className="border-l-4 border-l-accent">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <CardTitle>Build & Complete Milestones</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      Creator builds the project and submits proof of milestone completion (links, screenshots, videos).
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Step 5 */}
            <Card className="border-l-4 border-l-accent">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent font-bold flex-shrink-0">
                    5
                  </div>
                  <div>
                    <CardTitle>Funds Released Per Milestone</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      After admin review (community voting coming soon), funds allocated to that milestone are released from escrow to creator.
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* For Creators */}
        <section id="creators" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Rocket className="h-6 w-6 text-accent" />
            <h2 className="text-3xl font-bold">For Creators</h2>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Requirements to Launch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Clear Project Description</p>
                    <p className="text-sm text-muted-foreground">What are you building and why?</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Defined Milestones</p>
                    <p className="text-sm text-muted-foreground">Break work into deliverable chunks</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Realistic Timeline</p>
                    <p className="text-sm text-muted-foreground">Set achievable deadlines</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Web3 Wallet</p>
                    <p className="text-sm text-muted-foreground">Phantom, Backpack, or compatible</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-muted/50">
              <CardHeader>
                <Timer className="h-6 w-6 text-accent mb-2" />
                <CardTitle className="text-lg">Launch in 10 Minutes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No lengthy approval processes. Submit your project, initialize on-chain, and start fundraising same day.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardHeader>
                <DollarSign className="h-6 w-6 text-accent mb-2" />
                <CardTitle className="text-lg">0% Platform Fees</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Keep 100% of funds raised. Only pay minimal blockchain gas fees (typically $0.01-0.10 per transaction).
                </p>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardHeader>
                <Lock className="h-6 w-6 text-accent mb-2" />
                <CardTitle className="text-lg">Milestone Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Funds release as you complete work. Builds trust with backers and protects everyone involved.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* For Backers */}
        <section id="backers" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-6 w-6 text-accent" />
            <h2 className="text-3xl font-bold">For Backers</h2>
          </div>

          <Card className="bg-accent/5 border-accent/20 mb-6">
            <CardHeader>
              <CardTitle>Why Back Projects on ODV?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">Trustless Escrow Protection</p>
                    <p className="text-sm text-muted-foreground">
                      Your $1 is locked in a smart contract. Creators can only withdraw funds after completing milestones.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">Track Real Progress</p>
                    <p className="text-sm text-muted-foreground">
                      See exactly what milestone the creator is working on, view proof of completion, and track timeline.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ExternalLink className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">Verify On-Chain</p>
                    <p className="text-sm text-muted-foreground">
                      Every transaction is public on SOON Explorer. Verify your backing, fund releases, and campaign status anytime.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">What Do Backers Get?</h3>
            <p className="text-muted-foreground mb-4">
              ODV is <strong>donation-based crowdfunding</strong>, not equity or revenue-sharing. You're backing projects you believe in.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Early access to project launches (creator's discretion)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Recognition as a supporter (public backer badge)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Join the builder community (Discord, updates, behind-the-scenes)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Creator may offer perks (airdrops, NFTs, credits - optional)</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Technical Architecture */}
        <section id="technical" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Code2 className="h-6 w-6 text-accent" />
            <h2 className="text-3xl font-bold">Technical Architecture</h2>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Blockchain Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Badge variant="outline">Layer</Badge>
                      SOON Network (SVM Rollup)
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Solana Virtual Machine rollup on Ethereum. Fast finality (~400ms), low fees ($0.001 avg).
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Badge variant="outline">Language</Badge>
                      Rust + Anchor Framework
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Smart contracts written in Rust using Anchor v0.30.1 for secure, auditable escrow logic.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Badge variant="outline">Token</Badge>
                      USDC (SPL Token)
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      All funding in USDC stablecoin. Consistent $1 backing value regardless of crypto volatility.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Badge variant="outline">Frontend</Badge>
                      Next.js 15 + React 19
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Modern web stack with Solana wallet adapter. Mobile-first responsive design.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Smart Contract Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Core Instructions</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <code className="bg-muted px-2 py-0.5 rounded text-xs">initialize_platform</code>
                        <span>Admin setup: configure platform wallet and fees</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <code className="bg-muted px-2 py-0.5 rounded text-xs">initialize_campaign</code>
                        <span>Creator deploys new project with milestones</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <code className="bg-muted px-2 py-0.5 rounded text-xs">back_campaign</code>
                        <span>Backer sends $1 USDC to escrow</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <code className="bg-muted px-2 py-0.5 rounded text-xs">complete_milestone</code>
                        <span>Creator marks milestone done (admin verifies)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <code className="bg-muted px-2 py-0.5 rounded text-xs">withdraw_funds</code>
                        <span>Creator claims released milestone funds</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <code className="bg-muted px-2 py-0.5 rounded text-xs">refund_backers</code>
                        <span>Backers get refunds if project fails</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Security Features</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>PDA-based account derivation (no collisions)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>Signer verification on all state-changing operations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>Re-entrancy protection via Anchor constraints</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>Overflow/underflow checks on all math operations</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Open Source</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  ODV is fully open source. Audit our code, contribute improvements, or fork for your own use case.
                </p>
                <Button variant="outline" asChild>
                  <a href="https://github.com/your-org/odv" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    View on GitHub
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="h-6 w-6 text-accent" />
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Why $1 per backing?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We believe in democratizing funding. $1 is low enough that anyone globally can participate, 
                  but high enough to show genuine support. It's about community validation, not wealth gatekeeping.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What if a creator abandons the project?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Funds are locked in escrow and released per milestone. If a creator stops delivering, 
                  remaining funds can be refunded to backers (currently admin-controlled, soon community-governed).
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I get USDC to back projects?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  For testing: Use our <Link href="/faucet" className="text-accent hover:underline">Test USDC Faucet</Link>. 
                  For mainnet: Buy USDC on exchanges (Coinbase, Binance) and bridge to SOON network, 
                  or use on-ramp services like MoonPay.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I back the same project multiple times?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Currently, one backing per wallet per project. This ensures fair distribution and prevents whale dominance. 
                  Want to support more? Share the project with friends!
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is ODV available globally?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Yes! Anyone with a web3 wallet and internet can create or back projects. No KYC, no geographic restrictions. 
                  Blockchain is borderless.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Roadmap */}
        <section id="roadmap" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-6 w-6 text-accent" />
            <h2 className="text-3xl font-bold">Roadmap</h2>
          </div>

          <div className="space-y-4">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Phase 1: MVP Launch ✅</CardTitle>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✓ Smart contract deployment on SOON Testnet</li>
                  <li>✓ Project submission & backing flow</li>
                  <li>✓ Milestone-based fund release</li>
                  <li>✓ Admin review queue</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-accent">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Phase 2: Community Features 🚧</CardTitle>
                  <Badge className="bg-accent/10 text-accent border-accent/20">In Progress</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>⏳ Comments & discussions on projects</li>
                  <li>⏳ Creator profiles & portfolios</li>
                  <li>⏳ Social sharing & embeds</li>
                  <li>⏳ Email/Discord notifications</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-muted">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Phase 3: Decentralized Governance</CardTitle>
                  <Badge variant="outline">Q3 2025</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>⬜ ODV governance token (for voters, not trading)</li>
                  <li>⬜ Community voting on milestone approvals</li>
                  <li>⬜ Dispute resolution via jury system</li>
                  <li>⬜ Remove admin control (fully autonomous)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-muted">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Phase 4: Mainnet & Scale</CardTitle>
                  <Badge variant="outline">Q4 2025</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>⬜ Deploy to SOON Mainnet</li>
                  <li>⬜ Smart contract audit (security firm)</li>
                  <li>⬜ Mobile app (iOS/Android)</li>
                  <li>⬜ Multi-chain support (Solana, Ethereum L2s)</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-12 bg-accent/5 rounded-lg border border-accent/20">
          <h2 className="text-3xl font-bold mb-4">Ready to Build?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of creators and backers building the future of crowdfunding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild>
              <Link href="/submit">
                <Rocket className="mr-2 h-5 w-5" />
                Launch Your Project
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/discover">
                <Users className="mr-2 h-5 w-5" />
                Explore Projects
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
