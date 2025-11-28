"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"

export type ProjectStatus = "pending" | "approved" | "rejected"
export type SortOption = "newest" | "oldest" | "most_voted" | "least_voted"

export interface QueueProject {
  id: string
  title: string
  creator: string
  category: string
  votes: number
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

      const res = await fetch(`/api/admin/projects?${params.toString()}`)
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
  }, [filters, sortBy, toast])

  const approveProject = useCallback(async (projectId: string) => {
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/approve`, {
        method: "POST",
      })
      if (!res.ok) throw new Error("Failed to approve project")
      
      toast({
        title: "Success",
        description: "Project approved",
      })
      
      await fetchProjects()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve project",
        variant: "destructive",
      })
    }
  }, [fetchProjects, toast])

  const rejectProject = useCallback(async (projectId: string, reason: string) => {
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      })
      if (!res.ok) throw new Error("Failed to reject project")
      
      toast({
        title: "Success",
        description: "Project rejected",
      })
      
      await fetchProjects()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject project",
        variant: "destructive",
      })
    }
  }, [fetchProjects, toast])

  const bulkApprove = useCallback(async (projectIds: string[]) => {
    if (projectIds.length === 0) return
    
    try {
      const res = await fetch("/api/admin/projects/bulk-approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectIds }),
      })
      if (!res.ok) throw new Error("Failed to approve projects")
      
      toast({
        title: "Success",
        description: `Approved ${projectIds.length} project${projectIds.length > 1 ? "s" : ""}`,
      })
      
      setSelectedIds(new Set())
      await fetchProjects()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve projects",
        variant: "destructive",
      })
    }
  }, [fetchProjects, toast])

  const bulkReject = useCallback(async (projectIds: string[], reason: string) => {
    if (projectIds.length === 0) return
    
    try {
      const res = await fetch("/api/admin/projects/bulk-reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectIds, reason }),
      })
      if (!res.ok) throw new Error("Failed to reject projects")
      
      toast({
        title: "Success",
        description: `Rejected ${projectIds.length} project${projectIds.length > 1 ? "s" : ""}`,
      })
      
      setSelectedIds(new Set())
      await fetchProjects()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject projects",
        variant: "destructive",
      })
    }
  }, [fetchProjects, toast])

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
