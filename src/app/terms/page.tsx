import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <div className="container py-12 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">The Fine Print</h1>
          <p className="text-muted-foreground">Last updated: January 2025. Read it. We mean it.</p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8 prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              By accessing and using OneDollarVentures, you accept and agree to be bound by the terms and provision of
              this agreement. If you do not agree to abide by these terms, please do not use this service.
            </p>

            <h2 className="text-2xl font-bold mb-4">2. User Accounts</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              You are responsible for maintaining the confidentiality of your wallet and account. You agree to accept
              responsibility for all activities that occur under your account.
            </p>

            <h2 className="text-2xl font-bold mb-4">3. Project Submissions</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Creators must provide accurate information when submitting projects. OneDollarVentures reserves the right
              to reject any project that violates our community guidelines or contains misleading information.
            </p>

            <h2 className="text-2xl font-bold mb-4">4. Backing & Payments</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              All backing contributions are final and non-refundable. Funds are held in smart contracts and released to
              creators based on milestone approvals by the backer community.
            </p>

            <h2 className="text-2xl font-bold mb-4">5. NFT Badges</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              NFT badges are issued as proof of backing and are stored on the blockchain. OneDollarVentures does not
              guarantee any future value or utility of NFT badges beyond their commemorative nature.
            </p>

            <h2 className="text-2xl font-bold mb-4">6. Milestone Voting</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Backers have the right to vote on milestone completions. Voting results are binding and determine fund
              releases to creators. OneDollarVentures may intervene in cases of disputes or fraud.
            </p>

            <h2 className="text-2xl font-bold mb-4">7. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Creators retain full ownership of their intellectual property. By submitting a project, creators grant
              OneDollarVentures a license to display and promote the project content.
            </p>

            <h2 className="text-2xl font-bold mb-4">8. Prohibited Activities</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Users may not engage in fraud, spam, harassment, or any illegal activities. Violations will result in
              account termination and potential legal action.
            </p>

            <h2 className="text-2xl font-bold mb-4">9. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              OneDollarVentures is a platform that connects creators and backers. We are not responsible for project
              outcomes, quality, or completion. Backers assume all risks when supporting projects.
            </p>

            <h2 className="text-2xl font-bold mb-4">10. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We reserve the right to modify these terms at any time. Users will be notified of significant changes via
              email or platform notification.
            </p>

            <h2 className="text-2xl font-bold mb-4">11. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which
              OneDollarVentures operates, without regard to its conflict of law provisions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
