import { NextRequest, NextResponse } from 'next/server'

// Admin wallet addresses - in production, move to environment variable
const ADMIN_WALLETS = [
  '4GCC5vqQ6R8MWnVW3tFE5iS6p66agk4XCaeZ8V9wFxRw', // Primary admin
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin API routes
  if (pathname.startsWith('/api/admin/')) {
    const walletAddress = request.headers.get('x-wallet-address')
    
    // Check if wallet is authorized
    if (!walletAddress || !ADMIN_WALLETS.includes(walletAddress)) {
      return NextResponse.json(
        { 
          error: 'Unauthorized: Admin access required',
          message: 'This endpoint requires admin wallet authentication'
        },
        { status: 403 }
      )
    }
  }

  // Allow request to proceed
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/admin/:path*',
  ]
}
