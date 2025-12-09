import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_WALLETS } from '@/lib/auth/admin'

/**
 * Middleware to check admin authorization for API routes
 * 
 * Expects wallet address in request body or headers
 */
export function checkAdminAuth(request: NextRequest, body?: any): { authorized: boolean; wallet: string | null; error?: NextResponse } {
  // Try to get wallet from body first, then headers
  const walletFromBody = body?.adminWallet || body?.wallet
  const walletFromHeader = request.headers.get('x-wallet-address')
  const wallet = walletFromBody || walletFromHeader

  if (!wallet) {
    return {
      authorized: false,
      wallet: null,
      error: NextResponse.json(
        { error: 'Unauthorized: No wallet address provided' },
        { status: 401 }
      )
    }
  }

  if (!ADMIN_WALLETS.includes(wallet)) {
    return {
      authorized: false,
      wallet,
      error: NextResponse.json(
        { error: 'Unauthorized: Wallet is not an admin' },
        { status: 403 }
      )
    }
  }

  return { authorized: true, wallet }
}

/**
 * Simple check if wallet is admin (for use in route handlers)
 */
export function isAdminRequest(wallet: string | null | undefined): boolean {
  if (!wallet) return false
  return ADMIN_WALLETS.includes(wallet as any)
}
