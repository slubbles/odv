"use client"

import { useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"

export function useCreatorDashboard() {
  const { publicKey, connected } = useWallet()
  const [projects, setProjects] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalRaised: 0,
    totalBackers: 0,
    activeProjects: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!connected || !publicKey) {
      setLoading(false)
      return
    }

    const fetchDashboard = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch creator's projects
        const response = await fetch(
          `/api/projects?creator=${publicKey.toString()}&status=all`
        )
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects')
        }

        const data = await response.json()
        const userProjects = data.projects || []
        
        setProjects(userProjects)

        // Calculate stats
        const stats = userProjects.reduce((acc: any, project: any) => {
          acc.totalRaised += project.raised || 0
          acc.totalBackers += project.backers_count || 0
          if (project.status === 'active') acc.activeProjects++
          return acc
        }, {
          totalProjects: userProjects.length,
          totalRaised: 0,
          totalBackers: 0,
          activeProjects: 0
        })

        setStats(stats)
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [connected, publicKey])

  return { projects, stats, loading, error }
}

export function useBackerDashboard() {
  const { publicKey, connected } = useWallet()
  const [backedProjects, setBackedProjects] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalBacked: 0,
    totalSpent: 0,
    activeProjects: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!connected || !publicKey) {
      setLoading(false)
      return
    }

    const fetchDashboard = async () => {
      setLoading(true)
      setError(null)

      try {
        // In a real app, this would be /api/backing/user endpoint
        // For now, we'll fetch all active projects and check backing status
        const response = await fetch('/api/projects?status=active')
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects')
        }

        const data = await response.json()
        const allProjects = data.projects || []

        // Filter projects user has backed
        const backedProjectsData = []
        let totalSpent = 0

        for (const project of allProjects) {
          const backingStatus = await fetch(
            `/api/backing/${project.id}?wallet=${publicKey.toString()}`
          ).then(r => r.json()).catch(() => ({ hasBacked: false }))

          if (backingStatus.hasBacked) {
            backedProjectsData.push({
              ...project,
              backing: backingStatus.backing
            })
            totalSpent += backingStatus.backing?.amount || 1
          }
        }

        setBackedProjects(backedProjectsData)
        setStats({
          totalBacked: backedProjectsData.length,
          totalSpent,
          activeProjects: backedProjectsData.filter((p: any) => p.status === 'active').length
        })
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [connected, publicKey])

  return { backedProjects, stats, loading, error }
}
