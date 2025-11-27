"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Clock, DollarSign, Award } from "lucide-react"

interface Project {
  id: string
  title: string
  category: string
  image: string
  raised: number
  goal: number
  backers: number
  daysLeft: number
  creator: {
    name: string
    avatar: string
  }
}

interface ProjectComparisonModalProps {
  projects: Project[]
  triggerButton?: React.ReactNode
}

export function ProjectComparisonModal({ projects, triggerButton }: ProjectComparisonModalProps) {
  const [selectedProjects, setSelectedProjects] = useState<Project[]>([])

  const toggleProject = (project: Project) => {
    if (selectedProjects.find((p) => p.id === project.id)) {
      setSelectedProjects(selectedProjects.filter((p) => p.id !== project.id))
    } else if (selectedProjects.length < 3) {
      setSelectedProjects([...selectedProjects, project])
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{triggerButton || <Button variant="outline">Compare Projects</Button>}</DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compare Projects (Select up to 3)</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Selection */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {projects.slice(0, 6).map((project) => (
              <button
                key={project.id}
                onClick={() => toggleProject(project)}
                className={`p-4 border rounded-lg text-left transition-all hover:border-accent ${
                  selectedProjects.find((p) => p.id === project.id) ? "border-accent bg-accent/10" : ""
                }`}
                disabled={selectedProjects.length >= 3 && !selectedProjects.find((p) => p.id === project.id)}
              >
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-24 object-cover rounded mb-2"
                />
                <h4 className="font-semibold text-sm line-clamp-2">{project.title}</h4>
              </button>
            ))}
          </div>

          {/* Comparison Table */}
          {selectedProjects.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-x divide-border">
                {selectedProjects.map((project) => {
                  const progress = (project.raised / project.goal) * 100

                  return (
                    <div key={project.id} className="p-6 space-y-4">
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-40 object-cover rounded-lg"
                      />

                      <div>
                        <h3 className="font-bold text-lg mb-1 line-clamp-2">{project.title}</h3>
                        <Badge variant="secondary">{project.category}</Badge>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="h-4 w-4 text-accent" />
                            <span className="text-sm font-semibold">Funding</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            ${project.raised.toLocaleString()} / ${project.goal.toLocaleString()}
                          </p>
                          <Progress value={progress} className="h-2 mt-2" />
                          <p className="text-xs text-muted-foreground mt-1">{progress.toFixed(0)}% funded</p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="h-4 w-4 text-accent" />
                            <span className="text-sm font-semibold">Backers</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{project.backers} backers</p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-accent" />
                            <span className="text-sm font-semibold">Time Left</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{project.daysLeft} days remaining</p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Award className="h-4 w-4 text-accent" />
                            <span className="text-sm font-semibold">Creator</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <img
                              src={project.creator.avatar || "/placeholder.svg"}
                              alt={project.creator.name}
                              className="h-6 w-6 rounded-full"
                            />
                            <p className="text-sm text-muted-foreground">{project.creator.name}</p>
                          </div>
                        </div>

                        <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                          Back This Project
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
