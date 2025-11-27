import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function EmptySearch() {
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
          <circle cx="85" cy="85" r="40" stroke="oklch(0.55 0.22 25)" strokeWidth="3" />
          <path d="M115 115L145 145" stroke="oklch(0.55 0.22 25)" strokeWidth="3" strokeLinecap="round" />
          <path d="M70 85H100M85 70V100" stroke="oklch(0.55 0.22 25)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold mb-2">No results found</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        Couldn't find what you're looking for. Try different keywords or browse all projects.
      </p>
      <Button variant="outline">
        <Search className="mr-2 h-4 w-4" />
        Clear Search
      </Button>
    </div>
  )
}
