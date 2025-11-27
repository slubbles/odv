import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Users, Heart, AlertTriangle } from "lucide-react"

export default function CommunityGuidelinesPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <div className="container py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent/20 mb-4">
            <Shield className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Community Guidelines</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't be a jerk. Support builders. That's it.
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-accent/30 text-center">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-bold mb-2">Be Respectful</h3>
              <p className="text-sm text-muted-foreground">Builders are people. Treat them like it.</p>
            </CardContent>
          </Card>

          <Card className="border-accent/30 text-center">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-bold mb-2">Be Supportive</h3>
              <p className="text-sm text-muted-foreground">They're trying. Help them win.</p>
            </CardContent>
          </Card>

          <Card className="border-accent/30 text-center">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-bold mb-2">Be Honest</h3>
              <p className="text-sm text-muted-foreground">Lies kill trust. Fast.</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Guidelines */}
        <div className="space-y-8">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">✓ Do's</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span>Provide accurate and honest information in project submissions</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span>Give constructive feedback and helpful suggestions</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span>Report suspicious activity or violations</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span>Respect intellectual property rights</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span>Follow through on project milestones and commitments</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span>Vote thoughtfully on milestone completions</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-destructive/30">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                Don'ts
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-destructive">•</span>
                  <span>Submit false or misleading project information</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-destructive">•</span>
                  <span>Harass, bully, or discriminate against community members</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-destructive">•</span>
                  <span>Spam or promote unrelated content</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-destructive">•</span>
                  <span>Manipulate voting or gaming the system</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-destructive">•</span>
                  <span>Share inappropriate or offensive content</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-destructive">•</span>
                  <span>Use the platform for illegal activities</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Enforcement</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Violations of these guidelines may result in:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-accent">1.</span>
                  <span>Warning and removal of content</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">2.</span>
                  <span>Temporary account suspension</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">3.</span>
                  <span>Permanent account termination</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">4.</span>
                  <span>Legal action for serious violations</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-accent/10 border-accent/30">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Reporting Violations</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you see something that violates these guidelines, please report it immediately. Our team reviews all
                reports and takes appropriate action. You can report content using the report button on projects and
                comments, or contact support@onedollarventures.com
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
