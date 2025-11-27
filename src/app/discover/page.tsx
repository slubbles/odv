"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, SlidersHorizontal, TrendingUp, Star, Clock, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { useProjects } from "@/lib/hooks/use-projects"

const categories = ["all", "Technology", "Art & Design", "Gaming", "Social Impact", "Food & Beverage", "Innovation", "Health & Wellness"]

export default function DiscoverPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("trending")
  const [page, setPage] = useState(1)

  const { projects, loading, error, pagination } = useProjects({
    category: selectedCategory,
    status: "active",
    search: searchQuery,
    sort: sortBy,
    page,
    limit: 12
  })
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

        {/* Search & Filters */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search projects..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-md border border-input bg-background hover:bg-accent/10 transition-colors cursor-pointer"
          >
            <option value="trending">Trending</option>
            <option value="newest">Newest</option>
            <option value="ending">Ending Soon</option>
            <option value="funded">Most Funded</option>
          </select>
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

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <Card className="border-accent/30">
            <CardContent className="p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold">1,247</p>
                <p className="text-xs sm:text-sm text-muted-foreground">projects currently building</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-accent/30">
            <CardContent className="p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Star className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold">892</p>
                <p className="text-xs sm:text-sm text-muted-foreground">made it</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-accent/30">
            <CardContent className="p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold">156</p>
                <p className="text-xs sm:text-sm text-muted-foreground">almost there (hours left)</p>
              </div>
            </CardContent>
          </Card>
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
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">No projects found</p>
              <p className="text-sm">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {projects.map((project: any) => (
                <ProjectCard key={project.id} {...project} />
              ))}
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
