"use client"

import { useState, useEffect, useCallback } from "react"

export interface Comment {
  id: string
  project_id: string
  wallet_address: string
  content: string
  parent_id: string | null
  likes: number
  created_at: string
  users?: {
    wallet_address: string
    name: string | null
    avatar_url: string | null
  } | null
  replies?: Comment[]
}

export interface UseCommentsOptions {
  projectId: string
  limit?: number
}

export function useComments({ projectId, limit = 20 }: UseCommentsOptions) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)

  const fetchComments = useCallback(async (reset = false) => {
    if (!projectId) return

    const currentOffset = reset ? 0 : offset
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        project_id: projectId,
        limit: limit.toString(),
        offset: currentOffset.toString()
      })

      const response = await fetch(`/api/comments?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments')
      }

      const data = await response.json()
      
      if (reset) {
        setComments(data.comments || [])
      } else {
        setComments(prev => [...prev, ...(data.comments || [])])
      }
      
      setTotal(data.total || 0)
      setHasMore(data.hasMore || false)
      if (!reset) {
        setOffset(currentOffset + limit)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load comments')
    } finally {
      setLoading(false)
    }
  }, [projectId, limit, offset])

  useEffect(() => {
    setOffset(0)
    fetchComments(true)
  }, [projectId])

  const addComment = async (content: string, walletAddress: string, parentId?: string) => {
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          wallet_address: walletAddress,
          content,
          parent_id: parentId || null
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to post comment')
      }

      const data = await response.json()
      
      if (parentId) {
        // Add reply to parent comment
        setComments(prev => prev.map(c => {
          if (c.id === parentId) {
            return {
              ...c,
              replies: [...(c.replies || []), data.comment]
            }
          }
          return c
        }))
      } else {
        // Add new top-level comment at the beginning
        setComments(prev => [data.comment, ...prev])
        setTotal(prev => prev + 1)
      }

      return data.comment
    } catch (err: any) {
      throw err
    }
  }

  const likeComment = async (commentId: string, walletAddress: string, liked: boolean) => {
    try {
      const response = await fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment_id: commentId,
          wallet_address: walletAddress,
          action: liked ? 'unlike' : 'like'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update like')
      }

      const data = await response.json()

      // Update local state
      const updateLikes = (comments: Comment[]): Comment[] => {
        return comments.map(c => {
          if (c.id === commentId) {
            return { ...c, likes: data.likes }
          }
          if (c.replies) {
            return { ...c, replies: updateLikes(c.replies) }
          }
          return c
        })
      }

      setComments(prev => updateLikes(prev))
      return data
    } catch (err: any) {
      throw err
    }
  }

  const deleteComment = async (commentId: string, walletAddress: string) => {
    try {
      const params = new URLSearchParams({
        id: commentId,
        wallet: walletAddress
      })

      const response = await fetch(`/api/comments?${params}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete comment')
      }

      // Remove from local state
      const removeComment = (comments: Comment[]): Comment[] => {
        return comments
          .filter(c => c.id !== commentId)
          .map(c => ({
            ...c,
            replies: c.replies ? removeComment(c.replies) : []
          }))
      }

      setComments(prev => removeComment(prev))
      setTotal(prev => prev - 1)
    } catch (err: any) {
      throw err
    }
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchComments(false)
    }
  }

  return {
    comments,
    loading,
    error,
    total,
    hasMore,
    addComment,
    likeComment,
    deleteComment,
    loadMore,
    refresh: () => fetchComments(true)
  }
}
