import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Users, Clock, TrendingUp, Heart } from "lucide-react"

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
  status?: 'active' | 'funded' | 'completed' | 'queue' | 'pending'
  showBackButton?: boolean
}

export function ProjectCard({
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
  status = 'active',
  showBackButton = true,
}: ProjectCardProps) {
  const progress = (raised / goal) * 100

  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live</Badge>
      case 'funded':
        return <Badge className="bg-accent/20 text-accent border-accent/30">Funded</Badge>
      case 'completed':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Completed</Badge>
      case 'queue':
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">In Review</Badge>
      default:
        return null
    }
  }

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-accent/20 hover:border-accent/50 h-full flex flex-row sm:flex-col">
      <Link href={`/project/${id}`} className="w-32 sm:w-full sm:aspect-video relative bg-muted shrink-0 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex gap-2 scale-75 sm:scale-100 origin-top-left">
          {getStatusBadge()}
        </div>
        {trending && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 scale-75 sm:scale-100 origin-top-right">
            <Badge className="bg-accent text-accent-foreground border-0">
              <TrendingUp className="mr-1 h-3 w-3" />
              Trending
            </Badge>
          </div>
        )}
      </Link>
      <CardContent className="p-3 sm:p-6 flex-1 flex flex-col min-w-0">
        <Link href={`/project/${id}`} className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
            <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
              <AvatarImage src={creator.avatar || "/placeholder.svg"} />
              <AvatarFallback>{creator.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{creator.name}</p>
            </div>
            <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 py-0 sm:px-2.5 sm:py-0.5 h-5 sm:h-auto">
              {category}
            </Badge>
          </div>

          <h3 className="text-base sm:text-xl font-semibold mb-1 sm:mb-2 line-clamp-1 sm:line-clamp-2 group-hover:text-accent transition-colors">{title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3 sm:mb-4">{description}</p>

          <div className="mt-auto space-y-2 sm:space-y-3">
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-1 sm:mb-2">
                <span className="font-semibold text-accent">${raised.toLocaleString()}</span>
                <span className="text-muted-foreground">of ${goal.toLocaleString()}</span>
              </div>
              <Progress
                value={progress}
                className="h-1.5 sm:h-2 [&>div]:bg-gradient-to-r [&>div]:from-accent [&>div]:to-accent/70 [&>div]:transition-all [&>div]:duration-500"
              />
            </div>

            <div className="flex items-center justify-between text-[10px] sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{backers} backers</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}</span>
              </div>
            </div>
          </div>
        </Link>
        
        {showBackButton && status === 'active' && (
          <Link href={`/project/${id}`} className="mt-3 sm:mt-4 block">
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-8 sm:h-10 text-xs sm:text-sm">
              <Heart className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Back This Project - $1
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
