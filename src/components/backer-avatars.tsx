import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users } from "lucide-react"

interface BackerAvatarsProps {
  backers: Array<{ name: string; avatar?: string }>
  totalCount: number
}

export function BackerAvatars({ backers, totalCount }: BackerAvatarsProps) {
  const displayBackers = backers.slice(0, 5)
  const remaining = totalCount - displayBackers.length

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {displayBackers.map((backer, index) => (
          <Avatar key={index} className="h-8 w-8 border-2 border-background">
            <AvatarImage src={backer.avatar || "/placeholder.svg"} alt={backer.name} />
            <AvatarFallback>{backer.name[0]}</AvatarFallback>
          </Avatar>
        ))}
        {remaining > 0 && (
          <div className="h-8 w-8 rounded-full border-2 border-background bg-accent flex items-center justify-center text-xs font-semibold text-accent-foreground">
            +{remaining}
          </div>
        )}
      </div>
      <p className="ml-3 text-sm text-muted-foreground">
        <Users className="inline h-4 w-4 mr-1" />
        {totalCount} backers
      </p>
    </div>
  )
}
