"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Clock, AlertTriangle, Loader2, ExternalLink } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useWallet } from "@solana/wallet-adapter-react"
import { toast } from "sonner"
import Link from "next/link"

interface QueueProject {
  id: string
  title: string
  tagline: string
  description: string
  category: string
  goal: number
  creator_wallet: string
  created_at: string
  image_url?: string
}

export default function AdminQueueReviewPage() {
  const { publicKey, connected } = useWallet()
  const [projects, setProjects] = useState<QueueProject[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchQueue = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/projects/queue')
      const data = await response.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error('Failed to fetch queue:', error)
      toast.error('Failed to load queue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQueue()
  }, [])

  const handleApprove = async (projectId: string) => {
    if (!connected || !publicKey) {
      toast.error('Connect your wallet first')
      return
    }

    setActionLoading(projectId)
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': publicKey.toString(),
        },
        body: JSON.stringify({
          notes: 'Approved from queue review',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve')
      }

      toast.success('Project approved!')
      setProjects(prev => prev.filter(p => p.id !== projectId))
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve project')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (projectId: string) => {
    if (!connected || !publicKey) {
      toast.error('Connect your wallet first')
      return
    }

    setActionLoading(projectId)
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': publicKey.toString(),
        },
        body: JSON.stringify({
          reason: 'Rejected from queue review',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reject')
      }

      toast.success('Project rejected')
      setProjects(prev => prev.filter(p => p.id !== projectId))
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject project')
    } finally {
      setActionLoading(null)
    }
  }

  const formatWallet = (wallet: string) => {
    return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="font-sans text-4xl font-semibold mb-2 text-balance">Queue Review</h1>
          <p className="text-muted-foreground text-lg">Review and approve submitted projects</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">In Queue</p>
              <Clock className="h-4 w-4 text-yellow-500" />
            </div>
            <p className="text-3xl font-semibold">{projects.length}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Needs Review</p>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </div>
            <p className="text-3xl font-semibold">{projects.length}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Admin Wallet</p>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-lg font-mono">
              {connected ? formatWallet(publicKey?.toString() || '') : 'Not connected'}
            </p>
          </Card>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : projects.length === 0 ? (
          <Card className="p-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Queue is empty!</h3>
            <p className="text-muted-foreground">No projects waiting for review.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => (
              <Card key={project.id} className="p-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-sans text-xl font-semibold">{project.title}</h3>
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        In Queue
                      </Badge>
                      <Badge className="bg-muted text-muted-foreground border-border">
                        {project.category}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-3">{project.tagline}</p>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      by <span className="font-mono">{formatWallet(project.creator_wallet)}</span> • 
                      Submitted {formatDate(project.created_at)}
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Funding Goal</p>
                        <p className="text-lg font-semibold">${project.goal?.toLocaleString() || '0'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Project ID</p>
                        <p className="text-sm font-mono text-muted-foreground">{project.id}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/project/${project.id}`}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-400 hover:text-green-400 hover:border-green-500/50 bg-transparent"
                      onClick={() => handleApprove(project.id)}
                      disabled={actionLoading === project.id || !connected}
                    >
                      {actionLoading === project.id ? (
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
                      onClick={() => handleReject(project.id)}
                      disabled={actionLoading === project.id || !connected}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
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
