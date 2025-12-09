import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Users, Clock, TrendingUp } from "lucide-react"
import { LazyImage } from "@/components/lazy-image"

interface ProjectCardProps {
  id: string
  title: string
  description: string
  creator: {
    name: string
    avatar?: string
  }
  category: string
  image: string
  raised: number
  goal: number
  backers: number
  daysLeft: number
  trending?: boolean
}

export function OptimizedProjectCard({
  id,
  title,
  description,
  creator,
  category,
  image,
  raised,
  goal,
  backers,
  daysLeft,
  trending,
}: ProjectCardProps) {
  const progress = (raised / goal) * 100

  return (
    <Link href={`/project/${id}`} prefetch={false}>
      <Card className="group overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-accent/20 hover:border-accent/50 h-full">
        <div className="aspect-video w-full overflow-hidden bg-muted relative">
          <LazyImage
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {trending && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-accent text-accent-foreground border-0">
                <TrendingUp className="mr-1 h-3 w-3" />
                Trending
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={creator.avatar || "/placeholder.svg"} loading="lazy" />
              <AvatarFallback>{creator.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground truncate">{creator.name}</p>
            </div>
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
          </div>

          <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-accent transition-colors">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{description}</p>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold">${raised.toLocaleString()}</span>
                <span className="text-muted-foreground">of ${goal.toLocaleString()}</span>
              </div>
              <Progress
                value={progress}
                className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-accent [&>div]:to-accent/70 [&>div]:transition-all [&>div]:duration-500"
              />
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{backers} backers</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{daysLeft} days left</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
