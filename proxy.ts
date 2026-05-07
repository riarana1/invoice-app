import { auth as proxy } from '@/auth'
export { proxy }

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|_next/assets|favicon.ico).*)'],
}
