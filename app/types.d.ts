interface Item {
  id: string
  name: string
  cost: number
  quantity: number
  price: number
}

interface Invoice {
  id?: number
  owner_id: string
  customer_id: string
  title: string
  items: string
  created_at?: string | null | undefined
  total_amount: number
}

interface Customer {
  owner_id: string
  name: string
  email: string
  address: string
  created_at?: string | null | undefined
}

interface BankInfo {
  owner_id: string
  account_name: string
  account_number: number
  bank_name: string
  currency: string
  created_at?: string
}

// Define the type for sending invoices via email
type SendInvoiceData = {
  invoiceID: string
  items: string
  title: string
  amount: number
  customerEmail: string
  issuerName: string
  accountNumber: number
  currency: string
}
