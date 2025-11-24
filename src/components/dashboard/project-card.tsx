import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

interface ProjectCardProps {
    title: string
    description: string
    status: "In Progress" | "Launched" | "Funding"
    raised: number
    goal: number
    backedAmount?: number
    imageUrl?: string
    creatorName: string
    creatorAvatar?: string
}

export function ProjectCard({
    title,
    description,
    status,
    raised,
    goal,
    backedAmount,
    imageUrl,
    creatorName,
    creatorAvatar
}: ProjectCardProps) {
    const progress = Math.min((raised / goal) * 100, 100)

    return (
        <TooltipProvider>
            <Card className="w-full overflow-hidden transition-all hover:shadow-md group">
                <div className="aspect-video w-full bg-muted relative overflow-hidden">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={title}
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground bg-muted/50">
                            No Image
                        </div>
                    )}
                    <Badge className="absolute top-2 right-2" variant={status === "Launched" ? "default" : "secondary"}>
                        {status}
                    </Badge>
                </div>
                <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <HoverCard>
                            <HoverCardTrigger asChild>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={creatorAvatar} alt={creatorName} />
                                        <AvatarFallback>{creatorName[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">{creatorName}</span>
                                </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                                <div className="flex justify-between space-x-4">
                                    <Avatar>
                                        <AvatarImage src={creatorAvatar} />
                                        <AvatarFallback>{creatorName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-semibold">{creatorName}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Project Creator
                                        </p>
                                    </div>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    </div>
                    <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">{title}</CardTitle>
                    <CardDescription className="line-clamp-2">{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">${raised.toLocaleString()} raised</span>
                            <span className="text-muted-foreground">of ${goal.toLocaleString()}</span>
                        </div>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="cursor-help">
                                    <Progress value={progress} className="h-2" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{progress.toFixed(1)}% funded</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    {backedAmount && (
                        <div className="mt-4 p-3 bg-secondary/50 rounded-lg border border-secondary">
                            <p className="text-sm font-medium text-muted-foreground">Your Investment</p>
                            <p className="text-2xl font-bold text-primary">${backedAmount}</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full group-hover:border-primary/50 group-hover:bg-primary/5">
                        View Details <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
        </TooltipProvider>
    )
}
