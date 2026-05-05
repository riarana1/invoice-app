'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')
  useEffect(() => {
    // If user is authenticated and there's a callback URL,
    // redirect to the callback URL
    if (status === 'authenticated' && callbackUrl) {
      router.push(callbackUrl)
    }
  }, [status, callbackUrl, router])
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-4xl font-bold mb-8">
        Welcome to Invoice Management App
      </h1>
      {status === 'loading' ? (
        <p className="text-lg">Loading...</p>
      ) : session ? (
        <div className="text-center">
          <p className="text-xl mb-4">
            You are signed in as {session.user?.name}
          </p>
          <p className="text-lg">
            Visit your{' '}
            <a href="/dashboard" className="text-blue-500 underline">
              Dashboard
            </a>
          </p>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xl mb-6">
            Please sign in using the button in the top right corner
          </p>
          <p className="bg-yellow-100 p-4 rounded-lg border border-yellow-400 text-2xl text-black">
            This app demonstrates how to build a login system with Next.js and
            NextAuth.js
          </p>
        </div>
      )}
    </div>
  )
}
