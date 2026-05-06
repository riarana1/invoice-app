import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { signOut } from '@/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { APP_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Sign Out - ${APP_NAME}`,
}

export default function SignOutPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 dark:bg-slate-950 bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-indigo-50 dark:from-blue-950/30 dark:via-slate-950 dark:to-slate-950">
      <div className="w-full max-w-md">
        <Card className="shadow-sm border-none dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <Link href="/">
                <Image
                  src="/assets/icons/logo.svg"
                  width={32}
                  height={32}
                  alt={`${APP_NAME} logo`}
                  className="dark:invert"
                />
              </Link>
            </div>
            <CardTitle className="text-2xl font-bold dark:text-white">
              Sign Out
            </CardTitle>
            <CardDescription className="dark:text-slate-400">
              Are you sure you want to sign out of your account?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              action={async () => {
                'use server'
                await signOut({ redirectTo: '/sign-in' })
              }}
            >
              <button
                type="submit"
                className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Confirm Sign Out
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
