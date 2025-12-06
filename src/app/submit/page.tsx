"use client"

import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, CheckCircle2, AlertCircle, Loader2, Clock, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface MilestoneInput {
  title: string
  percentage: number
  deadline: string
}

interface SubmittedProject {
  id: string
  title: string
  category: string
  goal: number
  status: string
}

export default function SubmitPage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedProject, setSubmittedProject] = useState<SubmittedProject | null>(null)
  const { publicKey, connected } = useWallet()
  const router = useRouter()

  // Get minimum date for milestone deadlines (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  // Form state - initialize with one empty milestone
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    tagline: "",
    imageUrl: "",
    description: "",
    problem: "",
    solution: "",
    videoUrl: "",
    goal: "",
    duration: "30",
    milestones: [{ title: "", percentage: 0, deadline: "" }] as MilestoneInput[]
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { title: "", percentage: 0, deadline: "" }]
    }))
  }

  const updateMilestone = (index: number, field: keyof MilestoneInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map((m, i) =>
        i === index ? { ...m, [field]: value } : m
      )
    }))
  }

  const removeMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async () => {
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet first")
      return
    }

    // Validation
    if (!formData.title || !formData.tagline || !formData.description || !formData.category || !formData.goal) {
      toast.error("Please fill in all required fields")
      return
    }

    if (formData.milestones.length === 0) {
      toast.error("Please add at least one milestone")
      return
    }

    const totalPercentage = formData.milestones.reduce((sum, m) => sum + m.percentage, 0)
    if (totalPercentage !== 100) {
      toast.error(`Milestone percentages must total 100% (currently ${totalPercentage}%)`)
      return
    }

    // Validate milestone deadlines
    for (const m of formData.milestones) {
      if (!m.deadline) {
        toast.error("All milestones must have a deadline")
        return
      }
    }

    setIsSubmitting(true)

    try {
      // Calculate campaign deadline from duration
      const durationDays = parseInt(formData.duration) || 30
      const deadline = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString()

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          tagline: formData.tagline,
          description: formData.description,
          category: formData.category,
          goal: parseFloat(formData.goal),
          deadline: deadline,
          video_url: formData.videoUrl || null,
          image_url: formData.imageUrl || null,
          creator_wallet: publicKey.toString(),
          milestones: formData.milestones.map(m => ({
            title: m.title,
            percentage: m.percentage,
            deadline: new Date(m.deadline).toISOString()
          }))
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create project')
      }

      // Show success state with project details
      setSubmittedProject({
        id: data.project?.id || data.id,
        title: formData.title,
        category: formData.category,
        goal: parseFloat(formData.goal),
        status: 'queue'
      })

      toast.success("Project submitted for review!")

    } catch (error: any) {
      console.error('Failed to create project:', error)
      toast.error(error.message || 'Failed to create project')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNextStep = () => {
    // Validate current step
    if (step === 1) {
      if (!formData.title || !formData.category || !formData.tagline) {
        toast.error("Please fill in all required fields")
        return
      }
    }

    if (step === 2) {
      if (!formData.description) {
        toast.error("Please provide a project description")
        return
      }
    }

    if (step === 3) {
      if (!formData.goal || !formData.duration) {
        toast.error("Please set a funding goal and duration")
        return
      }
      if (formData.milestones.length === 0) {
        toast.error("Please add at least one milestone")
        return
      }

      const totalPercentage = formData.milestones.reduce((sum, m) => sum + m.percentage, 0)
      if (totalPercentage !== 100) {
        toast.error(`Milestone percentages must total 100% (currently ${totalPercentage}%)`)
        return
      }

      // Validate milestone deadlines
      for (const m of formData.milestones) {
        if (!m.deadline) {
          toast.error("All milestones must have a deadline")
          return
        }
      }
    }

    setStep(prev => Math.min(prev + 1, 4))
  }

  // Success screen after submission
  if (submittedProject) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-2xl flex items-center justify-center">
          <Card className="w-full p-8 text-center">
            <div className="mb-6">
              <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Project Submitted!</h1>
              <p className="text-muted-foreground">Your project is now in the review queue</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-6 mb-6 text-left space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Title</span>
                <span className="font-semibold">{submittedProject.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <Badge variant="outline">{submittedProject.category}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Goal</span>
                <span className="font-semibold">${submittedProject.goal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  <Clock className="h-3 w-3 mr-1" />
                  In Review Queue
                </Badge>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              Our team will review your project shortly. You&apos;ll be notified once it&apos;s approved and live.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex-1" asChild>
                <Link href={`/project/${submittedProject.id}`}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Project
                </Link>
              </Button>
              <Button className="flex-1 bg-accent text-accent-foreground" asChild>
                <Link href="/dashboard/creator">
                  Go to Dashboard
                </Link>
              </Button>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl pb-24 md:pb-12">
        <div className="mb-8 sm:mb-12 text-center">
          <Badge className="mb-3 sm:mb-4 bg-accent/20 text-accent-foreground border-accent/30 text-xs sm:text-sm">
            Show us
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-4">Stop shouting into the void</h1>
          <p className="text-lg sm:text-xl text-muted-foreground px-4">Show us what you built. Get seen. Get backed.</p>
        </div>

        <div className="mb-8 sm:mb-12">
          {/* Step Progress Indicator */}
          <div className="flex items-center justify-center mb-4 sm:mb-6 max-w-2xl mx-auto">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div
                  className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base shrink-0 ${
                    s <= step 
                      ? "bg-accent text-accent-foreground" 
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s < step ? <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" /> : s}
                </div>
                {s < 4 && (
                  <div 
                    className={`h-1 flex-1 mx-2 sm:mx-3 ${
                      s < step ? "bg-accent" : "bg-muted"
                    }`} 
                  />
                )}
              </div>
            ))}
          </div>
          {/* Step Labels */}
          <div className="grid grid-cols-4 gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
            <span className={`text-center ${step >= 1 ? 'text-foreground font-medium' : ''}`}>Basic Info</span>
            <span className={`text-center ${step >= 2 ? 'text-foreground font-medium' : ''}`}>Details</span>
            <span className={`text-center ${step >= 3 ? 'text-foreground font-medium' : ''}`}>Funding</span>
            <span className={`text-center ${step >= 4 ? 'text-foreground font-medium' : ''}`}>Review</span>
          </div>
        </div>

        {/* Form Steps */}
        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Basic Info"}
              {step === 2 && "The Details"}
              {step === 3 && "Funding & Rewards"}
              {step === 4 && "Review"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="title">What'd you build? *</Label>
                  <Input
                    id="title"
                    placeholder="Project title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pick one" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Art & Design">Art & Design</SelectItem>
                      <SelectItem value="Gaming">Gaming</SelectItem>
                      <SelectItem value="Social Impact">Social Impact</SelectItem>
                      <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                      <SelectItem value="Innovation">Innovation</SelectItem>
                      <SelectItem value="Health & Wellness">Health & Wellness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">One-line pitch *</Label>
                  <Input
                    id="tagline"
                    placeholder="Describe it in one sentence"
                    value={formData.tagline}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Project Image URL (Optional)</Label>
                  <Input
                    id="imageUrl"
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Enter an image URL or upload functionality coming soon</p>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="description">Tell us about it *</Label>
                  <Textarea
                    id="description"
                    placeholder="Pitch it in plain English. Be real."
                    rows={6}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="problem">What problem does this solve?</Label>
                  <Textarea
                    id="problem"
                    placeholder="What's broken that needs fixing?"
                    rows={3}
                    value={formData.problem}
                    onChange={(e) => handleInputChange('problem', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="solution">How will you solve it?</Label>
                  <Textarea
                    id="solution"
                    placeholder="Your approach. Keep it simple."
                    rows={3}
                    value={formData.solution}
                    onChange={(e) => handleInputChange('solution', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoUrl">Video URL (Optional)</Label>
                  <Input
                    id="videoUrl"
                    placeholder="https://youtube.com/..."
                    value={formData.videoUrl}
                    onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">A short video explaining your project can help get more backers</p>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="goal">Funding Goal (USD) *</Label>
                    <Input
                      id="goal"
                      type="number"
                      placeholder="10000"
                      value={formData.goal}
                      onChange={(e) => handleInputChange('goal', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Campaign Duration *</Label>
                    <Select 
                      value={formData.duration} 
                      onValueChange={(value) => handleInputChange('duration', value)}
                    >
                      <SelectTrigger id="duration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="21">21 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="45">45 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Milestones *</Label>
                      <p className="text-xs text-muted-foreground mt-1">Define how you&apos;ll deliver value.</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
                      + Add Another
                    </Button>
                  </div>

                  {/* Milestone percentage notice */}
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                    <p className="text-sm font-medium text-accent-foreground flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-accent" />
                      All milestone percentages must add up to exactly 100%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Current total: <span className={`font-bold ${formData.milestones.reduce((sum, m) => sum + m.percentage, 0) === 100 ? 'text-green-500' : 'text-yellow-500'}`}>
                        {formData.milestones.reduce((sum, m) => sum + m.percentage, 0)}%
                      </span>
                    </p>
                  </div>

                  {formData.milestones.map((milestone, index) => (
                    <Card key={index} className="bg-muted/50">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Milestone {index + 1}</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMilestone(index)}
                          >
                            Remove
                          </Button>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-2 md:col-span-2">
                            <Label>Title</Label>
                            <Input
                              placeholder="Milestone title"
                              value={milestone.title}
                              onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Percentage (%)</Label>
                            <Input
                              type="number"
                              placeholder="25"
                              value={milestone.percentage || ''}
                              onChange={(e) => updateMilestone(index, 'percentage', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Deadline</Label>
                          <Input
                            type="date"
                            min={getMinDate()}
                            value={milestone.deadline}
                            onChange={(e) => updateMilestone(index, 'deadline', e.target.value)}
                            className="cursor-pointer"
                          />
                          <p className="text-xs text-muted-foreground">Must be a future date</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {formData.milestones.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Total: {formData.milestones.reduce((sum, m) => sum + m.percentage, 0)}%
                      (must equal 100%)
                    </div>
                  )}
                </div>
              </>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Project Summary</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Title:</span> {formData.title}</p>
                    <p><span className="text-muted-foreground">Category:</span> {formData.category}</p>
                    <p><span className="text-muted-foreground">Tagline:</span> {formData.tagline}</p>
                    <p><span className="text-muted-foreground">Goal:</span> ${formData.goal}</p>
                    <p><span className="text-muted-foreground">Duration:</span> {formData.duration} days</p>
                    <p><span className="text-muted-foreground">Milestones:</span> {formData.milestones.length}</p>
                  </div>
                </div>

                {!connected && (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="flex gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Wallet not connected</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Please connect your wallet to submit the project
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4 pt-6">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setStep(step - 1)}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
              )}

              {step < 4 ? (
                <Button
                  type="button"
                  className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={handleNextStep}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="button"
                  className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !connected}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Project'
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
