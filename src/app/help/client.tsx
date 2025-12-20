"use client"

import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, HelpCircle, MessageCircle, ChevronDown } from "lucide-react"
import { Footer } from "@/components/footer"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqCategories = [
  {
    title: "Getting Started",
    questions: [
      { q: "How do I create an account?", a: "Click 'Connect Wallet' to get started with your crypto wallet." },
      { q: "What wallet do I need?", a: "Any Web3 wallet like MetaMask, Coinbase Wallet, or WalletConnect." },
      { q: "How much does it cost to fund a project?", a: "Every project costs exactly $1 USDC to fund." },
    ],
  },
  {
    title: "Funding Projects",
    questions: [
      {
        q: "How does funding work?",
        a: "See projects, click 'Fund for $1', confirm the transaction with your wallet.",
      },
      { q: "What do I get for funding?", a: "You receive a unique NFT badge and can vote on project milestones." },
      { q: "Can I fund multiple projects?", a: "Yes! Fund as many projects as you want, $1 each." },
    ],
  },
  {
    title: "Creating Projects",
    questions: [
      { q: "How do I submit a project?", a: "Click 'I built something' in the nav and fill out the 4-step form." },
      { q: "Is there a submission fee?", a: "Yes, there's a $1 queue fee to prevent spam submissions." },
      { q: "How long does approval take?", a: "Community voting + admin review typically takes 3-7 days." },
    ],
  },
  {
    title: "Milestones & Voting",
    questions: [
      { q: "What are milestones?", a: "Project goals that creators must complete. Funds release after approval." },
      { q: "Who can vote?", a: "All backers of a project can vote on milestone completions." },
      { q: "What happens if milestones fail?", a: "Remaining funds stay locked until creators provide better proof." },
    ],
  },
]

export function HelpClient() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="container px-4 sm:px-6 py-8 sm:py-12 pb-24 md:pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-accent/20 mb-4">
              <HelpCircle className="h-7 w-7 sm:h-8 sm:w-8 text-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Need Help?</h1>
            <p className="text-xl text-muted-foreground">Find answers to common questions.</p>
          </div>

          <Card className="mb-10">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search for help..." className="pl-10" />
              </div>
            </CardContent>
          </Card>

          {faqCategories.map((category, idx) => (
            <div key={idx} className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{category.title}</h2>
              <Accordion type="single" collapsible className="space-y-2">
                {category.questions.map((item, qIdx) => (
                  <AccordionItem
                    key={qIdx}
                    value={`${idx}-${qIdx}`}
                    className="border border-border rounded-lg px-6 data-[state=open]:bg-accent/5"
                  >
                    <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        <Card className="mt-10 sm:mt-16 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30">
          <CardContent className="p-6 sm:p-12 text-center">
            <div className="inline-flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-accent/20 mb-4">
              <MessageCircle className="h-7 w-7 sm:h-8 sm:w-8 text-accent" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Still Stuck?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Can't find your answer? Hit us up. Real humans respond.
            </p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Get Help
            </Button>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
