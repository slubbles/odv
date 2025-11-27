"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, User, Briefcase, Wallet, Sparkles } from "lucide-react"

export default function CreatorOnboardingPage() {
  const [step, setStep] = useState(1)

  const steps = [
    { number: 1, title: "Profile", icon: User },
    { number: 2, title: "Experience", icon: Briefcase },
    { number: 3, title: "Payment", icon: Wallet },
    { number: 4, title: "Complete", icon: Sparkles },
  ]

  return (
    <div className="min-h-screen">
      <Header />
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="font-sans text-4xl font-semibold mb-2 text-balance">Ready to Build?</h1>
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
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input id="displayName" placeholder="Your name or brand" />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" placeholder="Tell backers about yourself and your vision..." rows={4} />
                  </div>

                  <div>
                    <Label htmlFor="website">Website (optional)</Label>
                    <Input id="website" placeholder="https://yourwebsite.com" />
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
                    <Input id="skills" placeholder="e.g., Software Development, Design, Marketing" />
                  </div>

                  <div>
                    <Label htmlFor="experience">Previous Work</Label>
                    <Textarea
                      id="experience"
                      placeholder="Share your relevant experience and past projects..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="portfolio">Portfolio Links (optional)</Label>
                    <Input id="portfolio" placeholder="GitHub, Behance, LinkedIn, etc." />
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
                    <Label htmlFor="wallet">Wallet Address</Label>
                    <Input id="wallet" placeholder="Connect your wallet or enter address" />
                  </div>

                  <div>
                    <Label htmlFor="bank">Bank Account (optional)</Label>
                    <Input id="bank" placeholder="For fiat withdrawals" />
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
                <p className="text-muted-foreground mb-8">Profile complete. Now go build something worth backing.</p>
                <Button size="lg" className="bg-accent hover:bg-accent/90">
                  Submit Your First Project
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
