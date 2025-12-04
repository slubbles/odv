"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Circle, Clock, AlertCircle, TrendingUp, Upload, Loader2, ExternalLink } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { toast } from "sonner"
import Link from "next/link"

interface Milestone {
  id: string
  project_id: string
  project_title: string
  title: string
  description: string
  deadline: string
  percentage: number
  amount: number
  status: string
  proof_url: string | null
  proof_description: string | null
  submitted_at: string | null
}

interface Stats {
  total: number
  completed: number
  in_review: number
  active: number
  upcoming: number
}

export default function CreatorMilestonesPage() {
  const { publicKey, connected } = useWallet()
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [stats, setStats] = useState<Stats>({
    total: 0,
    completed: 0,
    in_review: 0,
    active: 0,
    upcoming: 0,
  })
  const [loading, setLoading] = useState(true)
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false)
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [proofForm, setProofForm] = useState({ url: "", description: "" })

  useEffect(() => {
    if (connected && publicKey) {
      fetchMilestones()
    } else {
      setLoading(false)
    }
  }, [connected, publicKey])

  const fetchMilestones = async () => {
    if (!publicKey) return

    setLoading(true)
    try {
      const response = await fetch(`/api/creator/milestones?wallet=${publicKey.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setMilestones(data.milestones || [])
        setStats(data.stats || { total: 0, completed: 0, in_review: 0, active: 0, upcoming: 0 })
      } else {
        toast.error("Failed to load milestones")
      }
    } catch (error) {
      console.error("Error fetching milestones:", error)
      toast.error("Failed to load milestones")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitProof = async () => {
    if (!selectedMilestone || !publicKey) return
    if (!proofForm.url || !proofForm.description) {
      toast.error("Please provide both proof URL and description")
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(
        `/api/projects/${selectedMilestone.project_id}/milestones/${selectedMilestone.id}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            proofUrl: proofForm.url,
            proofDescription: proofForm.description,
            walletAddress: publicKey.toString(),
          }),
        }
      )

      if (response.ok) {
        toast.success("Proof submitted successfully!")
        setSubmitDialogOpen(false)
        setProofForm({ url: "", description: "" })
        setSelectedMilestone(null)
        fetchMilestones() // Refresh data
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to submit proof")
      }
    } catch (error) {
      console.error("Error submitting proof:", error)
      toast.error("Failed to submit proof")
    } finally {
      setSubmitting(false)
    }
  }

  const openSubmitDialog = (milestone: Milestone) => {
    setSelectedMilestone(milestone)
    setProofForm({ url: "", description: "" })
    setSubmitDialogOpen(true)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "approved":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "in_review":
      case "pending_review":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "active":
        return <Circle className="h-5 w-5 text-blue-500" />
      case "rejected":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      completed: "bg-green-500/20 text-green-400 border-green-500/30",
      approved: "bg-green-500/20 text-green-400 border-green-500/30",
      in_review: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      pending_review: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      active: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      rejected: "bg-red-500/20 text-red-400 border-red-500/30",
      pending: "bg-muted text-muted-foreground border-border",
      not_started: "bg-muted text-muted-foreground border-border",
    }
    return variants[status] || variants.pending
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      completed: "Completed",
      approved: "Approved",
      in_review: "In Review",
      pending_review: "In Review",
      active: "Active",
      rejected: "Rejected",
      pending: "Upcoming",
      not_started: "Not Started",
    }
    return labels[status] || status
  }

  const isActionable = (status: string) => {
    return status === "active"
  }

  if (!connected) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12 flex-1 flex items-center justify-center">
          <Card className="p-12 text-center max-w-md">
            <p className="text-muted-foreground mb-4">Connect your wallet to view your milestones</p>
            <p className="text-sm text-muted-foreground">Use the wallet button in the header to get started</p>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 pb-24 md:pb-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="font-sans text-3xl sm:text-4xl font-semibold mb-2 text-balance">Your Promises</h1>
          <p className="text-muted-foreground text-lg">You said you'd build. Now prove it.</p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-4 mb-6 sm:mb-8">
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
              <TrendingUp className="h-4 w-4 text-accent" />
            </div>
            <p className="text-2xl sm:text-3xl font-semibold">{stats.total}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">All milestones</p>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm text-muted-foreground">Shipped</p>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-semibold">{stats.completed}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
              {stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}% delivery rate` : "0% delivery rate"}
            </p>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm text-muted-foreground">Waiting on You</p>
              <Clock className="h-4 w-4 text-yellow-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-semibold">{stats.active}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Backers are watching</p>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm text-muted-foreground">In Review</p>
              <Circle className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-semibold">{stats.in_review}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Awaiting approval</p>
          </Card>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : milestones.length === 0 ? (
          <Card className="p-12 text-center">
            <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">No milestones yet</p>
            <p className="text-sm text-muted-foreground mb-6">Create a project to start tracking milestones</p>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link href="/submit">Create Project</Link>
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {milestones.map((milestone) => (
              <Card key={milestone.id} className="p-6 hover:border-accent/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {getStatusIcon(milestone.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-sans text-lg font-semibold">{milestone.title}</h3>
                        <Badge className={getStatusBadge(milestone.status)}>{getStatusLabel(milestone.status)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{milestone.project_title}</p>
                      {milestone.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{milestone.description}</p>
                      )}
                      <div className="flex items-center gap-6 text-sm flex-wrap">
                        <div>
                          <span className="text-muted-foreground">Due: </span>
                          <span className="text-foreground">{new Date(milestone.deadline).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Amount: </span>
                          <span className="text-foreground">${milestone.amount?.toLocaleString() || 0}</span>
                          <span className="text-muted-foreground"> ({milestone.percentage}%)</span>
                        </div>
                        {milestone.proof_url && (
                          <div>
                            <span className="text-muted-foreground">Proof: </span>
                            <span className="text-green-400">Submitted</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {milestone.proof_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(milestone.proof_url!, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    )}
                    {isActionable(milestone.status) && !milestone.proof_url && (
                      <Button
                        size="sm"
                        className="bg-accent text-accent-foreground hover:bg-accent/90"
                        onClick={() => openSubmitDialog(milestone)}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Submit Proof
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Submit Proof Dialog */}
      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Milestone Proof</DialogTitle>
          </DialogHeader>
          {selectedMilestone && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="font-medium">{selectedMilestone.title}</p>
                <p className="text-sm text-muted-foreground">{selectedMilestone.project_title}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="proof-url">Proof URL</Label>
                <Input
                  id="proof-url"
                  placeholder="https://github.com/... or link to demo"
                  value={proofForm.url}
                  onChange={(e) => setProofForm({ ...proofForm, url: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Link to GitHub, demo, video, or documentation</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="proof-description">Description</Label>
                <Textarea
                  id="proof-description"
                  placeholder="Describe what you've accomplished for this milestone..."
                  value={proofForm.description}
                  onChange={(e) => setProofForm({ ...proofForm, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setSubmitDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={handleSubmitProof}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Submit Proof
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
