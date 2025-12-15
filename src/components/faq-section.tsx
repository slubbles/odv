import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function FaqSection() {
  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about backing and building on ODV.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full mb-12">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left">What exactly is ODV?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              ODV is a decentralized crowdfunding platform where every contribution is exactly $1. 
              We believe in the power of the crowd—thousands of people giving a little adds up to a lot. 
              No equity, no complex contracts, just pure support for ideas you love.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left">Is my money safe?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes. We use smart contracts on the Solana blockchain to hold funds in escrow. 
              Creators only receive funds when they hit their funding goal. 
              If a project doesn't reach its goal by the deadline, you get your $1 back automatically.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left">How does the milestone system work?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              To protect backers, funds are released to creators in stages (milestones). 
              Creators must submit proof of progress for each milestone. 
              This ensures they stay accountable and deliver on their promises throughout the project's lifecycle.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left">Can I back multiple projects?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes! You can back as many projects as you want. 
              However, each project is limited to $1 per wallet to democratize funding and prevent "whales" from dominating. 
              It's about community support, not buying influence.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-left">I have an idea. How do I start?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              It's simple! Connect your Solana wallet, click "Submit Project," and tell us about your idea. 
              Set a goal, define your milestones, and share your project link with the world. 
              It takes less than 5 minutes to get started.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="text-center bg-card border rounded-2xl p-8 sm:p-12 shadow-sm">
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            The best way to understand ODV is to experience it. 
            Explore live projects or join our community of builders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/discover">
                Explore Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/help">Visit Help Center</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
