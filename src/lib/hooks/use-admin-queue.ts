"use client"

import { useState, useCallback } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { useToast } from "@/components/ui/use-toast"
import { PublicKey } from "@solana/web3.js"
import { createInitializeCampaignTransaction, getCampaignAddress } from "@/lib/solana/admin-operations"

export type ProjectStatus = "pending" | "approved" | "rejected"
export type SortOption = "newest" | "oldest" | "most_voted" | "least_voted"

export interface QueueProject {
  id: string
  title: string
  creator: string
  creator_wallet?: string
  category: string
  votes: number
  goal?: number
  deadline?: string
  milestones?: Array<{ title: string; percentage: number; amount?: number }>
  submittedDate: string
  status: ProjectStatus
  approvedDate?: string
  rejectedDate?: string
  rejectionReason?: string
}

export function useAdminQueue() {
  const [projects, setProjects] = useState<QueueProject[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState({
    status: "pending" as ProjectStatus,
    category: "all",
    dateFrom: "",
    dateTo: "",
  })
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const { toast } = useToast()
  const { publicKey, signTransaction } = useWallet()
  const { connection } = useConnection()

  // Helper to get headers with wallet address for admin auth
  const getAdminHeaders = useCallback(() => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }
    if (publicKey) {
      headers["x-wallet-address"] = publicKey.toString()
    }
    return headers
  }, [publicKey])

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        status: filters.status,
        sort: sortBy,
      })
      
      if (filters.category !== "all") {
        params.append("category", filters.category)
      }
      if (filters.dateFrom) {
        params.append("dateFrom", filters.dateFrom)
      }
      if (filters.dateTo) {
        params.append("dateTo", filters.dateTo)
      }

      const res = await fetch(`/api/admin/projects?${params.toString()}`, {
        headers: getAdminHeaders(),
      })
      if (!res.ok) throw new Error("Failed to fetch projects")
      
      const data = await res.json()
      setProjects(data.projects || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [filters, sortBy, toast, getAdminHeaders])

  const approveProject = useCallback(async (projectId: string) => {
    if (!publicKey || !signTransaction) {
      toast({
        title: "Error",
        description: "Please connect your wallet to approve projects",
        variant: "destructive",
      })
      return
    }

    try {
      // Step 1: Get project details from API (this also validates admin access)
      const detailsRes = await fetch(`/api/admin/projects/${projectId}`, {
        headers: getAdminHeaders(),
      })
      
      if (!detailsRes.ok) {
        const data = await detailsRes.json()
        throw new Error(data.error || "Failed to get project details")
      }
      
      const { project } = await detailsRes.json()
      
      if (!project.creator_wallet) {
        throw new Error("Project missing creator wallet address")
      }

      // Step 2: Create on-chain initialize transaction
      toast({
        title: "Creating transaction...",
        description: "Preparing on-chain campaign initialization",
      })

      const creatorPublicKey = new PublicKey(project.creator_wallet)
      
      // Calculate deadline as Unix timestamp
      const deadline = project.deadline 
        ? Math.floor(new Date(project.deadline).getTime() / 1000)
        : Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days from now
      
      // Format milestones for on-chain (convert percentage to amount based on goal)
      const goal = project.goal || 100 // Default goal in USDC
      const goalLamports = goal * 1_000_000 // Convert to USDC smallest units
      
      const milestones = (project.milestones || []).map((m: any) => ({
        title: m.title || 'Milestone',
        amount: Math.floor((m.percentage / 100) * goalLamports),
      }))
      
      // If no milestones, create a single 100% milestone
      if (milestones.length === 0) {
        milestones.push({ title: 'Project Completion', amount: goalLamports })
      }

      const transaction = await createInitializeCampaignTransaction(
        connection,
        creatorPublicKey,
        goalLamports,
        deadline,
        milestones
      )

      // Step 3: Admin signs and sends transaction
      toast({
        title: "Please sign the transaction",
        description: "Approve the campaign initialization in your wallet",
      })

      const signedTx = await signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: false,
        preflightCommitment: 'confirmed'
      })

      // Step 4: Confirm transaction
      toast({
        title: "Confirming on SOON Testnet...",
        description: "Waiting for blockchain confirmation",
      })

      await connection.confirmTransaction(signature, 'confirmed')

      // Step 5: Update database with approval and PDA
      const campaignPda = getCampaignAddress(project.creator_wallet)
      
      const res = await fetch(`/api/admin/projects/${projectId}/approve`, {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify({
          initializeTxSignature: signature,
          campaignPda,
        }),
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to update project status")
      }
      
      toast({
        title: "🎉 Project approved on-chain!",
        description: `Campaign initialized. Tx: ${signature.slice(0, 8)}...`,
      })
      
      await fetchProjects()
    } catch (error: any) {
      console.error('Approve project error:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to approve project",
        variant: "destructive",
      })
    }
  }, [publicKey, signTransaction, connection, fetchProjects, toast, getAdminHeaders])

  const rejectProject = useCallback(async (projectId: string, reason: string) => {
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/reject`, {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify({ reason }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to reject project")
      }
      
      toast({
        title: "Success",
        description: "Project rejected",
      })
      
      await fetchProjects()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject project",
        variant: "destructive",
      })
    }
  }, [fetchProjects, toast, getAdminHeaders])

  const bulkApprove = useCallback(async (projectIds: string[]) => {
    if (projectIds.length === 0) return
    
    try {
      const res = await fetch("/api/admin/projects/bulk-approve", {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify({ projectIds }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to approve projects")
      }
      
      toast({
        title: "Success",
        description: `Approved ${projectIds.length} project${projectIds.length > 1 ? "s" : ""}`,
      })
      
      setSelectedIds(new Set())
      await fetchProjects()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve projects",
        variant: "destructive",
      })
    }
  }, [fetchProjects, toast, getAdminHeaders])

  const bulkReject = useCallback(async (projectIds: string[], reason: string) => {
    if (projectIds.length === 0) return
    
    try {
      const res = await fetch("/api/admin/projects/bulk-reject", {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify({ projectIds, reason }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to reject projects")
      }
      
      toast({
        title: "Success",
        description: `Rejected ${projectIds.length} project${projectIds.length > 1 ? "s" : ""}`,
      })
      
      setSelectedIds(new Set())
      await fetchProjects()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject projects",
        variant: "destructive",
      })
    }
  }, [fetchProjects, toast, getAdminHeaders])

  const toggleSelection = useCallback((projectId: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(projectId)) {
        newSet.delete(projectId)
      } else {
        newSet.add(projectId)
      }
      return newSet
    })
  }, [])

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(projects.map((p) => p.id)))
  }, [projects])

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  return {
    projects,
    loading,
    selectedIds,
    filters,
    sortBy,
    fetchProjects,
    approveProject,
    rejectProject,
    bulkApprove,
    bulkReject,
    toggleSelection,
    selectAll,
    clearSelection,
    setFilters,
    setSortBy,
  }
}
