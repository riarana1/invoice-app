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
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {customers.length > 0 &&
          customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="text-sm">{customer.name}</TableCell>
              <TableCell className="text-sm">{customer.email}</TableCell>
              <TableCell className="text-sm">
                <Button
                  className="p-2 bg-red-500 text-red-50 text-xs rounded-sm disabled:bg-gray-400"
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
