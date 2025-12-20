import type { Metadata } from "next"
import SubmitClient from "./client"

export const metadata: Metadata = {
  title: "Launch Your Project - OneDollarVentures | Start Crowdfunding on Solana",
  description: "Submit your project to OneDollarVentures. Get funded for $1 per backer with milestone-based escrow on Solana. No platform fees, no VCs. Launch in 10 minutes.",
  keywords: [
    'launch project',
    'submit project',
    'crowdfund project',
    'solana crowdfunding',
    'startup funding',
    'get funded',
    'milestone escrow',
    'creator platform',
    'web3 fundraising',
    'blockchain funding',
    'crypto crowdfunding',
    'build in public',
  ],
  openGraph: {
    title: "Launch Your Project - Get $1 Backers on Solana",
    description: "No VCs. No whales. Just community support. Submit your project and get funded with milestone-based escrow. Launch your idea today.",
    images: ['/og-submit.png'],
  },
  twitter: {
    card: "summary_large_image",
    title: "Launch Your Project on OneDollarVentures",
    description: "Submit in 10 minutes. Get $1 backers. Ship or die. Built on Solana.",
  },
}

export default function SubmitPage() {
  return <SubmitClient />
}
