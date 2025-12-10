"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Clock, Heart, MessageCircle, CheckCircle, Circle, Award, TrendingUp, Loader2, AlertCircle, ArrowLeft } from "lucide-react"
import { SocialShare } from "@/components/social-share"
import { useProject } from "@/lib/hooks/use-projects"
import { UpdatesList } from "@/components/project/updates-list"
import { BackProjectButton } from "@/components/back-project-button"
import { CommentsList } from "@/components/comments-list"

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

export default function ProjectDetailPage() {
  const params = useParams()
  const { project, loading, error, refetch } = useProject(params.id as string)

  // Force re-render when project data changes
  const handleBackingSuccess = () => {
    console.log('[ProjectPage] Backing successful, refetching project data')
    refetch()
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container py-12 flex items-center justify-center flex-1">
          <Loader2 className="h-12 w-12 animate-spin text-accent" />
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container py-12 flex-1">
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
        <Footer />
      </div>
    )
  }

  const progress = (project.raised / project.goal) * 100
  const daysLeft = calculateDaysLeft(project.deadline)
  const milestones = project.milestones || []

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <div className="container px-4 sm:px-6 py-8 flex-1 pb-24 md:pb-12">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="-ml-2 text-muted-foreground hover:text-foreground">
            <Link href="/discover">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column - Visuals & Tabs */}
          <div className="lg:col-span-7 space-y-8">
            {/* Video/Image */}
            <div className="aspect-video bg-muted rounded-xl overflow-hidden border border-border shadow-sm">
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
            <Tabs defaultValue="story" className="w-full">
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-border">
                <TabsList className="w-full justify-start min-w-max sm:min-w-0 bg-transparent p-0 h-auto">
                  <TabsTrigger 
                    value="story" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                  >
                    Story
                  </TabsTrigger>
                  <TabsTrigger 
                    value="milestones" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                  >
                    Milestones ({milestones.length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="updates" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                  >
                    Updates
                  </TabsTrigger>
                  <TabsTrigger 
                    value="comments" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                  >
                    Comments ({project.backers_count})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="story" className="space-y-6 mt-6">
                <Card className="border-none shadow-none bg-transparent">
                  <CardContent className="p-0 prose prose-invert max-w-none">
                    <h3 className="text-xl font-semibold mb-4">About this project</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {project.description}
                    </p>
                    
                    {/* Creator Bio Section */}
                    <div className="mt-8 pt-8 border-t border-border">
                      <h3 className="text-lg font-semibold mb-4">Meet the Creator</h3>
                      <div className="flex items-start gap-4 bg-muted/30 p-6 rounded-lg">
                        <Avatar className="h-16 w-16 border border-border">
                          <AvatarImage src={project.creator_avatar || "/placeholder.svg"} />
                          <AvatarFallback>{project.creator_name?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="text-base font-bold mb-1">{project.creator_name || "Anonymous Creator"}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                            {project.creator_bio || "Building innovative solutions on the blockchain."}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {project.website_link && (
                              <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                                <a href={project.website_link} target="_blank" rel="noopener noreferrer">Website</a>
                              </Button>
                            )}
                            {project.twitter_link && (
                              <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                                <a href={project.twitter_link} target="_blank" rel="noopener noreferrer">Twitter</a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="milestones" className="space-y-4 mt-6">
                {milestones.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
                    No milestones defined yet
                  </div>
                ) : (
                  milestones.map((milestone: any) => {
                    const milestoneProgress = milestone.status === 'completed' ? 100 : milestone.status === 'in_review' ? 75 : milestone.status === 'active' ? 50 : 0

                    return (
                      <Card key={milestone.id} className="overflow-hidden">
                        <div className={`h-1 w-full ${
                          milestone.status === 'completed' ? 'bg-green-500' : 
                          milestone.status === 'active' ? 'bg-blue-500' : 'bg-muted'
                        }`} />
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="mt-1">
                              {milestone.status === "completed" ? (
                                <CheckCircle className="h-6 w-6 text-green-500" />
                              ) : (
                                <Circle className="h-6 w-6 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <div>
                                  <h3 className="text-lg font-semibold">{milestone.title}</h3>
                                  <p className="text-sm text-muted-foreground">Target: {new Date(milestone.deadline).toLocaleDateString()}</p>
                                </div>
                                <Badge
                                  variant={
                                    milestone.status === "completed" ? "default" : 
                                    milestone.status === "active" ? "secondary" : "outline"
                                  }
                                  className={milestone.status === "completed" ? "bg-green-500 hover:bg-green-600" : ""}
                                >
                                  {milestone.status === "completed" ? "Completed" : 
                                   milestone.status === "in_review" ? "In Review" : 
                                   milestone.status === "active" ? "In Progress" : "Locked"}
                                </Badge>
                              </div>
                              {milestone.description && (
                                <p className="text-muted-foreground mb-4 text-sm">{milestone.description}</p>
                              )}
                              <div className="space-y-1.5">
                                <div className="flex justify-between text-xs text-muted-foreground">
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

              <TabsContent value="updates" className="mt-6">
                <UpdatesList
                  projectTitle={project.title}
                  creatorName={project.creator_name || "Anonymous Creator"}
                  creatorAvatar={project.creator_avatar}
                />
              </TabsContent>

              <TabsContent value="comments" className="mt-6">
                <CommentsList projectId={project.id} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Details & Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Header Info */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="secondary" className="rounded-full px-3 py-0.5">{project.category}</Badge>
                  <div className="flex items-center gap-2 ml-auto">
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <SocialShare title={project.title} description={project.description} />
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">{project.title}</h1>
                
                <div className="flex items-center gap-3 text-muted-foreground mb-6">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={project.creator_avatar || "/placeholder.svg"} />
                    <AvatarFallback>{project.creator_name?.[0] || "?"}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">
                    by <span className="font-medium text-foreground">{project.creator_name || "Anonymous"}</span>
                  </span>
                </div>
              </div>

              {/* Funding Card */}
              <Card className="border-accent/20 bg-accent/5 overflow-hidden shadow-lg">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">${project.raised.toLocaleString()}</span>
                      <span className="text-muted-foreground">raised of ${project.goal.toLocaleString()}</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                    <div className="flex justify-between text-sm text-muted-foreground pt-1">
                      <span>{Math.round(progress)}% funded</span>
                      <span>{daysLeft} days left</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-2 border-y border-border/50">
                    <div>
                      <p className="text-2xl font-bold">{project.backers_count}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Backers</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{daysLeft}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Days to go</p>
                    </div>
                  </div>

                  <BackProjectButton
                    projectId={project.id}
                    creatorWallet={project.creator_wallet}
                    campaignId={project.campaign_id || 0}
                    projectStatus={project.status}
                    size="lg"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-lg shadow-md"
                    onSuccess={handleBackingSuccess}
                  />

                  <p className="text-xs text-center text-muted-foreground">
                    All or nothing. This project will only be funded if it reaches its goal by {new Date(project.deadline).toLocaleDateString()}.
                  </p>
                </CardContent>
              </Card>

              {/* Project Details Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Status</span>
                    <Badge 
                      variant="secondary"
                      className={
                        project.status === 'active' 
                          ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                          : ''
                      }
                    >
                      {project.status === 'queue' ? 'In Review' : project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Created</span>
                    <span>{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Milestones</span>
                    <span>{milestones.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
