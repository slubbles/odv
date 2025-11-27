"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Wallet, Heart, Sparkles, Zap } from "lucide-react"

export default function BackerOnboardingPage() {
  const [step, setStep] = useState(1)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const steps = [
    { number: 1, title: "Welcome", icon: Sparkles },
    { number: 2, title: "Interests", icon: Heart },
    { number: 3, title: "Wallet", icon: Wallet },
    { number: 4, title: "Ready", icon: Zap },
  ]

  const interests = [
    "Technology",
    "AI & ML",
    "Gaming",
    "Art & Design",
    "Fashion",
    "Food & Beverage",
    "Music",
    "Film & Video",
    "Education",
    "Healthcare",
    "Sustainability",
    "Social Impact",
  ]

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]))
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="font-sans text-4xl font-semibold mb-2 text-balance">Got $1?</h1>
            <p className="text-muted-foreground text-lg">That's all it takes to back someone's dream.</p>
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
              <div className="text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                  <Sparkles className="h-10 w-10 text-accent" />
                </div>
                <div>
                  <h2 className="font-sans text-3xl font-semibold mb-4">Your Dollar Has Power</h2>
                  <p className="text-muted-foreground text-lg">Fund builders. Get rewards. Watch ideas come to life.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-4 pt-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="font-semibold mb-2">Discover</p>
                    <p className="text-sm text-muted-foreground">Browse hundreds of creative projects</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="font-semibold mb-2">Back</p>
                    <p className="text-sm text-muted-foreground">Support creators with as little as $1</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="font-semibold mb-2">Earn</p>
                    <p className="text-sm text-muted-foreground">Get exclusive NFT rewards</p>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-sans text-2xl font-semibold mb-4">What Do You Care About?</h2>
                  <p className="text-muted-foreground mb-6">
                    Pick what matters. We'll show you projects you'll actually want to back.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {interests.map((interest) => (
                    <Badge
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`cursor-pointer px-4 py-2 text-sm ${
                        selectedInterests.includes(interest)
                          ? "bg-accent text-white border-accent"
                          : "bg-muted text-foreground border-border hover:border-accent/50"
                      }`}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Selected {selectedInterests.length} categories. You can change these anytime in settings.
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-sans text-2xl font-semibold mb-4">Connect Your Wallet</h2>
                  <p className="text-muted-foreground mb-6">Back projects. Collect NFTs. Own your rewards.</p>
                </div>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full h-auto p-4 justify-start bg-transparent">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                        <Wallet className="h-6 w-6 text-accent" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">MetaMask</p>
                        <p className="text-sm text-muted-foreground">Connect with MetaMask wallet</p>
                      </div>
                    </div>
                  </Button>
                  <Button variant="outline" className="w-full h-auto p-4 justify-start bg-transparent">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                        <Wallet className="h-6 w-6 text-accent" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">WalletConnect</p>
                        <p className="text-sm text-muted-foreground">Scan QR code to connect</p>
                      </div>
                    </div>
                  </Button>
                  <Button variant="outline" className="w-full h-auto p-4 justify-start bg-transparent">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                        <Wallet className="h-6 w-6 text-accent" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Coinbase Wallet</p>
                        <p className="text-sm text-muted-foreground">Connect with Coinbase</p>
                      </div>
                    </div>
                  </Button>
                </div>
                <Button variant="ghost" className="w-full">
                  Skip for now
                </Button>
              </div>
            )}

            {step === 4 && (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-10 w-10 text-accent" />
                </div>
                <h2 className="font-sans text-3xl font-semibold mb-4">Let's Go.</h2>
                <p className="text-muted-foreground mb-8">Find something cool. Back it. Make it happen.</p>
                <Button size="lg" className="bg-accent hover:bg-accent/90">
                  Explore Projects
                </Button>
              </div>
            )}

            {step < 4 && (
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
                  Back
                </Button>
                <Button onClick={() => setStep(Math.min(4, step + 1))} className="bg-accent hover:bg-accent/90">
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
