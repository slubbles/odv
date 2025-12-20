import type { Metadata } from "next"
import { DiscoverClient } from "./client"

export const metadata: Metadata = {
  title: "Discover Projects - OneDollarVentures | Browse Solana Crowdfunding",
  description: "Browse 476+ active crowdfunding projects on Solana. Back projects with $1 USDC. Technology, gaming, art, social impact - find projects you believe in and help them ship.",
  keywords: [
    'discover projects',
    'solana projects',
    'crowdfunding projects',
    'web3 startups',
    'blockchain projects',
    'back projects',
    'support creators',
    'crypto crowdfunding',
    '$1 backing',
    'micro funding',
    'decentralized crowdfunding',
    'web3 projects',
  ],
  openGraph: {
    title: "Discover Projects - Back with $1 on Solana",
    description: "476+ active projects. Technology, gaming, art, and more. Every project is $1 to back. Browse and support creators building cool stuff.",
    images: ['/og-discover.png'],
  },
  twitter: {
    card: "summary_large_image",
    title: "Discover Projects on OneDollarVentures",
    description: "Browse 476+ projects. Back with $1. Watch them ship.",
  },
}

export default function DiscoverPage() {
  return <DiscoverClient />
}
