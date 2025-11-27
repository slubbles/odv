import { Button } from "@/components/ui/button"
import { Award } from "lucide-react"
import Link from "next/link"

export function EmptyNFTs() {
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
            x="50"
            y="50"
            width="100"
            height="100"
            rx="8"
            stroke="oklch(0.55 0.22 25)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <polygon
            points="100,70 110,90 132,93 116,108 120,130 100,119 80,130 84,108 68,93 90,90"
            fill="oklch(0.55 0.22 25 / 0.2)"
            stroke="oklch(0.55 0.22 25)"
            strokeWidth="2"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-bold mb-2">No badges yet</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        Back a project, earn an NFT badge. Proof you believed before it was cool.
      </p>
      <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
        <Link href="/projects">
          <Award className="mr-2 h-4 w-4" />
          Start Backing
        </Link>
      </Button>
    </div>
  )
}
