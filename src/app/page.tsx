"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { Footer } from "@/components/footer"
import { FaqSection } from "@/components/faq-section"
import dynamic from "next/dynamic"

const Hero3DScene = dynamic(() => import("@/components/hero-3d-scene").then((mod) => mod.Hero3DScene), {
  ssr: false,
  loading: () => <div className="absolute inset-0 opacity-30 bg-gradient-to-b from-accent/5 to-transparent" />,
})

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main id="main-content" className="flex-1">
        <section
          className="relative container mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-32 overflow-hidden"
          aria-labelledby="hero-heading"
        >
          <Hero3DScene />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at top, rgba(232, 76, 39, 0.08) 0%, transparent 60%)",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <Badge className="mb-4 sm:mb-6 bg-accent/20 text-accent-foreground border-accent/30 text-xs sm:text-sm">
              Launch your project in 10 minutes
            </Badge>
            <h1
              id="hero-heading"
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-balance leading-tight"
            >
              Get funded by{" "}
              <span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
                1,000 believers
              </span>
              {" "}for $1 each
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 sm:mb-8 text-balance max-w-3xl mx-auto">
              Skip the VC circus. Launch your project, set milestones, get $1 backers. Ship what you promised, unlock your funds.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto"
                asChild
              >
                <Link href="/discover">
                  Find Projects
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent" asChild>
                <Link href="/submit">Launch Your Project</Link>
              </Button>
            </div>
          </div>


        </section>

        {/* How It Works Section */}
        <section
          className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 pb-24 md:pb-16"
          aria-labelledby="how-it-works-heading"
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 id="how-it-works-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                How This Works
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Two paths. Same goal. Building cool stuff.
              </p>
            </div>

            {/* For Backers */}
            <div className="mb-16 sm:mb-20">
              <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
                Got $1? You're In.
              </h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  {
                    step: 1,
                    title: "Find Something Cool",
                    desc: "Browse projects. No BS."
                  },
                  {
                    step: 2,
                    title: "Drop Your Dollar",
                    desc: "One buck in USDC. Done."
                  },
                  {
                    step: 3,
                    title: "Get Your Badge",
                    desc: "NFT proof you were first."
                  },
                  {
                    step: 4,
                    title: "Vote on Milestones",
                    desc: "Make sure they ship."
                  }
                ].map((item) => (
                  <Card key={item.step} className="text-center bg-card border-accent/20 hover:border-accent transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(201,64,50,0.3)] group">
                    <CardContent className="p-8 flex flex-col items-center h-full">
                      <div className="h-14 w-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center mb-6 text-2xl font-bold shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform duration-300">
                        {item.step}
                      </div>
                      <h4 className="font-bold text-lg mb-3 group-hover:text-accent transition-colors">{item.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* For Creators */}
            <div className="mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
                Built Something? Show Us.
              </h3>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {[
                  {
                    step: 1,
                    title: "Submit Your Thing",
                    desc: "Tell us what you're building. No pitch decks, just code and vision."
                  },
                  {
                    step: 2,
                    title: "Pass the Vibe Check",
                    desc: "Community votes on your project. If they like it, you're in."
                  },
                  {
                    step: 3,
                    title: "Go Live 24hrs",
                    desc: "The clock starts. You have 24 hours to hit your funding goal."
                  },
                  {
                    step: 4,
                    title: "Ship or Die",
                    desc: "Hit your milestones to unlock funds. Don't ghost your backers."
                  }
                ].map((item) => (
                  <Card key={item.step} className="bg-card border-accent/20 hover:border-accent transition-all duration-300 group overflow-hidden">
                    <CardContent className="p-6 flex items-start gap-6">
                      <div className="shrink-0 h-12 w-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-xl font-bold border border-accent/20 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                        {item.step}
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">{item.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="text-center mt-12">
              <Button size="lg" variant="outline" className="bg-transparent" asChild>
                <Link href="/how-it-works">See How It Works</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 pb-24 md:pb-16"
          aria-labelledby="cta-heading"
        >
          <div className="max-w-4xl mx-auto">
            <Card className="relative overflow-hidden border-accent/30">
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  background: "radial-gradient(ellipse at center, oklch(0.55 0.22 25) 0%, transparent 70%)",
                }}
                aria-hidden="true"
              />
              <CardContent className="relative p-8 sm:p-12 text-center">
                <h2 id="cta-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                  Stop shouting into the void
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
                  Show us what you built. Get seen. Get backed. No gatekeepers. No BS.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto"
                    asChild
                  >
                    <Link href="/submit">
                      I built something
                      <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent w-full sm:w-auto" asChild>
                    <Link href="/discover">See what's building</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <FaqSection />
      </main>

      <Footer />
    </div>
  )
}
