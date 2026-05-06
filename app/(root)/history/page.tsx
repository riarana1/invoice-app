import { redirect } from 'next/navigation'
import { getUserInvoices } from '@/lib/actions/invoice.actions'
import SideNav from '@/components/shared/SideNav'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, SearchX } from 'lucide-react'
import { auth } from '@/auth'

export default async function History() {
  const session = await auth()
  if (!session) redirect('/sign-in')

  const invoices = await getUserInvoices(session.user.id)

  return (
    <div className="flex min-h-screen w-full bg-gray-50/50">
      <SideNav />
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Invoice History
            </h1>
            <p className="text-muted-foreground">
              View all your past invoices and their current status.
            </p>
          </header>

          {invoices.length > 0 ? (
            <div className="grid gap-4">
              {invoices.map((invoice) => (
                <Card key={invoice.id} className="shadow-sm">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Invoice - #0{invoice.id} issued to{' '}
                        <span className="font-semibold text-gray-700">
                          {invoice.customer_name || 'N/A'}
                        </span>
                      </p>
                      <h3 className="text-xl font-bold text-gray-800">
                        {Number(invoice.total_amount).toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD', // Assuming USD, adjust as needed
                        })}
                      </h3>
                    </div>
                    <Link href={`/invoices/${invoice.id}`} passHref>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Preview
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="max-w-md mx-auto text-center py-12 shadow-sm border-dashed border-2 bg-transparent">
              <SearchX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <CardTitle className="text-xl mb-2">No Invoices Found</CardTitle>
              <CardDescription>
                It looks like you haven&apos;t created any invoices yet.
              </CardDescription>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
