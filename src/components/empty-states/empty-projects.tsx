import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Link from "next/link"

export function EmptyProjects() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="mb-8">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-50"
        >
          <circle cx="100" cy="100" r="80" stroke="oklch(0.55 0.22 25)" strokeWidth="2" strokeDasharray="4 4" />
          <path
            d="M70 120L90 100L70 80"
            stroke="oklch(0.55 0.22 25)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M130 120L110 100L130 80"
            stroke="oklch(0.55 0.22 25)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="95" y1="85" x2="105" y2="115" stroke="oklch(0.55 0.22 25)" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold mb-2">Nothing here yet</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        No projects match your search. Try different filters or be the first to build something in this category.
      </p>
      <div className="flex gap-3">
        <Button variant="outline">
          <Search className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href="/submit">I'll build it</Link>
        </Button>
      </div>
    </div>
  )
}
