'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import DarkLightToggle from '@/components/shared/DarkLightToggle'

export default function Navbar() {
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'
  return (
    <nav className="bg-gray-800 dark:bg-slate-950 p-4 text-white border-b border-transparent dark:border-slate-800/50 transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-white hover:text-gray-300 transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-white hover:text-gray-300 transition-colors">
            About
          </Link>
          {session && (
            <Link href="/dashboard" className="text-white hover:text-gray-300 transition-colors">
              Dashboard
            </Link>
          )}
          <DarkLightToggle />
        </div>
        <div>
          {isLoading ? (
            <span>Loading...</span>
          ) : session ? (
            <div className="flex items-center space-x-4">
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span>Hi, {session.user?.name?.split(' ')[0] || 'User'}!</span>
              <button
                onClick={() => signOut()}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm text-white"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
