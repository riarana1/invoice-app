import SideNav from '@/components/shared/SideNav'
import { getBankInfoByUserId } from '@/lib/actions/invoice.actions'
import { getCustomers } from '@/lib/actions/customer.actions'
import { auth } from '@/auth' // Assuming your auth config is here
import { redirect } from 'next/navigation'
import InvoiceForm from '@/components/shared/invoice/InvoiceForm'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Landmark, PlusCircle } from 'lucide-react'

export default async function Dashboard() {
  const session = await auth()
  if (!session) redirect('/sign-in')

  const userId = session.user.id
  const [bankInfo, customers] = await Promise.all([
    getBankInfoByUserId(userId),
    getCustomers(userId),
  ])

  const bankInfoExists = !!bankInfo

  return (
    <div className="flex min-h-screen w-full bg-gray-50/50 dark:bg-slate-950 transition-colors duration-300">
      <SideNav />
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Create Invoice
            </h1>
            <p className="text-muted-foreground">
              Fill out the details below to generate a new invoice for your
              client.
            </p>
          </header>

          {!bankInfoExists ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Card className="max-w-md w-full border-dashed border-2 flex flex-col items-center p-8 text-center shadow-none bg-transparent dark:border-slate-800">
                <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full mb-6">
                  <Landmark className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle className="text-2xl mb-2">Setup Required</CardTitle>
                <CardDescription className="text-base mb-8 dark:text-slate-400">
                  Welcome! To start generating invoices, you first need to
                  configure your bank account details in the settings.
                </CardDescription>
                <Link href="/settings" className="w-full">
                  <Button variant="destructive" className="w-full py-6 text-lg">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Add Bank Information
                  </Button>
                </Link>
              </Card>
            </div>
          ) : (
            <Card className="shadow-sm border-none dark:bg-slate-900 dark:border-slate-800">
              <CardContent className="pt-6">
                <InvoiceForm userId={userId} customers={customers} />
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
