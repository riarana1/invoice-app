'use client'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deleteCustomer } from '@/lib/actions/customer.actions'
import { useTransition } from 'react'

interface Customer {
  name: string
  email: string
  id: number
}

export default function CustomersTable({
  customers,
}: {
  customers: Customer[]
}) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this customer?')) return

    startTransition(async () => {
      await deleteCustomer(id)
    })
  }

  return (
    <Table>
      <TableHeader className="dark:bg-slate-800">
        <TableRow className="dark:border-slate-700">
          <TableHead className="dark:text-slate-300">Name</TableHead>
          <TableHead className="dark:text-slate-300">Email</TableHead>
          <TableHead className="dark:text-slate-300 text-right">Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {customers.length > 0 &&
          customers.map((customer) => (
            <TableRow key={customer.id} className="dark:border-slate-800">
              <TableCell className="text-sm font-medium dark:text-white">{customer.name}</TableCell>
              <TableCell className="text-sm dark:text-slate-400">{customer.email}</TableCell>
              <TableCell className="text-sm text-right">
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 dark:bg-red-900/50 dark:text-red-200 dark:hover:bg-red-900 transition-colors"
                  onClick={() => handleDelete(customer.id)}
                  disabled={isPending}
                >
                  {isPending ? '...' : 'Delete'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}
