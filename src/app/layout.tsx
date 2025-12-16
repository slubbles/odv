import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import "@solana/wallet-adapter-react-ui/styles.css"
import { WalletContextProvider } from "@/components/providers/WalletContextProvider"
import { QueryClientProvider } from "@/components/providers/QueryClientProvider"
import { SkipNav } from "@/components/skip-nav"
import { BottomNav } from "@/components/bottom-nav"
import { NetworkGuard } from "@/components/network-guard"
import { TestnetBanner } from "@/components/testnet-banner"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-poppins",
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: "OneDollarVentures - $1 Crowdfunding on Solana | Back Projects, Ship Products",
    template: "%s | OneDollarVentures"
  },
  description: "Decentralized crowdfunding where everyone backs with exactly $1. Milestone-based escrow protects backers. Launch your project on Solana. No VCs, no whales, just community.",
  keywords: [
    'crowdfunding',
    'solana crowdfunding',
    'web3 crowdfunding',
    'decentralized funding',
    'blockchain crowdfunding',
    'micro funding',
    '$1 backing',
    'milestone escrow',
    'crypto fundraising',
    'solana projects',
    'SOON network',
    'kickstarter alternative',
    'indiegogo alternative',
    'startup funding',
    'community funding',
    'build in public',
    'web3 startups'
  ],
  authors: [{ name: 'OneDollarVentures', url: 'https://onedollarventures.com' }],
  creator: 'OneDollarVentures',
  publisher: 'OneDollarVentures',
  applicationName: 'OneDollarVentures',
  category: 'Crowdfunding',
  classification: 'Web3 Crowdfunding Platform',
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  alternates: {
    canonical: 'https://onedollarventures.com',
  },
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://onedollarventures.com',
    siteName: 'OneDollarVentures',
    title: 'OneDollarVentures - $1 Crowdfunding on Solana',
    description: 'Decentralized crowdfunding where everyone backs with exactly $1. Milestone-based escrow protects backers. Launch your project on Solana.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OneDollarVentures - $1 Crowdfunding Platform',
      }
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    site: '@onedollarventures',
    creator: '@onedollarventures',
    title: 'OneDollarVentures - $1 Crowdfunding on Solana',
    description: 'Launch your project. Get $1 backers. Ship or die. Milestone-based escrow. Built on Solana.',
    images: ['/og-image.png'],
  },
  
  icons: {
    icon: [
      {
        url: "/odv logo - favicon 512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        url: "/odv logo - favicon 512x512.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/odv logo - favicon 512x512.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: "/odv logo - favicon 512x512.png",
    shortcut: "/odv logo - favicon 512x512.png",
  },
  
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <QueryClientProvider>
          <WalletContextProvider>
            <NetworkGuard>
              <SkipNav />
              <TestnetBanner />
              {children}
              <BottomNav />
            </NetworkGuard>
            <Toaster />
            <Analytics />
          </WalletContextProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
