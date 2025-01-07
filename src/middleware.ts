import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { adminMiddleware } from './middleware/adminAuth'

export async function middleware(request: NextRequest) {
  // Sprawdź czy ścieżka zaczyna się od /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return adminMiddleware(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
} 