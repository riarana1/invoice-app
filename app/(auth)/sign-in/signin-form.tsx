'use client'
import { useSearchParams } from 'next/navigation'
import { useActionState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signInWithCredentials } from '@/lib/actions/user.actions'
import { signInDefaultValues } from '@/lib/constants'
import Link from 'next/link'

export default function CredentialsSignInForm() {
  const [data, action, isPending] = useActionState(signInWithCredentials, null)

  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  useEffect(() => {
    if (data?.success) {
      window.location.href = callbackUrl
    }
  }, [data, callbackUrl])

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="email" className="dark:text-slate-300">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="m@example.com"
            required
            type="email"
            defaultValue={signInDefaultValues.email}
            className="dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <Label htmlFor="password" className="dark:text-slate-300">Password</Label>
          <Input
            id="password"
            name="password"
            required
            type="password"
            defaultValue={signInDefaultValues.password}
            className="dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <Button disabled={isPending} className="w-full" variant="default">
            {isPending ? 'Submitting...' : 'Sign In'}
          </Button>
        </div>

        {data && !data.success && (
          <div className="text-center text-destructive dark:text-red-400">{data.message}</div>
        )}
        {data &&
          !data.success &&
          !data.message && (
            <div className="text-center text-destructive dark:text-red-400">
              An unknown error occurred during sign-in. Please try again.
            </div>
          )}

        <div className="text-center text-sm text-muted-foreground dark:text-slate-400">
          Don&apos;t have an account?{' '}
          <Link
            target="_self"
            className="link text-blue-500 hover:underline dark:text-blue-400"
            href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  )
}
