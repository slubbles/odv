"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays } from "lucide-react"

interface Update {
  id: string
  title: string
  content: string
  created_at: string
  creator_name?: string
  creator_avatar?: string
}

interface UpdatesListProps {
  updates?: Update[]
  loading?: boolean
  projectTitle?: string
  creatorName?: string
  creatorAvatar?: string
}

export function UpdatesList({ 
  updates = [], 
  loading = false,
  projectTitle = "this project",
  creatorName = "Creator",
  creatorAvatar
}: UpdatesListProps) {
  // Mock data for demonstration - will be replaced with API data
  const mockUpdates: Update[] = [
    {
      id: "1",
      title: "MVP Launch Complete! 🚀",
      content: `We're thrilled to announce that the platform MVP is now live! After weeks of hard work, we've deployed the core features including:

• AI-powered recipe recommendations
• User profiles and preferences
• Social sharing capabilities
• Mobile-responsive design

Thank you to all our backers for your incredible support. We couldn't have done this without you!

Next up: We're diving into the recipe database expansion. Stay tuned for more updates!`,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      creator_name: creatorName,
      creator_avatar: creatorAvatar,
    },
    {
      id: "2",
      title: "Development Update - Week 4",
      content: `Quick update on what we've been working on:

✅ Completed user authentication system
✅ Integrated AI recommendation engine
⏳ Working on recipe database (2,500+ recipes added so far)
⏳ Testing mobile app beta version

We're on track for our next milestone! Expect another update next week with demo videos.`,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      creator_name: creatorName,
      creator_avatar: creatorAvatar,
    },
    {
      id: "3",
      title: "Thank You for Your Support! 🎉",
      content: `We hit our funding goal! Thank you to all 423 backers who believed in our vision.

Your support means everything to us. We're committed to delivering an amazing product and keeping you updated every step of the way.

Development officially starts this week. Let's build something amazing together! 💪`,
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      creator_name: creatorName,
      creator_avatar: creatorAvatar,
    },
  ]

  const displayUpdates = updates.length > 0 ? updates : mockUpdates

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-muted rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full mb-2" />
              <div className="h-4 bg-muted rounded w-5/6 mb-2" />
              <div className="h-4 bg-muted rounded w-4/6" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (displayUpdates.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No updates yet. Check back soon!</p>
      </Card>
    )
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {displayUpdates.map((update, index) => (
        <Card key={update.id} className="relative">
          {/* Timeline line */}
          {index !== displayUpdates.length - 1 && (
            <div className="absolute left-8 top-16 bottom-0 w-px bg-border" />
          )}
          
          <CardHeader className="pb-3">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10 border-2 border-background relative z-10">
                <AvatarImage src={update.creator_avatar || creatorAvatar} />
                <AvatarFallback>{(update.creator_name || creatorName)?.[0] || "?"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold mb-1">{update.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">{update.creator_name || creatorName}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>{formatDate(update.created_at)}</span>
                  </div>
                </div>
              </div>
              {index === 0 && (
                <Badge className="bg-accent/20 text-accent-foreground border-accent/30">Latest</Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="ml-14">
            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{update.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
