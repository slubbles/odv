"use client"

import { useState, useEffect } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Search, X, AlertCircle } from "lucide-react"
import { Footer } from "@/components/footer"
import { useProjects } from "@/lib/hooks/use-projects"
import Link from "next/link"

const categories = ["all", "Technology", "Art & Design", "Gaming", "Social Impact", "Food & Beverage", "Innovation", "Health & Wellness"]

// Debounce hook for search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export function DiscoverClient() {
  const { publicKey, connected } = useWallet()
  const { connection } = useConnection()
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearch = useDebounce(searchQuery, 300)
  const [sortBy, setSortBy] = useState("trending")
  const [status, setStatus] = useState("all")
  const [page, setPage] = useState(1)
  const [now, setNow] = useState<number | null>(null)
  const [balance, setBalance] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
  }, [])

  // Check if first-time user needs onboarding
  useEffect(() => {
    const shouldShowOnboarding = localStorage.getItem('odv_show_backer_onboarding')
    if (shouldShowOnboarding === 'true' && connected) {
      localStorage.removeItem('odv_show_backer_onboarding')
      router.push('/onboarding/backer')
    }
  }, [connected, router])

  // Check wallet balance
  useEffect(() => {
    async function checkBalance() {
      if (connected && publicKey) {
        try {
          const bal = await connection.getBalance(publicKey)
          setBalance(bal / 1e9) // Convert lamports to SOL
        } catch (error) {
          console.error('Error fetching balance:', error)
        }
      } else {
        setBalance(null)
      }
    }
    checkBalance()
  }, [connected, publicKey, connection])

  const { projects, loading, error, pagination } = useProjects({
    category: selectedCategory,
    status: status,
    search: debouncedSearch,
    sort: sortBy,
    page,
    limit: 12
  })

  const clearFilters = () => {
    setSelectedCategory("all")
    setSearchQuery("")
    setSortBy("trending")
    setStatus("all")
    setPage(1)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 pb-24 md:pb-12">
        {/* Hero Section */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            The next big thing isn't on TechCrunch
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            It's right here. Built by people like you. Find it. Back it with $1.
          </p>
        </div>

        {/* Zero Balance Alert */}
        {connected && balance !== null && balance === 0 && (
          <Alert className="mb-6 border-yellow-500/30 bg-yellow-500/10">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertTitle className="text-yellow-700 dark:text-yellow-400">Need Test USDC?</AlertTitle>
            <AlertDescription className="text-yellow-700/90 dark:text-yellow-400/90">
              You need USDC to back projects.{" "}
              <Link href="/faucet" className="underline font-medium hover:text-yellow-600 dark:hover:text-yellow-300">
                Get 100 test USDC here
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Search & Filters */}
        <div className="mb-6 sm:mb-8 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-10 pr-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
            <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1); }}>
              <SelectTrigger className="w-[120px] sm:w-[140px] flex-shrink-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="funded">Funded</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => { setSortBy(value); setPage(1); }}>
              <SelectTrigger className="w-[120px] sm:w-[140px] flex-shrink-0">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="ending">Ending Soon</SelectItem>
                <SelectItem value="funded">Most Funded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8 sm:mb-12 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              className={
                selectedCategory === category
                  ? "bg-accent text-accent-foreground hover:bg-accent/90 cursor-pointer text-xs sm:text-sm"
                  : "cursor-pointer text-xs sm:text-sm hover:bg-secondary/80"
              }
              onClick={() => {
                setSelectedCategory(category)
                setPage(1)
              }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Badge>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">
              {loading ? "Loading..." : `${pagination.total} projects`}
            </h2>
            {pagination.totalPages > 1 && (
              <p className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </p>
            )}
          </div>

          {error && (
            <div className="text-center py-12 text-red-400">
              <p>{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          )}

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[200px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
              <div className="flex justify-center mb-4">
                <Search className="h-12 w-12 text-muted-foreground/50" />
              </div>
              <p className="text-lg font-medium mb-2">No projects found</p>
              <p className="text-sm mb-6">We couldn't find any projects matching your criteria.</p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {projects.map((project: any) => {
                const daysLeft = project.deadline && now
                  ? Math.max(0, Math.ceil((new Date(project.deadline).getTime() - now) / (1000 * 60 * 60 * 24)))
                  : 0;

                return (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    title={project.title}
                    description={project.description || project.tagline}
                    creator={{
                      name: project.creator_name || 'Anonymous',
                      avatar: project.creator_avatar
                    }}
                    category={project.category}
                    image={project.image_url}
                    raised={project.raised}
                    goal={project.goal}
                    backers={project.backers_count}
                    daysLeft={daysLeft}
                    trending={project.backers_count > 50}
                    status={project.status}
                    showBackButton={true}
                    creatorWallet={project.creator_wallet}
                    campaignId={project.campaign_id}
                    onSuccess={() => {
                      window.location.reload()
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8 sm:mt-12">
            <Button
              variant="outline"
              className="bg-transparent"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground px-4">
              {page} / {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              className="bg-transparent"
              disabled={page === pagination.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
