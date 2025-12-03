"use client"

import { useState, useEffect } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, XCircle, Clock, AlertCircle, Loader2, ExternalLink } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { toast } from "sonner"
import { 
  createApproveMilestoneTransaction, 
  createReleaseMilestoneTransaction,
  createRejectMilestoneTransaction 
} from "@/lib/solana/admin-operations"

interface Milestone {
  id: string
  project_id: string
  project_title: string
  creator_wallet?: string
  title: string
  description: string
  deadline: string
  percentage: number
  amount: number
  status: string
  proof_url: string | null
  proof_description: string | null
  evidence_submitted: boolean
}

interface Stats {
  pending_review: number
  overdue: number
  on_track: number
  approved: number
  rejected: number
}

export default function AdminMilestonesPage() {
  const { publicKey, connected, signTransaction } = useWallet()
  const { connection } = useConnection()
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [stats, setStats] = useState<Stats>({
    pending_review: 0,
    overdue: 0,
    on_track: 0,
    approved: 0,
    rejected: 0,
  })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchMilestones()
  }, [filter])

  const fetchMilestones = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter !== "all") {
        params.set("status", filter)
      }

      const response = await fetch(`/api/admin/milestones?${params}`)
      if (response.ok) {
        const data = await response.json()
        setMilestones(data.milestones || [])
        setStats(
          data.stats || {
            pending_review: 0,
            overdue: 0,
            on_track: 0,
            approved: 0,
            rejected: 0,
          }
        )
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

  const handleAction = async (milestoneId: string, action: "approve" | "reject") => {
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet")
      return
    }

    setActionLoading(milestoneId)
    try {
      // Find the milestone to get project info
      const milestone = milestones.find(m => m.id === milestoneId)
      
      if (!milestone) {
        toast.error("Milestone not found")
        return
      }

      let approveTxSignature: string | undefined
      let releaseTxSignature: string | undefined

      // If approving, create and sign blockchain transactions
      if (action === "approve" && milestone.creator_wallet) {
        const creatorPubkey = new PublicKey(milestone.creator_wallet)
        
        // Step 1: Create and sign approve milestone transaction
        toast.loading("Creating approve transaction...")
        const approveTx = await createApproveMilestoneTransaction(
          connection,
          publicKey,
          creatorPubkey
        )
        
        const signedApproveTx = await signTransaction!(approveTx)
        const approveRawTx = signedApproveTx.serialize()
        approveTxSignature = await connection.sendRawTransaction(approveRawTx)
        await connection.confirmTransaction(approveTxSignature, "confirmed")
        
        toast.success(`Approve transaction confirmed: ${approveTxSignature.slice(0, 8)}...`)
        
        // Step 2: Create and sign release milestone transaction
        toast.loading("Creating release transaction...")
        const releaseTx = await createReleaseMilestoneTransaction(
          connection,
          creatorPubkey
        )
        
        const signedReleaseTx = await signTransaction!(releaseTx)
        const releaseRawTx = signedReleaseTx.serialize()
        releaseTxSignature = await connection.sendRawTransaction(releaseRawTx)
        await connection.confirmTransaction(releaseTxSignature, "confirmed")
        
        toast.success(`Release transaction confirmed: ${releaseTxSignature.slice(0, 8)}...`)
      } else if (action === "reject" && milestone.creator_wallet) {
        // Create and sign reject milestone transaction
        const creatorPubkey = new PublicKey(milestone.creator_wallet)
        
        toast.loading("Creating reject transaction...")
        const rejectTx = await createRejectMilestoneTransaction(
          connection,
          publicKey,
          creatorPubkey
        )
        
        const signedRejectTx = await signTransaction!(rejectTx)
        const rejectRawTx = signedRejectTx.serialize()
        approveTxSignature = await connection.sendRawTransaction(rejectRawTx)
        await connection.confirmTransaction(approveTxSignature, "confirmed")
        
        toast.success(`Reject transaction confirmed: ${approveTxSignature.slice(0, 8)}...`)
      }

      // Now record the action in the database
      const response = await fetch("/api/admin/milestones", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          milestone_id: milestoneId,
          action,
          admin_wallet: publicKey.toString(),
          approve_tx: approveTxSignature,
          release_tx: releaseTxSignature,
        }),
      })

      if (response.ok) {
        toast.success(`Milestone ${action}d successfully`)
        fetchMilestones() // Refresh data
      } else {
        const error = await response.json()
        toast.error(error.error || `Failed to ${action} milestone`)
      }
    } catch (error) {
      console.error(`Error ${action}ing milestone:`, error)
      toast.error(`Failed to ${action} milestone: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending-review":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "overdue":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "on-track":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "approved":
        return "bg-accent/20 text-accent border-accent/30"
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending-review":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "overdue":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "on-track":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "approved":
        return <CheckCircle2 className="h-5 w-5 text-accent" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  if (!connected) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-1">
          <Card className="p-8 text-center border-yellow-500/30 bg-yellow-500/10">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Admin Access Required</h2>
            <p className="text-muted-foreground">Please connect your admin wallet to manage milestones.</p>
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
          <h1 className="font-sans text-3xl sm:text-4xl font-semibold mb-2 text-balance">Did They Ship?</h1>
          <p className="text-muted-foreground text-lg">Check proof. Approve or reject. Simple.</p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-4 mb-6 sm:mb-8">
          <Card className="p-4 sm:p-6 cursor-pointer hover:border-yellow-500/50 transition-all" onClick={() => setFilter("pending-review")}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm text-muted-foreground">Pending</p>
              <Clock className="h-4 w-4 text-yellow-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-semibold">{stats.pending_review}</p>
          </Card>

          <Card className="p-6 cursor-pointer hover:border-red-500/50 transition-all" onClick={() => setFilter("overdue")}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Overdue</p>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
            <p className="text-3xl font-semibold">{stats.overdue}</p>
          </Card>

          <Card className="p-6 cursor-pointer hover:border-green-500/50 transition-all" onClick={() => setFilter("approved")}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Approved</p>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-3xl font-semibold">{stats.approved}</p>
          </Card>

          <Card className="p-6 cursor-pointer hover:border-red-500/50 transition-all" onClick={() => setFilter("rejected")}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Rejected</p>
              <XCircle className="h-4 w-4 text-red-500" />
            </div>
            <p className="text-3xl font-semibold">{stats.rejected}</p>
          </Card>
        </div>

        <Tabs value={filter} onValueChange={setFilter} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending-review">Pending</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
            <TabsTrigger value="on-track">On Track</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : milestones.length === 0 ? (
          <Card className="p-8 text-center">
            <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No milestones found</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {milestones.map((milestone) => (
              <Card key={milestone.id} className="p-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    {getStatusIcon(milestone.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-sans text-lg font-semibold">{milestone.title}</h3>
                        <Badge className={getStatusBadge(milestone.status)}>{milestone.status.replace("-", " ")}</Badge>
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
                        <div>
                          <span className="text-muted-foreground">Proof: </span>
                          <span className={milestone.evidence_submitted ? "text-green-400" : "text-muted-foreground"}>
                            {milestone.evidence_submitted ? "Submitted" : "Not submitted"}
                          </span>
                        </div>
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
                        View Proof
                      </Button>
                    )}
                    {(milestone.status === "pending_review" || milestone.status === "active") && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-400 hover:text-green-400 hover:border-green-500/50 bg-transparent"
                          onClick={() => handleAction(milestone.id, "approve")}
                          disabled={actionLoading === milestone.id}
                        >
                          {actionLoading === milestone.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                          )}
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-400 hover:text-red-400 hover:border-red-500/50 bg-transparent"
                          onClick={() => handleAction(milestone.id, "reject")}
                          disabled={actionLoading === milestone.id}
                        >
                          {actionLoading === milestone.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-2" />
                          )}
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
