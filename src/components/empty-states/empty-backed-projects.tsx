import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import Link from "next/link"

export function EmptyBackedProjects() {
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
          <rect
            x="60"
            y="60"
            width="80"
            height="80"
            rx="8"
            stroke="oklch(0.55 0.22 25)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <path
            d="M100 85C100 85 90 75 80 75C70 75 65 82 65 90C65 105 100 125 100 125C100 125 135 105 135 90C135 82 130 75 120 75C110 75 100 85 100 85Z"
            fill="oklch(0.55 0.22 25 / 0.2)"
            stroke="oklch(0.55 0.22 25)"
            strokeWidth="2"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-bold mb-2">You haven't backed anything</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        Got $1? Find a builder who deserves it. Support the underdogs.
      </p>
      <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
        <Link href="/discover">
          <Heart className="mr-2 h-4 w-4" />
          Find Projects
        </Link>
      </Button>
    </div>
  )
}
