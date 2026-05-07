import { Metadata } from 'next'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { APP_NAME } from '@/lib/constants'

import SignUpForm from './signup-form'

export const metadata: Metadata = {
  title: `Sign Up - ${APP_NAME}`,
}

export default async function SignUp(props: {
  searchParams: Promise<{ callbackUrl: string }>
}) {
  const { callbackUrl } = await props.searchParams
  const session = await auth()
  if (session) {
    return redirect(callbackUrl || '/')
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 dark:bg-slate-950 bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-indigo-50 dark:from-blue-950/30 dark:via-slate-950 dark:to-slate-950">
      <div className="w-full max-w-md">
        <Card className="shadow-sm border-none dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold dark:text-white">
              Create Account
            </CardTitle>
            <CardDescription className="dark:text-slate-400">
              Enter your information below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={null}>
              <SignUpForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
