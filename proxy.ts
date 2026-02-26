/**
 * Proxy (Next.js 16+ replacement for middleware)
 * Protects /admin routes — Edge-compatible using jose for JWT verification
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const COOKIE_NAME = 'baraem_admin_token'

async function verifyToken(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? 'baraem_majan_super_secret_key_2024_!@#$%')
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect all /admin/* routes except the login page itself
  if (pathname.startsWith('/admin') && pathname !== '/admin') {
    const token = request.cookies.get(COOKIE_NAME)?.value
    const valid = token ? await verifyToken(token) : false

    if (!valid) {
      const loginUrl = new URL('/admin', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect already-authenticated admin away from login page
  if (pathname === '/admin') {
    const token = request.cookies.get(COOKIE_NAME)?.value
    const valid = token ? await verifyToken(token) : false

    if (valid) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/admin'],
}
