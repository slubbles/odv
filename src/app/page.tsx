"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Trophy, Users, DollarSign, ArrowRight, Loader2 } from "lucide-react"
import { Hero3DScene } from "@/components/hero-3d-scene"
import { ActivityFeed } from "@/components/activity-feed"
import { AnimatedCounter } from "@/components/animated-counter"
import { LiveTicker } from "@/components/live-ticker"
import { RecentlyFundedBanner } from "@/components/recently-funded-banner"
import { Footer } from "@/components/footer"
import { useProjects } from "@/lib/hooks/use-projects"

export default function Home() {
  const { projects, loading, error } = useProjects({
    status: "active",
    sort: "trending",
    limit: 6,
  })

  return (
    <div className="min-h-screen">
      <Header />

      <LiveTicker />

      <main id="main-content">
        <section
          className="relative container mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-32 overflow-hidden"
          aria-labelledby="hero-heading"
        >
          <Hero3DScene />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at top, oklch(0.55 0.22 25 / 0.08) 0%, transparent 60%)",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <Badge className="mb-4 sm:mb-6 bg-accent/20 text-accent-foreground border-accent/30 text-xs sm:text-sm">
              47K+ builders and backers
            </Badge>
            <h1
              id="hero-heading"
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-balance leading-tight"
            >
              Shark Tank if{" "}
              <span className="bg-gradient-to-r from-[oklch(0.55_0.22_25)] to-[oklch(0.6_0.18_35)] bg-clip-text text-transparent">
                sharks were $1
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 sm:mb-8 text-balance px-4">
              Builders pitch. You back. Everyone wins.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto"
                asChild
              >
                <Link href="/projects">
                  See what's building
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent" asChild>
                <Link href="/submit">I built something</Link>
              </Button>
            </div>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16 max-w-4xl mx-auto px-4"
            role="region"
            aria-label="Platform statistics"
          >
            <Card className="text-center">
              <CardContent className="p-4 sm:p-6">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-accent" aria-hidden="true" />
                <p className="text-2xl sm:text-3xl font-bold mb-1" aria-label="1247 projects backed">
                  <AnimatedCounter end={1247} />
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">projects backed (and counting)</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4 sm:p-6">
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-accent" aria-hidden="true" />
                <p className="text-2xl sm:text-3xl font-bold mb-1" aria-label="2.3 million dollars in bets">
                  $<AnimatedCounter end={2.3} decimals={1} />M
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">in $1 bets</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4 sm:p-6">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-accent" aria-hidden="true" />
                <p className="text-2xl sm:text-3xl font-bold mb-1" aria-label="Over 47,000 builders and backers">
                  <AnimatedCounter end={47000} suffix="+" />
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">builders and backers</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section
          className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 pb-24 md:pb-16"
          aria-labelledby="projects-heading"
        >
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                <div>
                  <h2 id="projects-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">
                    See what's building
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground">Devs who ship</p>
                </div>
                <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent" asChild>
                  <Link href="/projects">
                    Show me all
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>

              <div className="mb-6">
                <RecentlyFundedBanner projectName="Smart Home Energy Monitor" fundedAmount={8500} />
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-accent" />
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground mb-4">Failed to load projects</p>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No active projects yet. Be the first to launch!</p>
                  <Button className="mt-4" asChild>
                    <Link href="/submit">Submit Your Project</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6" role="list" aria-label="Featured projects">
                  {projects.map((project) => {
                    const daysLeft = project.deadline
                      ? Math.max(0, Math.ceil((new Date(project.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                      : 0

                    return (
                      <div role="listitem" key={project.id}>
                        <ProjectCard
                          id={project.id}
                          title={project.title}
                          description={project.description}
                          creator={{
                            name: project.creator_name || "Anonymous",
                            avatar: project.creator_avatar || "/default-avatar.png",
                          }}
                          category={project.category}
                          image={project.image_url || "/placeholder-project.png"}
                          raised={project.raised}
                          goal={project.goal}
                          backers={project.backers_count}
                          daysLeft={daysLeft}
                          trending={project.status === "active"}
                        />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="lg:col-span-1" role="complementary" aria-label="Recent activity">
              <ActivityFeed />
            </div>
          </div>
        </section>

        <section
          className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 mb-12 sm:mb-16 pb-24 md:pb-16"
          aria-labelledby="cta-heading"
        >
          <Card className="relative overflow-hidden border-accent/50">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background: "linear-gradient(135deg, oklch(0.55_0.22_25) 0%, oklch(0.6_0.18_35) 100%)",
              }}
              aria-hidden="true"
            />
            <CardContent className="relative p-6 sm:p-12 text-center">
              <Trophy className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-accent" aria-hidden="true" />
              <h2 id="cta-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                Stop shouting into the void
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6 max-w-2xl mx-auto px-4">
                Show us what you built. Get seen. Get backed.
              </p>
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
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  )
}
