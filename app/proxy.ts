import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtectedPath = path.startsWith('/dashboard')
  // Get the token using the correct configuration
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })
  // If trying to access a protected route without authentication
  if (isProtectedPath && !token) {
    // Store the original URL to redirect back after login
    const callbackUrl = encodeURIComponent(request.nextUrl.pathname)
    return NextResponse.redirect(
      new URL(`/?callbackUrl=${callbackUrl}`, request.url),
    )
  }
  return NextResponse.next()
}
// Config to apply middleware to all dashboard routes
export const config = {
  matcher: ['/dashboard/:path*'],
}
