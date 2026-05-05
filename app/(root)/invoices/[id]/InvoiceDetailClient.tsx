'use client'

import { useRef, useState, forwardRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import InvoiceTable from '@/components/shared/invoice/InvoiceTable'
import { sendInvoiceAction } from '@/lib/actions/invoice.actions'
import { Button } from '@/components/ui/button' // Assuming Button is from Shadcn UI
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card' // Assuming Card components are from Shadcn UI
import { Download, Send, Loader2 } from 'lucide-react' // Assuming you have lucide-react installed for icons

interface Props {
  id: string
  customer: {
    name: string
    email: string
    address: string
  }
  bankInfo: {
    account_name: string
    account_number: string
    currency: string
  }
  invoice: {
    title: string
    customer_id: string | number
    total_amount: number | string
    items: string
    created_at: string | Date | null
  }
}

const formatDateString = (dateValue: string | Date): string => {
  const date = new Date(dateValue)
  const day = date.getDate()
  const month = date.toLocaleString('en-US', { month: 'long' })
  const year = date.getFullYear()
  return `${day} ${month}, ${year}`
}

const ComponentToPrint = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { id, customer, invoice, bankInfo } = props // Destructure props
  return (
    <div className="w-full p-4 md:p-8" ref={ref}>
      <Card className="mx-auto max-w-3xl p-6 shadow-lg">
        <CardHeader className="border-b pb-4 mb-6">
          <CardTitle className="text-3xl font-extrabold text-gray-800">
            INVOICE #0{id.toString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 mb-8">
            {/* Issuer Info */}
            <section>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                FROM:
              </h3>
              <p className="text-sm text-gray-600">
                Issuer Name: {bankInfo?.account_name || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                Date:{' '}
                {invoice?.created_at
                  ? formatDateString(invoice.created_at)
                  : 'N/A'}
              </p>
            </section>

            {/* Customer Info */}
            <section className="md:text-right">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">TO:</h3>
              <p className="text-sm text-gray-600">
                Name: {customer?.name || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                Address: {customer?.address || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                Email: {customer?.email || 'N/A'}
              </p>
            </section>
          </div>

          {/* Invoice Summary */}
          <div className="mb-8 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600 mb-1">Subject:</p>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {invoice?.title || 'N/A'}
            </h2>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="font-extrabold text-3xl text-blue-700">
                {`${bankInfo?.currency || ''}${Number(invoice?.total_amount).toLocaleString('en-US')}`}
              </p>
            </div>
          </div>

          {/* Invoice Items Table */}
          <InvoiceTable
            itemList={invoice?.items ? JSON.parse(invoice.items) : []}
          />
        </CardContent>
      </Card>
    </div>
  )
})
ComponentToPrint.displayName = 'ComponentToPrint'

export default function InvoiceDetailClient(props: Props) {
  const [disabled, setDisabled] = useState(false)
  const componentRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Invoice_${props.id}`, // Dynamic document title
    onAfterPrint: () => console.log('Print finished!'),
  })

  const handleSendInvoice = async () => {
    setDisabled(true)
    const response = await sendInvoiceAction({
      invoiceID: props.id,
      items: props.invoice?.items,
      title: props.invoice?.title,
      amount: Number(props.invoice?.total_amount),
      customerEmail: props.customer?.email,
      issuerName: props.bankInfo?.account_name,
      accountNumber: Number(props.bankInfo?.account_number),
      currency: props.bankInfo?.currency,
    })
    setDisabled(false)
    if (response.success) alert(response.message)
    if (response.error) alert(response.error)
  }

  return (
    <main className="min-h-screen w-full">
      <section className="flex justify-center p-4 space-x-4 mb-6">
        <Button
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-500 text-blue-50 hover:bg-blue-600 h-10 px-4 py-2"
          onClick={handlePrint}
        >
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        <Button
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-500 text-green-50 hover:bg-green-600 h-10 px-4 py-2"
          onClick={handleSendInvoice}
          disabled={disabled}
        >
          {disabled ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" /> Send Invoice
            </>
          )}
        </Button>
      </section>
      <ComponentToPrint ref={componentRef} {...props} />
    </main>
  )
}
