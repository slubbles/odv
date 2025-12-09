"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Send, CheckCircle } from "lucide-react"
import { toast } from "sonner"

interface PostUpdateFormProps {
  projectId: string
  projectTitle?: string
  onSuccess?: () => void
}

export function PostUpdateForm({ projectId, projectTitle, onSuccess }: PostUpdateFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: Replace with actual API call when endpoint is ready
      // const response = await fetch(`/api/projects/${projectId}/updates`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ title, content })
      // })
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setShowSuccess(true)
      toast.success("Update posted successfully!")
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setTitle("")
        setContent("")
        setShowSuccess(false)
        onSuccess?.()
      }, 2000)
    } catch (error) {
      console.error("Failed to post update:", error)
      toast.error("Failed to post update. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showSuccess) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Update Posted!</h3>
              <p className="text-muted-foreground">Your backers will be notified.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post an Update</CardTitle>
        <CardDescription>
          Keep your backers in the loop. Share progress, milestones, or just say thanks.
          {projectTitle && <span className="block mt-1 font-medium text-foreground">Project: {projectTitle}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Update Title *</Label>
            <Input
              id="title"
              placeholder="e.g., MVP Launch Complete! 🚀"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">{title.length}/100 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Update Content *</Label>
            <Textarea
              id="content"
              placeholder="Share what you've been working on, what's next, or any important news your backers should know..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
              rows={12}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">{content.length} characters</p>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              type="submit" 
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Post Update
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setTitle("")
                setContent("")
              }}
              disabled={isSubmitting}
            >
              Clear
            </Button>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Tip:</strong> Updates are sent to all your backers via email and appear on your project page. Be
              authentic, share both wins and challenges!
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
