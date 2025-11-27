import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, HelpCircle, MessageCircle } from "lucide-react"
import { Footer } from "@/components/footer"

const faqCategories = [
  {
    title: "Getting Started",
    questions: [
      { q: "How do I create an account?", a: "Click 'Connect Wallet' to get started with your crypto wallet." },
      { q: "What wallet do I need?", a: "Any Web3 wallet like MetaMask, Coinbase Wallet, or WalletConnect." },
      { q: "How much does it cost to back a project?", a: "Every project costs exactly $1 USDC to back." },
    ],
  },
  {
    title: "Backing Projects",
    questions: [
      {
        q: "How does backing work?",
        a: "Browse projects, click 'Back for $1', confirm the transaction with your wallet.",
      },
      { q: "What do I get for backing?", a: "You receive a unique NFT badge and can vote on project milestones." },
      { q: "Can I back multiple projects?", a: "Yes! Back as many projects as you want, $1 each." },
    ],
  },
  {
    title: "Creating Projects",
    questions: [
      { q: "How do I submit a project?", a: "Click 'Submit Project' in the nav and fill out the 4-step form." },
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

export default function HelpPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="container mx-auto py-12 max-w-5xl flex-1">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent/20 mb-4">
            <HelpCircle className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Need Help?</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Questions answered. Problems solved. No corporate jargon.
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input type="search" placeholder="Search for help articles..." className="pl-12 h-14 text-lg" />
            </div>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {faqCategories.map((category) => (
            <div key={category.title}>
              <h2 className="text-2xl font-bold mb-6">{category.title}</h2>
              <div className="space-y-4">
                {category.questions.map((item, idx) => (
                  <Card key={idx} className="border-accent/30">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2">{item.q}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Card className="mt-16 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30">
          <CardContent className="p-12 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent/20 mb-4">
              <MessageCircle className="h-8 w-8 text-accent" />
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
