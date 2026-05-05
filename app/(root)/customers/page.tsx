import CustomersTable from '@/components/shared/customer/CustomersTable'
import { getCustomers } from '@/lib/actions/customer.actions'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import SideNav from '@/components/shared/SideNav'
import CustomerForm from '@/components/shared/customer/CustomerForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Users } from 'lucide-react'

export default async function Customers() {
  const session = await auth()
  if (!session) redirect('/sign-in')

  const userId = session.user.id
  const customers = await getCustomers(userId)

  return (
    <div className="flex min-h-screen w-full bg-gray-50/50">
      <SideNav />
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
            <p className="text-muted-foreground">
              Create and manage your client directory.
            </p>
          </header>

          <div className="grid gap-8">
            <Card className="shadow-sm border-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Add New Customer
                </CardTitle>
                <CardDescription>
                  Fill in the details to register a new client in your database.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CustomerForm userId={userId} />
              </CardContent>
            </Card>

            <Card className="shadow-sm border-none">
              <CardHeader>
                <CardTitle>Customer Directory</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomersTable customers={customers} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
