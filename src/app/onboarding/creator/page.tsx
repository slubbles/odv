"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, User, Briefcase, Wallet, Sparkles, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface FormData {
  displayName: string
  bio: string
  website: string
  skills: string
  experience: string
  portfolio: string
  wallet: string
}

export default function CreatorOnboardingPage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { publicKey, connected } = useWallet()
  const { setVisible: openWalletModal } = useWalletModal()
  const router = useRouter()
  
  const [formData, setFormData] = useState<FormData>({
    displayName: "",
    bio: "",
    website: "",
    skills: "",
    experience: "",
    portfolio: "",
    wallet: ""
  })

  // Auto-fill wallet address when connected
  useEffect(() => {
    if (connected && publicKey) {
      setFormData(prev => ({ ...prev, wallet: publicKey.toString() }))
    }
  }, [connected, publicKey])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    // Validate current step
    if (step === 1) {
      if (!formData.displayName.trim()) {
        toast.error("Please enter your display name")
        return
      }
    }
    
    if (step === 3) {
      if (!formData.wallet) {
        toast.error("Please connect your wallet or enter a wallet address")
        return
      }
    }
    
    setStep(Math.min(4, step + 1))
  }

  const handleComplete = async () => {
    setIsSubmitting(true)
    try {
      // In a real app, this would save to the backend
      // For now, just simulate a save and redirect
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Profile created successfully!")
      router.push("/submit")
    } catch (error) {
      toast.error("Failed to save profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { number: 1, title: "Profile", icon: User },
    { number: 2, title: "Experience", icon: Briefcase },
    { number: 3, title: "Payment", icon: Wallet },
    { number: 4, title: "Complete", icon: Sparkles },
  ]

  return (
    <div className="min-h-screen">
      <Header />
      <div className="min-h-screen bg-background flex items-center justify-center p-4 pb-24 md:pb-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="font-sans text-3xl sm:text-4xl font-semibold mb-2 text-balance">Ready to Build?</h1>
            <p className="text-muted-foreground text-lg">Set up your profile. Start shipping.</p>
          </div>

          <div className="flex items-center justify-between mb-8">
            {steps.map((s, idx) => (
              <div key={s.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                      step >= s.number
                        ? "border-accent bg-accent/20 text-accent"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {step > s.number ? <CheckCircle2 className="h-6 w-6" /> : <s.icon className="h-5 w-5" />}
                  </div>
                  <p className="text-sm mt-2 font-medium">{s.title}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`h-0.5 w-20 mx-2 ${step > s.number ? "bg-accent" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>

          <Card className="p-8">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-sans text-2xl font-semibold mb-4">Who Are You?</h2>
                  <p className="text-muted-foreground mb-6">Backers want to know the person behind the idea.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="displayName">Display Name *</Label>
                    <Input 
                      id="displayName" 
                      placeholder="Your name or brand"
                      value={formData.displayName}
                      onChange={(e) => handleInputChange("displayName", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      placeholder="Tell backers about yourself and your vision..." 
                      rows={4}
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="website">Website (optional)</Label>
                    <Input 
                      id="website" 
                      placeholder="https://yourwebsite.com"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-sans text-2xl font-semibold mb-4">What Can You Do?</h2>
                  <p className="text-muted-foreground mb-6">Show them you can ship. Past work counts.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="skills">Skills & Expertise</Label>
                    <Input 
                      id="skills" 
                      placeholder="e.g., Software Development, Design, Marketing"
                      value={formData.skills}
                      onChange={(e) => handleInputChange("skills", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="experience">Previous Work</Label>
                    <Textarea
                      id="experience"
                      placeholder="Share your relevant experience and past projects..."
                      rows={4}
                      value={formData.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="portfolio">Portfolio Links (optional)</Label>
                    <Input 
                      id="portfolio" 
                      placeholder="GitHub, Behance, LinkedIn, etc."
                      value={formData.portfolio}
                      onChange={(e) => handleInputChange("portfolio", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-sans text-2xl font-semibold mb-4">How Do You Get Paid?</h2>
                  <p className="text-muted-foreground mb-6">Connect wallet. Get funded. Build stuff.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="wallet">Wallet Address *</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="wallet" 
                        placeholder="Your Solana wallet address"
                        value={formData.wallet}
                        onChange={(e) => handleInputChange("wallet", e.target.value)}
                        className="font-mono text-sm"
                      />
                      {!connected && (
                        <Button 
                          variant="outline" 
                          onClick={() => openWalletModal(true)}
                          className="shrink-0"
                        >
                          <Wallet className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                      )}
                    </div>
                    {connected && publicKey && formData.wallet === publicKey.toString() && (
                      <p className="text-sm text-green-500 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        Wallet connected
                      </p>
                    )}
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      You can update your payment methods anytime in settings. All transactions are secure and
                      encrypted.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="h-10 w-10 text-accent" />
                </div>
                <h2 className="font-sans text-3xl font-semibold mb-4">You're In.</h2>
                <p className="text-muted-foreground mb-6">Profile complete. Now go build something worth backing.</p>
                
                {/* Summary */}
                <div className="text-left bg-muted/50 rounded-lg p-6 mb-8 space-y-3">
                  <h3 className="font-semibold mb-4">Your Profile Summary</h3>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{formData.displayName || "Not set"}</span>
                  </div>
                  {formData.bio && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bio</span>
                      <span className="font-medium truncate max-w-[200px]">{formData.bio}</span>
                    </div>
                  )}
                  {formData.skills && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Skills</span>
                      <span className="font-medium truncate max-w-[200px]">{formData.skills}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wallet</span>
                    <span className="font-mono text-sm truncate max-w-[200px]">
                      {formData.wallet ? `${formData.wallet.slice(0, 8)}...${formData.wallet.slice(-8)}` : "Not set"}
                    </span>
                  </div>
                </div>
                
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent/90"
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  asChild={!isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <Link href="/submit">Submit Your First Project</Link>
                  )}
                </Button>
              </div>
            )}

            {step < 4 && (
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
                  Back
                </Button>
                <Button onClick={handleNext} className="bg-accent hover:bg-accent/90">
                  Continue
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
