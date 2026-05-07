import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import {
  getInvoiceById,
  getCustomerById,
  getBankInfoByUserId,
} from '@/lib/actions/invoice.actions'

import { ComponentProps } from 'react'
import InvoiceDetailClient from './invoice-detail'

export default async function InvoicesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) redirect('/sign-in')

  const { id } = await params
  const invoice = await getInvoiceById(id)

  if (!invoice) redirect('/history')

  const customer = await getCustomerById(invoice.customer_id)
  const bankInfo = await getBankInfoByUserId(session.user?.id ?? '')

  return (
    <InvoiceDetailClient
      id={id}
      invoice={invoice as ComponentProps<typeof InvoiceDetailClient>['invoice']}
      customer={
        customer as ComponentProps<typeof InvoiceDetailClient>['customer']
      }
      bankInfo={
        bankInfo as ComponentProps<typeof InvoiceDetailClient>['bankInfo']
      }
    />
  )
}
