"use client"

import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Clock, Heart, MessageCircle, CheckCircle, Circle, Award, TrendingUp, Loader2, AlertCircle } from "lucide-react"
import { SocialShare } from "@/components/social-share"
import { useProject } from "@/lib/hooks/use-projects"
import { UpdatesList } from "@/components/project/updates-list"

function calculateDaysLeft(deadline: string | null): number {
  if (!deadline) return 0
  const now = new Date().getTime()
  const end = new Date(deadline).getTime()
  const diff = end - now
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

const milestones = [
  {
    id: 1,
    title: "Platform MVP Launch",
    description: "Deploy the core platform with AI recipe recommendations and user profiles.",
    targetDate: "March 2025",
    progress: 100,
    status: "completed" as const,
    votes: { for: 412, against: 11 },
  },
  {
    id: 2,
    title: "Recipe Database Expansion",
    description: "Add 5,000+ new recipes covering global cuisines and dietary preferences.",
    targetDate: "April 2025",
    progress: 65,
    status: "in-progress" as const,
    votes: { for: 389, against: 34 },
  },
  {
    id: 3,
    title: "Mobile App Development",
    description: "Build native iOS and Android applications with offline recipe access.",
    targetDate: "June 2025",
    progress: 20,
    status: "pending" as const,
    votes: { for: 356, against: 67 },
  },
  {
    id: 4,
    title: "AI Personalization Engine v2",
    description: "Enhanced AI with meal planning, nutritional analysis, and shopping lists.",
    targetDate: "August 2025",
    progress: 0,
    status: "pending" as const,
    votes: { for: 301, against: 122 },
  },
]

const rewardTiers = [
  {
    id: 1,
    name: "Early Backer",
    amount: 1,
    nftBadge: "Bronze Founder",
    benefits: ["Digital thank you card", "Bronze NFT Founder Badge", "Platform updates newsletter"],
    backers: 234,
  },
  {
    id: 2,
    name: "Bronze Supporter",
    amount: 5,
    nftBadge: "Bronze Supporter",
    benefits: ["Everything in Early Backer", "Premium recipe access (3 months)", "Name in credits"],
    backers: 128,
  },
  {
    id: 3,
    name: "Silver Supporter",
    amount: 10,
    nftBadge: "Silver Supporter",
    benefits: [
      "Everything in Bronze",
      "Premium recipe access (6 months)",
      "Early feature access",
      "Exclusive cooking webinars",
    ],
    backers: 45,
  },
  {
    id: 4,
    name: "Gold Supporter",
    amount: 25,
    nftBadge: "Gold Supporter",
    benefits: [
      "Everything in Silver",
      "Lifetime premium access",
      "Gold NFT Badge",
      "1-on-1 cooking consultation",
      "Custom recipe development",
    ],
    backers: 16,
  },
]

const comments = [
  {
    id: 1,
    user: { name: "Michael Brown", avatar: "/placeholder.svg?key=p2zkq" },
    content: "This looks amazing! I love how the AI learns from my preferences. Can't wait to see the mobile app!",
    timestamp: "2 hours ago",
    likes: 12,
  },
  {
    id: 2,
    user: { name: "Lisa Anderson", avatar: "/placeholder.svg?key=82ons" },
    content:
      "Just backed at the Gold level. The custom recipe feature is exactly what I need for my dietary restrictions.",
    timestamp: "5 hours ago",
    likes: 8,
  },
  {
    id: 3,
    user: { name: "David Kim", avatar: "/placeholder.svg?key=0fhm8" },
    content: "Great to see milestone 2 progressing well. Will there be integration with smart kitchen devices?",
    timestamp: "1 day ago",
    likes: 15,
  },
  {
    id: 4,
    user: { name: "Emma Wilson", avatar: "/placeholder.svg?key=cqwgw" },
    content: "The AI recommendations are spot on! Discovered so many new recipes I love.",
    timestamp: "2 days ago",
    likes: 6,
  },
]

export default function ProjectDetailPage() {
  const params = useParams()
  const { project, loading, error } = useProject(params.id as string)

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container py-12 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-accent" />
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container py-12">
          <Card className="border-red-500/30 bg-red-500/10">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
              <p className="text-muted-foreground mb-4">
                {error || "The project you're looking for doesn't exist or has been removed."}
              </p>
              <Button asChild variant="outline">
                <a href="/discover">Browse Projects</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const progress = (project.raised / project.goal) * 100
  const daysLeft = calculateDaysLeft(project.deadline)
  const milestones = project.milestones || []

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary">{project.category}</Badge>
                <div className="flex items-center gap-2 ml-auto">
                  <Button size="icon" variant="outline">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <SocialShare title={project.title} description={project.description} />
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{project.title}</h1>

              <p className="text-lg text-muted-foreground mb-6">{project.description}</p>

              {/* Creator Info */}
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={project.creator_avatar || "/placeholder.svg"} />
                  <AvatarFallback>{project.creator_name?.[0] || "?"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{project.creator_name || "Anonymous Creator"}</p>
                  <p className="text-sm text-muted-foreground truncate max-w-xs">
                    {project.creator_wallet?.slice(0, 8)}...{project.creator_wallet?.slice(-6)}
                  </p>
                </div>
              </div>
            </div>

            {/* Video/Image */}
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              {project.video_url ? (
                <iframe
                  src={project.video_url}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img
                  src={project.image_url || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="description">What's This?</TabsTrigger>
                <TabsTrigger value="milestones">Progress ({milestones.length})</TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
                <TabsTrigger value="backers">Backers ({project.backers_count})</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>The full story</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {project.description}
                    </p>
                    {project.twitter_link || project.github_link || project.website_link ? (
                      <div className="mt-6 pt-6 border-t border-border">
                        <h3 className="text-sm font-semibold mb-3">Links</h3>
                        <div className="flex flex-wrap gap-2">
                          {project.website_link && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={project.website_link} target="_blank" rel="noopener noreferrer">
                                Website
                              </a>
                            </Button>
                          )}
                          {project.github_link && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={project.github_link} target="_blank" rel="noopener noreferrer">
                                GitHub
                              </a>
                            </Button>
                          )}
                          {project.twitter_link && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={project.twitter_link} target="_blank" rel="noopener noreferrer">
                                Twitter
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Who's building this</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={project.creator_avatar || "/placeholder.svg"} />
                        <AvatarFallback>{project.creator_name?.[0] || "?"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">{project.creator_name || "Anonymous Creator"}</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          {project.creator_bio || "Building innovative solutions on the blockchain."}
                        </p>
                        <div className="text-xs text-muted-foreground font-mono">
                          {project.creator_wallet}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="milestones" className="space-y-4 mt-6">
                {milestones.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      No milestones defined yet
                    </CardContent>
                  </Card>
                ) : (
                  milestones.map((milestone: any) => {
                    const milestoneProgress = milestone.status === 'completed' ? 100 : milestone.status === 'in_review' ? 75 : milestone.status === 'active' ? 50 : 0
                    
                    return (
                      <Card key={milestone.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="mt-1">
                              {milestone.status === "completed" ? (
                                <CheckCircle className="h-6 w-6 text-accent" />
                              ) : (
                                <Circle className="h-6 w-6 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <div>
                                  <h3 className="text-xl font-semibold">{milestone.title}</h3>
                                  <p className="text-sm text-accent">{milestone.percentage}% of funding goal</p>
                                </div>
                                <Badge
                                  variant={
                                    milestone.status === "completed"
                                      ? "default"
                                      : milestone.status === "in_review"
                                        ? "secondary"
                                        : "outline"
                                  }
                                >
                                  {milestone.status === "completed"
                                    ? "Completed"
                                    : milestone.status === "in_review"
                                      ? "In Review"
                                      : milestone.status === "active"
                                        ? "Active"
                                        : "Locked"}
                                </Badge>
                              </div>
                              {milestone.description && (
                                <p className="text-muted-foreground mb-3">{milestone.description}</p>
                              )}
                              <p className="text-sm text-muted-foreground mb-4">
                                Deadline: {new Date(milestone.deadline).toLocaleDateString()}
                              </p>

                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Progress</span>
                                  <span>{milestoneProgress}%</span>
                                </div>
                                <Progress value={milestoneProgress} className="h-2" />
                              </div>

                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </TabsContent>

              <TabsContent value="updates" className="space-y-6 mt-6">
                <UpdatesList 
                  projectTitle={project.title}
                  creatorName={project.creator_name || "Anonymous Creator"}
                  creatorAvatar={project.creator_avatar}
                />
              </TabsContent>

              <TabsContent value="backers" className="space-y-4 mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Avatar>
                        <AvatarFallback>You</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <textarea
                          placeholder="Got thoughts? Drop them here..."
                          className="w-full min-h-[100px] bg-muted rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <div className="mt-2 flex justify-end">
                          <Button>Post</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <Avatar>
                          <AvatarImage src={comment.user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{comment.user.name}</span>
                            <span className="text-sm text-muted-foreground">{comment.timestamp}</span>
                          </div>
                          <p className="text-muted-foreground leading-relaxed mb-3">{comment.content}</p>
                          <div className="flex items-center gap-4">
                            <Button size="sm" variant="ghost" className="h-8 px-2">
                              <Heart className="h-4 w-4 mr-1" />
                              {comment.likes}
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 px-2">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="text-center pt-4">
                  <Button variant="outline">Load More Comments</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Funding Stats */}
            <Card className="sticky top-20">
              <CardContent className="p-6 space-y-6">
                <div>
                  <p className="text-3xl font-bold mb-1">${project.raised.toLocaleString()}</p>
                  <p className="text-muted-foreground mb-4">pledged of ${project.goal.toLocaleString()} goal</p>
                  <Progress value={progress} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold">{project.backers_count}</p>
                    <p className="text-sm text-muted-foreground">backers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{project.daysLeft}</p>
                    <p className="text-sm text-muted-foreground">days left</p>
                  </div>
                </div>

                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
                  Back This Project
                </Button>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {daysLeft > 0 ? `${daysLeft} days left` : project.deadline ? 'Campaign ended' : 'No deadline set'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span>{project.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(project.created_at).toLocaleDateString()}</span>
                </div>
                {milestones.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Milestones</span>
                    <span>{milestones.length}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
