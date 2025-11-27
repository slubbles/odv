import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <div className="container py-12 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Data. Your Business.</h1>
          <p className="text-muted-foreground">Last updated: January 2025. We don't sell your info. Period.</p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8 prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We collect information you provide directly to us, including wallet addresses, project submissions,
              comments, and profile information. We also collect usage data and analytics to improve our platform.
            </p>

            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Your information is used to provide and improve our services, process transactions, send notifications,
              prevent fraud, and comply with legal obligations.
            </p>

            <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We do not sell your personal information. We may share information with service providers, legal
              authorities when required, and publicly as part of blockchain transactions.
            </p>

            <h2 className="text-2xl font-bold mb-4">4. Blockchain Transparency</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Transactions and NFT ownership are recorded on public blockchains. Wallet addresses and transaction
              history are publicly visible and cannot be deleted.
            </p>

            <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We implement industry-standard security measures to protect your information. However, no method of
              transmission over the Internet is 100% secure.
            </p>

            <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              You have the right to access, correct, or delete your personal information. You can update your profile
              settings or contact us to exercise these rights.
            </p>

            <h2 className="text-2xl font-bold mb-4">7. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We use cookies and similar technologies to enhance your experience, analyze usage, and remember your
              preferences. You can control cookie settings through your browser.
            </p>

            <h2 className="text-2xl font-bold mb-4">8. Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our platform integrates with third-party services like wallet providers and blockchain networks. These
              services have their own privacy policies.
            </p>

            <h2 className="text-2xl font-bold mb-4">9. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our services are not directed to individuals under 18. We do not knowingly collect personal information
              from children.
            </p>

            <h2 className="text-2xl font-bold mb-4">10. Changes to Privacy Policy</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new
              policy on this page.
            </p>

            <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this privacy policy, please contact us at privacy@onedollarventures.com
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
