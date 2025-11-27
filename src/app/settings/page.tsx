import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, User, Bell, Lock, CreditCard, Globe, HelpCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function SettingsHubPage() {
  const settingSections = [
    {
      title: "Account Settings",
      description: "Manage your profile, email, and password",
      icon: User,
      href: "/profile",
    },
    {
      title: "Notifications",
      description: "Control your notification preferences",
      icon: Bell,
      href: "/profile#notifications",
    },
    {
      title: "Privacy & Security",
      description: "Update privacy settings and security options",
      icon: Lock,
      href: "/profile#privacy",
    },
    {
      title: "Payment Methods",
      description: "Manage your wallet and payout methods",
      icon: CreditCard,
      href: "/wallet",
    },
    {
      title: "Language & Region",
      description: "Set your preferred language and region",
      icon: Globe,
      href: "/settings/language",
    },
    {
      title: "Help & Support",
      description: "Get help and contact support",
      icon: HelpCircle,
      href: "/help",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl flex-1">
        <div className="mb-8">
          <h1 className="font-sans text-4xl font-semibold mb-2 text-balance">Settings</h1>
          <p className="text-muted-foreground text-lg">Manage your account and preferences</p>
        </div>

        <div className="space-y-4">
          {settingSections.map((section) => {
            const Icon = section.icon
            return (
              <Card key={section.title} className="hover:border-accent/50 transition-colors">
                <Link href={section.href}>
                  <Button variant="ghost" className="w-full h-auto p-6 justify-start">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                        <Icon className="h-6 w-6 text-accent" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-base mb-1">{section.title}</p>
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                    </div>
                  </Button>
                </Link>
              </Card>
            )
          })}
        </div>
      </div>
      <Footer />
    </div>
  )
}
