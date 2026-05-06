import { AuthProvider } from './providers'
import './globals.css'
import type { Metadata } from 'next'
import Navbar from '../components/shared/header/Navbar'
import { Geist } from 'next/font/google'
import { cn } from '@/lib/utils'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Invoice App Management',
  description: 'Learn authentication with Next.js and NextAuth.js',
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cn('font-sans', geist.variable)}
      suppressHydrationWarning
    >
      <body>
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto p-4">{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
