import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletContextProvider } from "@/components/providers/WalletContextProvider";
import { Navbar } from "@/components/navbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

// SEPARATE viewport export (Next.js 15 requirement)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'OneDollarVentures - Back Projects with $1',
    template: '%s | OneDollarVentures'
  },
  description: 'Support the next big thing with just $1. Get unique NFTs, early access, and join the journey on Solana.',
  keywords: ['crowdfunding', 'solana', 'web3', 'nft', 'crypto', 'startup funding'],
  authors: [{ name: 'OneDollarVentures' }],
  creator: 'OneDollarVentures',
  publisher: 'OneDollarVentures',

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://onedollarventures.com',
    siteName: 'OneDollarVentures',
    title: 'OneDollarVentures - Back Projects with $1',
    description: 'Support the next big thing with just $1. Get unique NFTs, early access, and join the journey on Solana.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OneDollarVentures',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'OneDollarVentures - Back Projects with $1',
    description: 'Support the next big thing with just $1. Get unique NFTs, early access, and join the journey on Solana.',
    images: ['/og-image.png'],
    creator: '@onedollarventures',
  },

  // Icons
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  // Manifest
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        <WalletContextProvider>
          <TooltipProvider>
            <Navbar />
            {children}
            <Toaster />
          </TooltipProvider>
        </WalletContextProvider>
      </body>
    </html >
  );
}
