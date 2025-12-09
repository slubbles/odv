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
      <CardContent className="p-2 sm:p-3 flex-1 flex flex-col min-w-0">
        <Link href={`/project/${id}`} className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={creator.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xs">{creator.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground truncate">{creator.name}</p>
            </div>
            <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
              {category}
            </Badge>
          </div>

          <h3 className="text-sm sm:text-base font-bold mb-1 line-clamp-1 group-hover:text-accent transition-colors">{title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{description}</p>

          <div className="mt-auto space-y-2">
            <div>
              <div className="flex justify-between text-[10px] sm:text-xs mb-1">
                <span className="font-semibold text-accent">${raised.toLocaleString()}</span>
                <span className="text-muted-foreground">of ${goal.toLocaleString()}</span>
              </div>
              <Progress
                value={progress}
                className="h-1 sm:h-1.5 [&>div]:bg-gradient-to-r [&>div]:from-accent [&>div]:to-accent/70 [&>div]:transition-all [&>div]:duration-500"
              />
            </div>

            <div className="flex items-center justify-between text-[10px] sm:text-[10px] text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{backers} backers</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}</span>
              </div>
            </div>
          </div>
        </Link>
        
        {showBackButton && status === 'active' && (
          <Link href={`/project/${id}`} className="mt-2 sm:mt-3 block">
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-7 sm:h-8 text-xs">
              <Heart className="mr-1.5 h-3 w-3" />
              Fund This Project - $1
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
