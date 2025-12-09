"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, LinkIcon, Calendar, TrendingUp, Users, Award, Loader2, User } from "lucide-react"

interface CreatorProfile {
  wallet: string
  display_name: string
  bio: string
  avatar_url: string
  location: string
  website: string
  twitter: string
  created_at: string
}

interface Project {
  id: string
  title: string
  tagline: string
  description: string
  category: string
  image_url: string
  raised: number
  goal: number
  backers_count: number
  deadline: string
  status: string
  creator_name: string
  creator_avatar: string
}

export default function CreatorProfilePage() {
  const params = useParams()
  const creatorId = params.id as string
  
  const [creator, setCreator] = useState<CreatorProfile | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCreatorData() {
      try {
        setLoading(true)
        
        // Fetch creator profile
        const profileRes = await fetch(`/api/users/${creatorId}`)
        let profileData = null
        if (profileRes.ok) {
          const data = await profileRes.json()
          profileData = data.user
        }
        
        // Fetch creator's projects
        const projectsRes = await fetch(`/api/projects?creator=${creatorId}&status=all`)
        const projectsData = await projectsRes.json()
        
        setCreator(profileData)
        setProjects(projectsData.projects || [])
      } catch (err) {
        setError("Failed to load creator profile")
      } finally {
        setLoading(false)
      }
    }

    if (creatorId) {
      fetchCreatorData()
    }
  }, [creatorId])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading creator profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center pb-24 md:pb-12">
          <Card className="p-12 text-center max-w-md">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  // Calculate stats from projects
  const totalRaised = projects.reduce((sum, p) => sum + p.raised, 0)
  const totalBackers = projects.reduce((sum, p) => sum + (p.backers_count || 0), 0)
  const completedProjects = projects.filter(p => p.status === "funded" || p.status === "completed").length
  const successRate = projects.length > 0 ? Math.round((completedProjects / projects.length) * 100) : 0

  // Display name and formatting
  const displayName = creator?.display_name || `Creator ${creatorId.slice(0, 8)}...`
  const shortWallet = `${creatorId.slice(0, 4)}...${creatorId.slice(-4)}`
  const joinDate = creator?.created_at 
    ? new Date(creator.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : "Recently"

  // Calculate days left for each project
  const projectsWithDaysLeft = projects.map(p => {
    const deadline = new Date(p.deadline)
    const now = new Date()
    const daysLeft = Math.max(0, Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    return { ...p, daysLeft }
  })

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero Section */}
      <div className="border-b border-border">
        <div className="container px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
            {creator?.avatar_url ? (
              <img 
                src={creator.avatar_url} 
                alt={displayName} 
                className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-accent/30 object-cover" 
              />
            ) : (
              <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-accent/30 bg-accent/20 flex items-center justify-center">
                <User className="h-12 w-12 sm:h-16 sm:w-16 text-accent" />
              </div>
            )}

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">{displayName}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{shortWallet}</span>
                    </div>
                    {creator?.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{creator.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {joinDate}</span>
                    </div>
                    {creator?.website && (
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" />
                        <a href={creator.website} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                          {creator.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {creator?.bio ? (
                <p className="text-muted-foreground leading-relaxed mb-6">{creator.bio}</p>
              ) : (
                <p className="text-muted-foreground leading-relaxed mb-6 italic">
                  This creator hasn't added a bio yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container px-4 sm:px-6 py-8 sm:py-12 pb-24 md:pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <Card className="border-accent/30">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-accent/20 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
              </div>
              <p className="text-xl sm:text-2xl font-bold mb-1">{projects.length}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Projects Launched</p>
            </CardContent>
          </Card>

          <Card className="border-accent/30">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-accent/20 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
              </div>
              <p className="text-xl sm:text-2xl font-bold mb-1">{totalBackers.toLocaleString()}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">People Believed</p>
            </CardContent>
          </Card>

          <Card className="border-accent/30">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-accent/20 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Award className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
              </div>
              <p className="text-xl sm:text-2xl font-bold mb-1">
                ${totalRaised >= 1000 ? `${(totalRaised / 1000).toFixed(1)}K` : totalRaised}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Dollars Raised</p>
            </CardContent>
          </Card>

          <Card className="border-accent/30">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-accent/20 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
              </div>
              <p className="text-xl sm:text-2xl font-bold mb-1">{successRate}%</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Success Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Projects */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">What They Built</h2>
          {projects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectsWithDaysLeft.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  description={project.tagline || project.description}
                  creator={{
                    name: project.creator_name || displayName,
                    avatar: project.creator_avatar || creator?.avatar_url || "/placeholder.svg"
                  }}
                  category={project.category}
                  image={project.image_url || "/placeholder.svg"}
                  raised={project.raised}
                  goal={project.goal}
                  backers={project.backers_count || 0}
                  daysLeft={project.daysLeft}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">This creator hasn't launched any projects yet.</p>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
