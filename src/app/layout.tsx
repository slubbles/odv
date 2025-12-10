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
    default: "OneDollarVentures - Back Projects with $1",
    template: "%s | OneDollarVentures"
  },
  description: "Support the next big thing with just $1. Get unique NFTs, early access, and join the journey on Solana.",
  keywords: ['crowdfunding', 'solana', 'web3', 'nft', 'crypto', 'startup funding'],
  authors: [{ name: 'OneDollarVentures' }],
  creator: 'OneDollarVentures',
  publisher: 'OneDollarVentures',
  generator: "v0.app",
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://onedollarventures.com',
    siteName: 'OneDollarVentures',
    title: 'OneDollarVentures - Back Projects with $1',
    description: 'Support the next big thing with just $1. Get unique NFTs, early access, and join the journey on Solana.',
    images: ['/og-image.png'],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'OneDollarVentures - Back Projects with $1',
    description: 'Support the next big thing with just $1. Get unique NFTs, early access, and join the journey on Solana.',
    images: ['/og-image.png'],
    creator: '@onedollarventures',
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
  
  // Manifest inline to avoid Vercel 401 issues
  manifest: {
    name: "OneDollarVentures",
    short_name: "ODV",
    description: "Back projects for just $1. Join the micro-investment revolution.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/odv logo - favicon 512x512.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "/odv logo - favicon 512x512.png",
        sizes: "192x192",
        type: "image/png"
      }
    ]
  },
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
