'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signUp } from '@/lib/actions/user.actions'
import { signUpDefaultValues } from '@/lib/constants'

const SignUpButton = () => {
  const { pending } = useFormStatus()
  return (
    <Button disabled={pending} className="w-full" variant="default">
      {pending ? 'Submitting...' : 'Sign Up'}
    </Button>
  )
}

export default function SignUpForm() {
  const [data, action] = useActionState(signUp, null)
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
          <Label htmlFor="name" className="dark:text-slate-300">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            required
            type="text"
            defaultValue={signUpDefaultValues.name}
            className="dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <Label htmlFor="email" className="dark:text-slate-300">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="john@example.com"
            required
            type="email"
            defaultValue={signUpDefaultValues.email}
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
            defaultValue={signUpDefaultValues.password}
            className="dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword" className="dark:text-slate-300">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            required
            type="password"
            defaultValue={signUpDefaultValues.confirmPassword}
            className="dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <SignUpButton />
        </div>

        {data && !data.success && (
          <div className="text-center text-destructive dark:text-red-400">{data.message}</div>
        )}
        <div className="text-center text-sm text-muted-foreground dark:text-slate-400">
          Already have an account?{' '}
          <Link
            target="_self"
            className="link text-blue-500 hover:underline dark:text-blue-400"
            href={`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          >
            Sign In
          </Link>
        </div>
      </div>
    </form>
  )
}
