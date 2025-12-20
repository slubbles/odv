"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Rocket, TrendingUp, Shield, Play } from "lucide-react"
import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqItems = [
  {
    question: "What if the project tanks?",
    answer: "Projects keep what they raise. But milestone voting means creators only get paid when they ship. Incentives aligned."
  },
  {
    question: "How do milestone votes work?",
    answer: "You backed it? You get to vote. Creators need majority approval before they see a dime."
  },
  {
    question: "What's the NFT badge for?",
    answer: "Proof you were early. Flex it. Maybe creators give perks. Maybe not. Either way, you were here first."
  },
  {
    question: "Can I get my dollar back?",
    answer: "Nope. All bets are final. But you control fund releases with your vote. That's better than a refund."
  },
]

export function HowItWorksClient() {
  // FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />

      <div className="container px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">How This Works</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            No VC meetings. No pitch decks to billionaires. Just your idea, their $1, and the internet.
          </p>
        </div>

        {/* For Backers */}
        <div className="mb-12 sm:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-accent/20 mb-4">
              <Users className="h-7 w-7 sm:h-8 sm:w-8 text-accent" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Got $1? You're In.</h2>
            <p className="text-lg text-muted-foreground">No minimum investment. No accredited investor BS.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="text-center border-accent/30">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="font-bold text-lg mb-2">Find Something Cool</h3>
                <p className="text-sm text-muted-foreground">
                  See what's building from real builders. Tech, art, games - whatever moves you.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-accent/30">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="font-bold text-lg mb-2">Drop Your Dollar</h3>
                <p className="text-sm text-muted-foreground">
                  One buck in USDC. Connect your wallet, click back, done.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-accent/30">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="font-bold text-lg mb-2">Get Your Badge</h3>
                <p className="text-sm text-muted-foreground">NFT proof you were here first. Before it was cool.</p>
              </CardContent>
            </Card>

            <Card className="text-center border-accent/30">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <h3 className="font-bold text-lg mb-2">Hold Them Accountable</h3>
                <p className="text-sm text-muted-foreground">Vote on milestones. Make sure they ship.</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link href="/discover">Find Projects</Link>
            </Button>
          </div>
        </div>

        {/* For Creators */}
        <div className="mb-12 sm:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-accent/20 mb-4">
              <Rocket className="h-7 w-7 sm:h-8 sm:w-8 text-accent" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Built Something? Show Us.</h2>
            <p className="text-lg text-muted-foreground">Skip the gatekeepers. Pitch the internet instead.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-6xl mx-auto">
            <Card className="text-center border-accent/30">
              <CardContent className="p-4 sm:p-8">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto mb-4 text-lg sm:text-xl font-bold">
                  1
                </div>
                <h3 className="font-bold text-sm sm:text-lg mb-2">Submit Your Thing</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Tell us what you're building. Keep it real.</p>
              </CardContent>
            </Card>

            <Card className="text-center border-accent/30">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="font-bold text-lg mb-2">Pass the Vibe Check</h3>
                <p className="text-sm text-muted-foreground">Community votes. We review. No suits in boardrooms.</p>
              </CardContent>
            </Card>

            <Card className="text-center border-accent/30">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="font-bold text-lg mb-2">Go Live for 24hrs</h3>
                <p className="text-sm text-muted-foreground">One day to collect $1 backers. The clock starts now.</p>
              </CardContent>
            </Card>

            <Card className="text-center border-accent/30">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <h3 className="font-bold text-lg mb-2">Ship or Die</h3>
                <p className="text-sm text-muted-foreground">Complete milestones. Get paid. Repeat.</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link href="/submit">Submit Your Project</Link>
            </Button>
          </div>
        </div>

        {/* Key Features */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why This Beats Kickstarter</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-accent/30">
              <CardContent className="p-6 text-center">
                <div className="h-14 w-14 rounded-lg bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-bold text-lg mb-2">Just. One. Dollar.</h3>
                <p className="text-sm text-muted-foreground">No $50 minimum pledges. Everyone can play.</p>
              </CardContent>
            </Card>

            <Card className="border-accent/30">
              <CardContent className="p-6 text-center">
                <div className="h-14 w-14 rounded-lg bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-bold text-lg mb-2">Prove It First</h3>
                <p className="text-sm text-muted-foreground">
                  No money until you complete milestones. Backers vote to release funds.
                </p>
              </CardContent>
            </Card>

            <Card className="border-accent/30">
              <CardContent className="p-6 text-center">
                <div className="h-14 w-14 rounded-lg bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-bold text-lg mb-2">You Decide</h3>
                <p className="text-sm text-muted-foreground">Backers have real power. Not just empty promises.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Video Section */}
        <div className="max-w-4xl mx-auto mt-20">
          <Card className="border-accent/30">
            <CardContent className="p-8">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="h-20 w-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <Play className="h-10 w-10 text-accent" />
                  </div>
                  <p className="text-muted-foreground">2-Minute Platform Demo</p>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center mb-3">Watch How It Works</h3>
              <p className="text-center text-muted-foreground">
                Two minutes. That's all it takes to understand why this changes everything.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Questions Everyone Asks</h2>

          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, idx) => (
              <AccordionItem
                key={idx}
                value={`faq-${idx}`}
                className="border border-border rounded-lg px-6 data-[state=open]:bg-accent/5"
              >
                <AccordionTrigger className="text-left font-bold hover:no-underline py-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link href="/discover">Start Exploring</Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
