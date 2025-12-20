import type { Metadata } from "next"
import { HowItWorksClient } from "./client"

export const metadata: Metadata = {
  title: "How It Works - OneDollarVentures",
  description: "No VC meetings. No pitch decks to billionaires. Just your idea, their $1, and the internet. Learn how OneDollarVentures milestone-based crowdfunding works.",
  openGraph: {
    title: "How OneDollarVentures Works - $1 Backing, Milestone Voting",
    description: "Every project costs exactly $1 USDC to back. Backers vote on milestones. Creators get paid when they ship. Simple, transparent, fair.",
  },
  twitter: {
    card: "summary_large_image",
    title: "How It Works - $1 Crowdfunding on Solana",
    description: "No VC meetings. No whales. Just community-funded projects with milestone-based escrow.",
  },
}

export default function HowItWorksPage() {
  return <HowItWorksClient />
}
