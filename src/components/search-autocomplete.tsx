"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search, TrendingUp } from "lucide-react"
import Link from "next/link"

const suggestions = [
  { id: 1, title: "AI Recipe App", category: "Technology", type: "project" },
  { id: 2, title: "Pixel Art Game", category: "Gaming", type: "project" },
  { id: 3, title: "Sustainable Fashion", category: "Fashion", type: "project" },
  { id: 4, title: "Sarah Johnson", type: "creator" },
  { id: 5, title: "Mike Chen", type: "creator" },
]

const trending = ["AI", "Gaming", "Sustainability", "Education"]

export function SearchAutocomplete() {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions)

  useEffect(() => {
    if (query.length > 0) {
      const filtered = suggestions.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          (item.category && item.category.toLowerCase().includes(query.toLowerCase())),
      )
      setFilteredSuggestions(filtered)
      setIsOpen(true)
    } else {
      setFilteredSuggestions(suggestions)
      setIsOpen(false)
    }
  }, [query])

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects or creators..."
          className="pl-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length === 0 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
      </div>

      {isOpen && (
        <Card className="absolute top-full mt-2 w-full p-4 z-50">
          {query.length === 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-accent" />
                <span className="text-sm font-semibold">Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {trending.map((term) => (
                  <button
                    key={term}
                    className="px-3 py-1 rounded-full bg-muted hover:bg-accent/20 text-sm transition-colors"
                    onClick={() => setQuery(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            {filteredSuggestions.slice(0, 5).map((item) => (
              <Link
                key={item.id}
                href={item.type === "project" ? `/project/${item.id}` : `/creator/${item.id}`}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  {item.category && <p className="text-sm text-muted-foreground">{item.category}</p>}
                </div>
                <span className="text-xs text-muted-foreground capitalize">{item.type}</span>
              </Link>
            ))}
          </div>

          {filteredSuggestions.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No results found</p>
          )}
        </Card>
      )}
    </div>
  )
}
