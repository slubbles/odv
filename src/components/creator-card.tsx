import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, FolderOpen, Target, Users } from "lucide-react"

interface CreatorCardProps {
  id: string
  name: string
  title: string
  avatar: string
  totalRaised: number
  projects: number
  successRate: number
  followers: number
}

export function CreatorCard({
  id,
  name,
  title,
  avatar,
  totalRaised,
  projects,
  successRate,
  followers,
}: CreatorCardProps) {
  return (
    <Card className="overflow-hidden hover:border-accent/50 transition-all">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <img
            src={avatar || "/placeholder.svg"}
            alt={name}
            className="h-16 w-16 rounded-full object-cover ring-2 ring-border"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold truncate">{name}</h3>
            <p className="text-sm text-muted-foreground truncate">{title}</p>
            <div className="flex items-center gap-1 mt-2">
              <Users className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{followers} followers</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="h-3 w-3 text-accent" />
              <p className="text-xs text-muted-foreground">Raised</p>
            </div>
            <p className="text-sm font-semibold">${(totalRaised / 1000).toFixed(0)}K</p>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <FolderOpen className="h-3 w-3 text-accent" />
              <p className="text-xs text-muted-foreground">Projects</p>
            </div>
            <p className="text-sm font-semibold">{projects}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Target className="h-3 w-3 text-accent" />
              <p className="text-xs text-muted-foreground">Success</p>
            </div>
            <p className="text-sm font-semibold">{successRate}%</p>
          </div>
        </div>

        <Button variant="outline" className="w-full bg-transparent" asChild>
          <Link href={`/creator/${id}`}>View Profile</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
