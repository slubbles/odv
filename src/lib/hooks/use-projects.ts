"use client"

import { useEffect, useState } from "react"

export interface UseProjectsOptions {
  category?: string
  status?: string
  search?: string
  sort?: string
  page?: number
  limit?: number
}

export function useProjects(options: UseProjectsOptions = {}) {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        if (options.category) params.append('category', options.category)
        if (options.status) params.append('status', options.status)
        if (options.search) params.append('search', options.search)
        if (options.sort) params.append('sort', options.sort)
        if (options.page) params.append('page', options.page.toString())
        if (options.limit) params.append('limit', options.limit.toString())

        const response = await fetch(`/api/projects?${params}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects')
        }

        const data = await response.json()
        setProjects(data.projects || [])
        setPagination(data.pagination)
      } catch (err: any) {
        setError(err.message || 'Failed to load projects')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [
    options.category,
    options.status,
    options.search,
    options.sort,
    options.page,
    options.limit
  ])

  return { projects, loading, error, pagination }
}

export function useProject(id: string) {
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchProject = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/projects/${id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch project')
        }

        const data = await response.json()
        setProject(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load project')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  return { project, loading, error }
}
