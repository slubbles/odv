import { Flame } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TrendingBadgeProps {
  rank?: number
  className?: string
}

export function TrendingBadge({ rank, className }: TrendingBadgeProps) {
  return (
    <Badge className={`bg-accent text-accent-foreground border-0 ${className}`}>
      <Flame className="mr-1 h-3 w-3" />
      {rank ? `#${rank} Trending` : "Trending"}
    </Badge>
  )
}
