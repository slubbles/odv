"use client"

import { useState, useCallback } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { useToast } from "@/components/ui/use-toast"
import { PublicKey } from "@solana/web3.js"
import { createInitializeCampaignTransaction, getCampaignAddress } from "@/lib/solana/admin-operations"
import { parseBlockchainError } from "@/lib/solana/error-handling"

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
  const { publicKey, sendTransaction } = useWallet()
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
    if (!publicKey) {
      toast({
        title: "Error",
        description: "Please connect your wallet to approve projects",
        variant: "destructive",
      })
      return
    }

    try {
      // Admin approval is a database-only operation
      // The campaign was already initialized on blockchain during project submission
      toast({
        title: "Approving project...",
        description: "Updating project status to active",
      })
      
      const res = await fetch(`/api/admin/projects/${projectId}/approve`, {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify({
          // No blockchain transaction needed - already done during submission
          // Admin just changes status from 'queue' to 'active'
        }),
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to update project status")
      }
      
      toast({
        title: "✅ Project approved!",
        description: "Project is now live and accepting backers",
      })
      
      await fetchProjects()
    } catch (error: any) {
      console.error('Approve project error:', error)
      
      // Use the blockchain error parser for consistent error handling
      const parsed = parseBlockchainError(error)
      
      // Handle user rejection specially
      if (parsed.type === 'USER_REJECTED') {
        toast({
          title: "Transaction Cancelled",
          description: "You cancelled the transaction. Try again when ready.",
        })
        return
      }
      
      toast({
        title: "Error",
        description: parsed.suggestion ? `${parsed.userMessage}. ${parsed.suggestion}` : parsed.userMessage,
        variant: "destructive",
      })
    }
  }, [publicKey, sendTransaction, connection, fetchProjects, toast, getAdminHeaders])

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
        title: "Project Rejected",
        description: "View it in the 'Rejected' tab. Creator has been notified.",
        duration: 5000,
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
        title: `${projectIds.length} Project${projectIds.length > 1 ? "s" : ""} Rejected`,
        description: "View them in the 'Rejected' tab. Creators have been notified.",
        duration: 5000,
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
