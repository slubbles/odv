"use client"

import { useState } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useRouter } from "next/navigation"
import { createInitializeCampaignTransaction } from "@/lib/solana/transaction"
import { parseBlockchainError } from "@/lib/solana/error-handling"
import { getCampaignPDA, getNextCampaignId } from "@/lib/solana/program"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, CheckCircle2, AlertCircle, Loader2, Clock, ExternalLink, Pencil } from "lucide-react"
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
  const [submissionError, setSubmissionError] = useState<{
    stage: 'blockchain' | 'database' | 'unknown'
    message: string
    txSignature?: string
    details?: string
  } | null>(null)
  const { connection } = useConnection()
  const { publicKey, connected, sendTransaction } = useWallet()
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

    if (parseFloat(formData.goal) < 100) {
      toast.error("Minimum funding goal is $100")
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
    setSubmissionError(null) // Clear any previous errors

    try {
      // Calculate campaign deadline from duration
      const durationDays = parseInt(formData.duration) || 30
      const deadlineDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000)
      const deadlineTimestamp = Math.floor(deadlineDate.getTime() / 1000)
      const deadlineISO = deadlineDate.toISOString()

      const goalAmount = parseFloat(formData.goal)

      // 1. Create and send blockchain transaction
      console.log('[Submit] Starting campaign creation...', {
        goal: goalAmount,
        deadline: deadlineTimestamp,
        milestones: formData.milestones.length,
        wallet: publicKey.toString().slice(0, 8) + '...'
      })
      
      // Get next campaign ID from platform config
      console.log('[Submit] Fetching next campaign ID...')
      const campaignId = await getNextCampaignId(connection)
      console.log('[Submit] Next campaign ID:', campaignId)
      
      // Check if THIS campaign ID already exists (race condition check)
      const [campaignPDA] = getCampaignPDA(publicKey, campaignId)
      console.log('[Submit] Checking if campaign PDA exists:', campaignPDA.toString())
      
      const accountInfo = await connection.getAccountInfo(campaignPDA)
      if (accountInfo !== null) {
        console.error('[Submit] Campaign ID already taken (race condition)')
        throw new Error('Campaign ID conflict. Please try again.')
      }
      
      console.log('[Submit] Campaign ID available, proceeding with initialization')
      toast.info("Initializing campaign on blockchain...")
      
      const transaction = await createInitializeCampaignTransaction(
          connection,
          publicKey,
          campaignId,
          goalAmount,
          deadlineTimestamp,
          formData.milestones.map(m => ({
            title: m.title,
            amount: (goalAmount * m.percentage) / 100
          }))
      )
      
      console.log('[Submit] Transaction created, requesting signature...')

      let signature: string
      try {
        signature = await sendTransaction(transaction, connection, {
          skipPreflight: false,
          preflightCommitment: 'confirmed'
        })
        console.log('[Submit] Transaction signature:', signature)
      } catch (sendError: any) {
        console.error('[Submit] Send transaction error:', sendError)
        throw sendError // Re-throw to be caught by outer catch
      }
      
      toast.info("Transaction sent. Waiting for confirmation...")
      
      try {
        const confirmation = await connection.confirmTransaction(signature, 'confirmed')
        if (confirmation.value.err) {
          const errStr = JSON.stringify(confirmation.value.err)
          console.error('[Submit] Transaction confirmation error:', errStr)
          throw new Error(`Transaction failed: ${errStr}`)
        }
        console.log('[Submit] Transaction confirmed successfully')
      } catch (confirmError: any) {
        console.error('[Submit] Confirmation error:', confirmError)
        throw confirmError
      }

      toast.success("Campaign initialized on blockchain!")

      // 2. Save metadata to database
      console.log('[Submit] Saving project metadata to database...')
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
          goal: goalAmount,
          deadline: deadlineISO,
          video_url: formData.videoUrl || null,
          image_url: formData.imageUrl || null,
          creator_wallet: publicKey.toString(),
          campaign_id: campaignId,
          campaign_pda: campaignPDA.toString(),
          milestones: formData.milestones.map(m => ({
            title: m.title,
            percentage: m.percentage,
            deadline: new Date(m.deadline).toISOString()
          }))
        })
      })

      const data = await response.json()
      console.log('[Submit] Database response:', { ok: response.ok, status: response.status, data })

      if (!response.ok) {
        console.error('[Submit] Database save failed:', data)
        // Set detailed error state for database failures
        setSubmissionError({
          stage: 'database',
          message: data.error || 'Failed to save project to database',
          details: data.details || 'The transaction was successful on-chain, but we could not save your project details.',
          txSignature: signature
        })
        toast.error(`Database error: ${data.error || 'Failed to save project'}`)
        return // Don't throw, just return so user sees error state
      }

      console.log('[Submit] Project created successfully:', data.project?.id)

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
      
      // Use the blockchain error parser for consistent error handling
      const parsed = parseBlockchainError(error)
      
      // Handle user rejection specially - don't show an error, just a neutral message
      if (parsed.type === 'USER_REJECTED') {
        toast.info("Transaction cancelled. Click 'Submit for Review' again when you're ready to proceed.")
        setIsSubmitting(false)
        return
      }
      
      // Set error state for blockchain failures
      setSubmissionError({
        stage: 'blockchain',
        message: parsed.userMessage,
        details: parsed.suggestion || 'The blockchain transaction could not be completed. Please try again.'
      })
      
      // Display the error with the suggestion
      const errorMessage = parsed.suggestion 
        ? `${parsed.userMessage}. ${parsed.suggestion}`
        : parsed.userMessage
      
      toast.error(errorMessage)
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
      if (formData.description.length < 50) {
        toast.error("Description must be at least 50 characters")
        return
      }
    }

    if (step === 3) {
      if (!formData.goal || !formData.duration) {
        toast.error("Please set a funding goal and duration")
        return
      }
      
      if (parseFloat(formData.goal) < 100) {
        toast.error("Minimum funding goal is $100")
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

  // Error screen after failed submission
  if (submissionError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-2xl flex items-center justify-center">
          <Card className="w-full p-4 sm:p-6 md:p-8">
            <div className="mb-4 sm:mb-6 text-center">
              <div className="h-12 w-12 sm:h-16 sm:w-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold mb-2">Submission {submissionError.stage === 'blockchain' ? 'Failed' : 'Partially Complete'}</h1>
              <p className="text-sm sm:text-base text-muted-foreground">{submissionError.message}</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 space-y-3 sm:space-y-4">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start sm:items-center gap-2 text-xs sm:text-sm">
                  <div className="flex-shrink-0 mt-0.5 sm:mt-0">
                    {submissionError.stage === 'blockchain' ? (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <span className="font-medium flex-1">Blockchain Transaction</span>
                  <span className="text-muted-foreground text-xs sm:text-sm">
                    {submissionError.stage === 'blockchain' ? 'Failed' : 'Completed'}
                  </span>
                </div>
                
                {submissionError.txSignature && (
                  <div className="pl-6 text-xs">
                    <a 
                      href={`https://explorer.solana.com/tx/${submissionError.txSignature}?cluster=custom&customUrl=${encodeURIComponent('https://rpc.testnet.soo.network/rpc')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1 break-all"
                    >
                      <span className="hidden sm:inline">View transaction</span>
                      <span className="sm:hidden">View on explorer</span>
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                  </div>
                )}

                <div className="flex items-start sm:items-center gap-2 text-xs sm:text-sm">
                  <div className="flex-shrink-0 mt-0.5 sm:mt-0">
                    {submissionError.stage === 'database' ? (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <span className="font-medium flex-1">Database Storage</span>
                  <span className="text-muted-foreground text-xs sm:text-sm">
                    {submissionError.stage === 'database' ? 'Failed' : 'Not Started'}
                  </span>
                </div>
              </div>

              <div className="border-t pt-3 sm:pt-4">
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {submissionError.details}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {submissionError.stage === 'database' && submissionError.txSignature && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 sm:p-4 text-xs sm:text-sm">
                  <p className="font-medium text-blue-600 dark:text-blue-400 mb-2">📧 Need Help?</p>
                  <p className="text-muted-foreground mb-2 leading-relaxed">
                    Your campaign was created on-chain successfully. Please contact support with your transaction signature so we can manually add your project.
                  </p>
                  <div className="bg-black/20 p-2 rounded">
                    <code className="block text-[10px] sm:text-xs break-all leading-tight">
                      {submissionError.txSignature}
                    </code>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  onClick={() => {
                    setSubmissionError(null)
                    setStep(1)
                  }}
                  variant="outline"
                  className="w-full sm:flex-1"
                  size="default"
                >
                  Start Over
                </Button>
                {submissionError.stage === 'blockchain' && (
                  <Button
                    onClick={() => {
                      setSubmissionError(null)
                      handleSubmit()
                    }}
                    className="w-full sm:flex-1"
                    size="default"
                  >
                    Try Again
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  // Success screen after submission
  if (submittedProject) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-2xl flex items-center justify-center">
          <Card className="w-full p-4 sm:p-6 md:p-8 text-center">
            <div className="mb-4 sm:mb-6">
              <div className="h-12 w-12 sm:h-16 sm:w-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold mb-2">Project Submitted!</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Your project is now in the review queue</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 text-left space-y-2 sm:space-y-3">
              <div className="flex justify-between gap-2 text-xs sm:text-sm">
                <span className="text-muted-foreground flex-shrink-0">Title</span>
                <span className="font-semibold text-right break-words">{submittedProject.title}</span>
              </div>
              <div className="flex justify-between gap-2 text-xs sm:text-sm">
                <span className="text-muted-foreground">Category</span>
                <Badge variant="outline" className="text-xs">{submittedProject.category}</Badge>
              </div>
              <div className="flex justify-between gap-2 text-xs sm:text-sm">
                <span className="text-muted-foreground">Goal</span>
                <span className="font-semibold">${submittedProject.goal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center gap-2 text-xs sm:text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">In Review Queue</span>
                  <span className="sm:hidden">Pending</span>
                </Badge>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
              Our team will review your project shortly. You&apos;ll be notified once it&apos;s approved and live.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button variant="outline" className="w-full sm:flex-1" size="default" asChild>
                <Link href={`/project/${submittedProject.id}`}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Project
                </Link>
              </Button>
              <Button className="w-full sm:flex-1 bg-accent text-accent-foreground" size="default" asChild>
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
          <div className="flex items-center justify-center max-w-2xl mx-auto">
            <div className="flex-1 text-center">
              <span className={`text-xs sm:text-sm ${step >= 1 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>Concept</span>
            </div>
            <div className="flex-1 text-center">
              <span className={`text-xs sm:text-sm ${step >= 2 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>Details</span>
            </div>
            <div className="flex-1 text-center">
              <span className={`text-xs sm:text-sm ${step >= 3 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>Milestones</span>
            </div>
            <div className="flex-1 text-center">
              <span className={`text-xs sm:text-sm ${step >= 4 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>Review</span>
            </div>
          </div>
        </div>

        {/* Form Steps */}
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">
              {step === 1 && "Project Concept"}
              {step === 2 && "Project Details"}
              {step === 3 && "Milestones & Funding"}
              {step === 4 && "Review Project"}
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
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>This will be shown on your pitch on /discover page</span>
                    <span className={formData.description.length < 50 ? "text-red-500" : "text-green-500"}>
                      {formData.description.length}/50 characters minimum
                    </span>
                  </div>
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                    <div>
                      <Label className="text-sm sm:text-base">Milestones *</Label>
                      <p className="text-xs text-muted-foreground mt-1">Define how you&apos;ll deliver value.</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addMilestone} className="w-full sm:w-auto">
                      + Add Another
                    </Button>
                  </div>

                  {/* Milestone percentage notice */}
                  <div className="p-3 sm:p-4 rounded-lg bg-accent/10 border border-accent/30">
                    <p className="text-xs sm:text-sm font-medium text-accent-foreground flex items-start sm:items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5 sm:mt-0" />
                      <span>All milestone percentages must add up to exactly 100%</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 ml-6">
                      Current total: <span className={`font-bold ${formData.milestones.reduce((sum, m) => sum + m.percentage, 0) === 100 ? 'text-green-500' : 'text-yellow-500'}`}>
                        {formData.milestones.reduce((sum, m) => sum + m.percentage, 0)}%
                      </span>
                    </p>
                  </div>

                  {formData.milestones.map((milestone, index) => (
                    <Card key={index} className="bg-muted/50">
                      <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm sm:text-base">Milestone {index + 1}</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMilestone(index)}
                            className="h-8 px-2 sm:px-3 text-xs sm:text-sm"
                          >
                            Remove
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                          <div className="space-y-2 sm:col-span-2">
                            <Label className="text-xs sm:text-sm">Title</Label>
                            <Input
                              placeholder="Milestone title"
                              value={milestone.title}
                              onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs sm:text-sm">Percentage (%)</Label>
                            <Input
                              type="number"
                              placeholder="25"
                              value={milestone.percentage || ''}
                              onChange={(e) => updateMilestone(index, 'percentage', parseFloat(e.target.value) || 0)}
                              className="text-sm"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs sm:text-sm">Deadline</Label>
                          <Input
                            type="date"
                            min={getMinDate()}
                            value={milestone.deadline}
                            onChange={(e) => updateMilestone(index, 'deadline', e.target.value)}
                            className="cursor-pointer text-sm"
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
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Project Summary</h3>
                  </div>
                  <div className="space-y-3 text-sm bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2 border-b border-border/50 pb-2">
                      <span className="font-medium">Basic Info</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex items-center justify-center" onClick={() => setStep(1)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                      <span className="text-muted-foreground text-xs sm:text-sm">Title:</span>
                      <span className="sm:col-span-2 font-medium">{formData.title}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                      <span className="text-muted-foreground text-xs sm:text-sm">Category:</span>
                      <span className="sm:col-span-2">{formData.category}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                      <span className="text-muted-foreground text-xs sm:text-sm">Tagline:</span>
                      <span className="sm:col-span-2">{formData.tagline}</span>
                    </div>
                    {formData.imageUrl && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                        <span className="text-muted-foreground text-xs sm:text-sm">Image:</span>
                        <span className="sm:col-span-2 truncate text-xs">{formData.imageUrl}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-2 mt-4 border-b border-border/50 pb-2">
                      <span className="font-medium">Story</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex items-center justify-center" onClick={() => setStep(2)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                      <span className="text-muted-foreground text-xs sm:text-sm">Description:</span>
                      <span className="sm:col-span-2 line-clamp-3 text-xs">{formData.description}</span>
                    </div>
                    {formData.problem && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                        <span className="text-muted-foreground text-xs sm:text-sm">Problem:</span>
                        <span className="sm:col-span-2 line-clamp-2 text-xs">{formData.problem}</span>
                      </div>
                    )}
                    {formData.solution && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                        <span className="text-muted-foreground text-xs sm:text-sm">Solution:</span>
                        <span className="sm:col-span-2 line-clamp-2 text-xs">{formData.solution}</span>
                      </div>
                    )}
                    {formData.videoUrl && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                        <span className="text-muted-foreground text-xs sm:text-sm">Video:</span>
                        <span className="sm:col-span-2 truncate text-xs">{formData.videoUrl}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-2 mt-4 border-b border-border/50 pb-2">
                      <span className="font-medium">Funding</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex items-center justify-center" onClick={() => setStep(3)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                      <span className="text-muted-foreground text-xs sm:text-sm">Goal:</span>
                      <span className="sm:col-span-2 font-medium">${formData.goal}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                      <span className="text-muted-foreground text-xs sm:text-sm">Duration:</span>
                      <span className="sm:col-span-2">{formData.duration} days</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                      <span className="text-muted-foreground text-xs sm:text-sm">Milestones:</span>
                      <div className="sm:col-span-2 space-y-1">
                        <p>{formData.milestones.length} milestones defined</p>
                        <ul className="list-disc list-inside text-xs text-muted-foreground">
                          {formData.milestones.map((m, i) => (
                            <li key={i}>{m.title} ({m.percentage}%) - {m.deadline}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
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

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:flex-1 bg-transparent"
                  onClick={() => setStep(step - 1)}
                  disabled={isSubmitting}
                  size="default"
                >
                  Back
                </Button>
              )}

              {step < 4 ? (
                <Button
                  type="button"
                  className="w-full sm:flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={handleNextStep}
                  size="default"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="button"
                  className="w-full sm:flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !connected}
                  size="default"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span className="hidden sm:inline">Submitting...</span>
                      <span className="sm:hidden">Submitting</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Submit Project</span>
                      <span className="sm:hidden">Submit</span>
                    </>
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
