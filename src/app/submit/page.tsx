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
import { Upload, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface MilestoneInput {
  title: string
  percentage: number
  deadline: string
}

export default function SubmitPage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { publicKey, connected } = useWallet()
  const router = useRouter()

  // Form state
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
    milestones: [] as MilestoneInput[]
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

    setIsSubmitting(true)

    try {
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
          videoUrl: formData.videoUrl || undefined,
          imageUrl: formData.imageUrl || undefined,
          creatorWallet: publicKey.toString(),
          twitterLink: undefined,
          githubLink: undefined,
          websiteLink: undefined,
          milestones: formData.milestones.map(m => ({
            title: m.title,
            percentage: m.percentage,
            deadline: new Date(m.deadline).toISOString()
          })),
          duration: parseInt(formData.duration)
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create project')
      }

      toast.success("Project created successfully!")
      
      // Redirect to project page or dashboard
      router.push(`/dashboard/creator`)

    } catch (error: any) {
      console.error('Failed to create project:', error)
      toast.error(error.message || 'Failed to create project')
    } finally {
      setIsSubmitting(false)
    }
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
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex-1 flex items-center">
                <div
                  className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${
                    s <= step ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s < step ? <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" /> : s}
                </div>
                {s < 4 && <div className={`h-1 flex-1 mx-1 sm:mx-2 ${s < step ? "bg-accent" : "bg-muted"}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-muted-foreground px-2">
            <span>Basic Info</span>
            <span>Details</span>
            <span>Funding</span>
            <span>Review</span>
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
                    rows={8} 
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
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
                    <Label htmlFor="duration">Campaign Duration (Days) *</Label>
                    <Input 
                      id="duration" 
                      type="number" 
                      placeholder="30" 
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Milestones *</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
                      + Add Milestone
                    </Button>
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
                            value={milestone.deadline}
                            onChange={(e) => updateMilestone(index, 'deadline', e.target.value)}
                          />
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
                  onClick={() => setStep(step + 1)}
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
