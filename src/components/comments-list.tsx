"use client"

import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Trash2, Loader2 } from "lucide-react"
import { useComments, Comment } from "@/lib/hooks/use-comments"
import { toast } from "sonner"

interface CommentsListProps {
  projectId: string
}

export function CommentsList({ projectId }: CommentsListProps) {
  const { publicKey, connected } = useWallet()
  const { 
    comments, 
    loading, 
    error, 
    total,
    hasMore, 
    addComment, 
    likeComment, 
    deleteComment,
    loadMore 
  } = useComments({ projectId })

  const [newComment, setNewComment] = useState("")
  const [posting, setPosting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set())

  const handlePostComment = async () => {
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet to comment")
      return
    }

    if (!newComment.trim()) {
      toast.error("Please enter a comment")
      return
    }

    setPosting(true)
    try {
      await addComment(newComment.trim(), publicKey.toString())
      setNewComment("")
      toast.success("Comment posted!")
    } catch (err: any) {
      toast.error(err.message || "Failed to post comment")
    } finally {
      setPosting(false)
    }
  }

  const handlePostReply = async (parentId: string) => {
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet to reply")
      return
    }

    if (!replyContent.trim()) {
      toast.error("Please enter a reply")
      return
    }

    setPosting(true)
    try {
      await addComment(replyContent.trim(), publicKey.toString(), parentId)
      setReplyContent("")
      setReplyingTo(null)
      toast.success("Reply posted!")
    } catch (err: any) {
      toast.error(err.message || "Failed to post reply")
    } finally {
      setPosting(false)
    }
  }

  const handleLike = async (commentId: string) => {
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet to like")
      return
    }

    const isLiked = likedComments.has(commentId)
    
    try {
      await likeComment(commentId, publicKey.toString(), isLiked)
      
      setLikedComments(prev => {
        const newSet = new Set(prev)
        if (isLiked) {
          newSet.delete(commentId)
        } else {
          newSet.add(commentId)
        }
        return newSet
      })
    } catch (err: any) {
      toast.error("Failed to update like")
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!connected || !publicKey) return

    if (!confirm("Are you sure you want to delete this comment?")) return

    try {
      await deleteComment(commentId, publicKey.toString())
      toast.success("Comment deleted")
    } catch (err: any) {
      toast.error(err.message || "Failed to delete comment")
    }
  }

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const renderComment = (comment: Comment, isReply = false) => {
    const user = comment.users
    const isOwner = publicKey?.toString() === comment.wallet_address
    const isLiked = likedComments.has(comment.id)

    return (
      <Card key={comment.id} className={isReply ? "ml-12 mt-3" : ""}>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage src={user?.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>
                {user?.name?.[0] || comment.wallet_address.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">
                  {user?.name || `${comment.wallet_address.slice(0, 6)}...${comment.wallet_address.slice(-4)}`}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatTimestamp(comment.created_at)}
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-3">
                {comment.content}
              </p>
              <div className="flex items-center gap-4">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className={`h-8 px-2 ${isLiked ? 'text-red-500' : ''}`}
                  onClick={() => handleLike(comment.id)}
                >
                  <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                  {comment.likes}
                </Button>
                {!isReply && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 px-2"
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Reply
                  </Button>
                )}
                {isOwner && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 px-2 text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(comment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Reply input */}
              {replyingTo === comment.id && (
                <div className="mt-4 flex gap-3">
                  <textarea
                    placeholder="Write a reply..."
                    className="flex-1 min-h-[60px] bg-muted rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="sm"
                      onClick={() => handlePostReply(comment.id)}
                      disabled={posting || !replyContent.trim()}
                    >
                      {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reply'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => {
                        setReplyingTo(null)
                        setReplyContent("")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="px-6 pb-4">
            {comment.replies.map(reply => renderComment(reply, true))}
          </div>
        )}
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* New comment input */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Avatar>
              <AvatarFallback>
                {connected && publicKey ? publicKey.toString().slice(0, 2) : '?'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <textarea
                placeholder={connected ? "Got thoughts? Drop them here..." : "Connect wallet to comment..."}
                className="w-full min-h-[100px] bg-muted rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={!connected}
              />
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {total} comment{total !== 1 ? 's' : ''}
                </span>
                <Button 
                  onClick={handlePostComment}
                  disabled={posting || !connected || !newComment.trim()}
                >
                  {posting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    'Post'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error state */}
      {error && (
        <Card className="border-red-500/30">
          <CardContent className="p-6 text-center text-red-500">
            {error}
          </CardContent>
        </Card>
      )}

      {/* Loading state */}
      {loading && comments.length === 0 && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      )}

      {/* Comments list */}
      {comments.map(comment => renderComment(comment))}

      {/* Empty state */}
      {!loading && comments.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </CardContent>
        </Card>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="text-center pt-4">
          <Button 
            variant="outline" 
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Comments'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
