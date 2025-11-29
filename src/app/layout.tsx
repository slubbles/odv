import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import "@solana/wallet-adapter-react-ui/styles.css"
import { WalletContextProvider } from "@/components/providers/WalletContextProvider"
import { SkipNav } from "@/components/skip-nav"
import { BottomNav } from "@/components/bottom-nav"
import { Toaster } from "sonner"

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
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
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
        <WalletContextProvider>
          <SkipNav />
          {children}
          <BottomNav />
          <Toaster />
          <Analytics />
        </WalletContextProvider>
      </body>
    </html>
  )
}
