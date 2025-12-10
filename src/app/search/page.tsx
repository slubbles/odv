"use client"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Search, Loader2, X } from "lucide-react"
import { ProjectCard } from "@/components/project-card"

interface Project {
  id: string
  title: string
  tagline: string
  description: string
  category: string
  image_url: string
  raised: number
  goal: number
  backers_count: number
  deadline: string
  status: string
  creator_name: string
  creator_avatar: string
  creator_wallet?: string
  campaign_id?: number
}

const CATEGORIES = ["Technology", "Art", "Music", "Film", "Games", "Design", "Food", "Publishing"]

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const initialQuery = searchParams.get("q") || ""
  const initialCategory = searchParams.get("category") || ""
  
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory)
  const [results, setResults] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  const searchProjects = useCallback(async (searchQuery: string, searchCategory: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set("search", searchQuery)
      if (searchCategory) params.set("category", searchCategory)
      params.set("status", "active")
      
      const response = await fetch(`/api/projects?${params.toString()}`)
      const data = await response.json()
      
      setResults(data.projects || [])
      setTotalCount(data.total || data.projects?.length || 0)
    } catch (error) {
      console.error("Search failed:", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial search on mount
  useEffect(() => {
    searchProjects(initialQuery, initialCategory)
  }, [initialQuery, initialCategory, searchProjects])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Update URL
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (category) params.set("category", category)
    router.push(`/search?${params.toString()}`)
    
    searchProjects(query, category)
  }

  const handleCategoryClick = (cat: string) => {
    const newCategory = category === cat ? "" : cat
    setCategory(newCategory)
    
    // Update URL and search
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (newCategory) params.set("category", newCategory)
    router.push(`/search?${params.toString()}`)
    
    searchProjects(query, newCategory)
  }

  const clearSearch = () => {
    setQuery("")
    setCategory("")
    router.push("/search")
    searchProjects("", "")
  }

  // Calculate days left for each project
  const resultsWithDaysLeft = results.map(p => {
    const deadline = new Date(p.deadline)
    const now = new Date()
    const daysLeft = Math.max(0, Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    return { ...p, daysLeft }
  })

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 pb-24 md:pb-8">
        <div className="mb-6 sm:mb-8">
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search projects..." 
              className="pl-12 pr-12 h-14 text-lg" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {(query || category) && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </form>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {loading ? (
                "Searching..."
              ) : query || category ? (
                `Found ${totalCount} project${totalCount !== 1 ? 's' : ''}${query ? ` matching "${query}"` : ''}${category ? ` in ${category}` : ''}`
              ) : (
                `Showing ${totalCount} active projects`
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <Badge 
            className={`cursor-pointer ${!category ? 'bg-accent text-white border-accent' : 'bg-muted text-foreground border-border hover:border-accent/50'}`}
            onClick={() => handleCategoryClick("")}
          >
            All Results
          </Badge>
          {CATEGORIES.map((cat) => (
            <Badge 
              key={cat}
              className={`cursor-pointer ${category === cat ? 'bg-accent text-white border-accent' : 'bg-muted text-foreground border-border hover:border-accent/50'}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : results.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resultsWithDaysLeft.map((project) => (
              <ProjectCard 
                key={project.id} 
                id={project.id}
                title={project.title}
                description={project.tagline || project.description}
                creator={{ 
                  name: project.creator_name || "Anonymous", 
                  avatar: project.creator_avatar || "/placeholder.svg" 
                }}
                category={project.category}
                image={project.image_url || "/placeholder.svg"}
                raised={project.raised}
                goal={project.goal}
                backers={project.backers_count || 0}
                daysLeft={project.daysLeft}
                creatorWallet={project.creator_wallet}
                campaignId={project.campaign_id}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6">
              {query || category 
                ? "Try adjusting your search or filters"
                : "There are no active projects at the moment"}
            </p>
            <Button variant="outline" onClick={clearSearch}>
              Clear Search
            </Button>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  )
}
