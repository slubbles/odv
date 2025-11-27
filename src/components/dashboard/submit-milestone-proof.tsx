"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Upload, CheckCircle, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface Milestone {
  id: string
  title: string
  description?: string
  percentage: number
  amount: number
  deadline: string
  status: "pending" | "in_progress" | "pending_review" | "completed" | "rejected"
  proof_url?: string
}

interface SubmitMilestoneProofProps {
  projectId: string
  milestones?: Milestone[]
  onSuccess?: () => void
}

export function SubmitMilestoneProof({ projectId, milestones = [], onSuccess }: SubmitMilestoneProofProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null)
  const [proofUrl, setProofUrl] = useState("")
  const [proofDescription, setProofDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedMilestone) {
      toast.error("Please select a milestone")
      return
    }

    if (!proofUrl.trim()) {
      toast.error("Please provide a proof URL")
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: Replace with actual API call when endpoint is ready
      // const response = await fetch(`/api/projects/${projectId}/milestones/${selectedMilestone}/submit`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ proof_url: proofUrl, description: proofDescription })
      // })
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setShowSuccess(true)
      toast.success("Milestone proof submitted for review!")
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setSelectedMilestone(null)
        setProofUrl("")
        setProofDescription("")
        setShowSuccess(false)
        onSuccess?.()
      }, 2000)
    } catch (error) {
      console.error("Failed to submit proof:", error)
      toast.error("Failed to submit proof. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const eligibleMilestones = milestones.filter(
    (m) => m.status === "in_progress" || m.status === "pending"
  )

  if (showSuccess) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Proof Submitted!</h3>
              <p className="text-muted-foreground">
                Your milestone is now under review. You'll be notified when it's approved.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (eligibleMilestones.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground mb-2">No milestones ready for submission</p>
          <p className="text-sm text-muted-foreground">
            Complete your in-progress milestones to submit proof
          </p>
        </CardContent>
      </Card>
    )
  }

  const selectedMilestoneData = eligibleMilestones.find((m) => m.id === selectedMilestone)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Submit Milestone Proof</CardTitle>
          <CardDescription>
            Upload proof of completion for your milestones. Admin will review and release funds upon approval.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Milestone Selection */}
          <div className="space-y-3">
            <Label>Select Milestone to Submit</Label>
            <div className="grid gap-3">
              {eligibleMilestones.map((milestone) => (
                <div
                  key={milestone.id}
                  onClick={() => setSelectedMilestone(milestone.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedMilestone === milestone.id
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{milestone.title}</h4>
                      {milestone.description && (
                        <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                      )}
                      <div className="flex items-center gap-3 text-sm">
                        <Badge
                          variant="outline"
                          className={
                            milestone.status === "in_progress"
                              ? "bg-blue-500/20 text-blue-500 border-blue-500/30"
                              : ""
                          }
                        >
                          {milestone.status === "in_progress" ? "In Progress" : "Pending"}
                        </Badge>
                        <span className="text-muted-foreground">
                          {milestone.percentage}% • ${milestone.amount.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground">
                          Due: {new Date(milestone.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedMilestone && (
            <form onSubmit={handleSubmit} className="space-y-6 pt-6 border-t">
              <div className="space-y-2">
                <Label htmlFor="proof-url">
                  Proof URL * 
                  <span className="text-sm text-muted-foreground font-normal ml-2">
                    (GitHub, Figma, Google Drive, YouTube, etc.)
                  </span>
                </Label>
                <div className="relative">
                  <Input
                    id="proof-url"
                    type="url"
                    placeholder="https://github.com/username/repo or https://drive.google.com/..."
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    disabled={isSubmitting}
                    className="pr-10"
                  />
                  <ExternalLink className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Provide a link to your work, demo, screenshots, or documentation
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="proof-description">
                  Description (Optional)
                </Label>
                <Textarea
                  id="proof-description"
                  placeholder="Briefly explain what you've completed and any important details reviewers should know..."
                  value={proofDescription}
                  onChange={(e) => setProofDescription(e.target.value)}
                  disabled={isSubmitting}
                  rows={6}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">{proofDescription.length} characters</p>
              </div>

              {selectedMilestoneData && (
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <h4 className="font-semibold">Milestone Details</h4>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Title:</span>
                      <span className="font-medium">{selectedMilestoneData.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Funding:</span>
                      <span className="font-medium">${selectedMilestoneData.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deadline:</span>
                      <span className="font-medium">
                        {new Date(selectedMilestoneData.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !proofUrl.trim()}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Submit for Review
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedMilestone(null)
                    setProofUrl("")
                    setProofDescription("")
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Milestone Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>All Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {milestones.map((milestone) => {
              const statusColors = {
                pending: "bg-gray-500/20 text-gray-500 border-gray-500/30",
                in_progress: "bg-blue-500/20 text-blue-500 border-blue-500/30",
                pending_review: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
                completed: "bg-green-500/20 text-green-500 border-green-500/30",
                rejected: "bg-red-500/20 text-red-500 border-red-500/30",
              }

              return (
                <div key={milestone.id} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{milestone.title}</h4>
                    <Badge className={statusColors[milestone.status]}>
                      {milestone.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{milestone.percentage}%</span>
                    <span>${milestone.amount.toLocaleString()}</span>
                    <span>{new Date(milestone.deadline).toLocaleDateString()}</span>
                  </div>
                  {milestone.proof_url && (
                    <a
                      href={milestone.proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent hover:underline mt-2 inline-flex items-center gap-1"
                    >
                      View Proof <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
