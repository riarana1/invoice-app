import { z } from 'zod'

export const InvoiceItemSchema = z.object({
  id: z.string().min(1, 'Item ID is required'),
  name: z.string().min(1, 'Item name is required'),
  cost: z.number().positive('Cost must be greater than 0'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  price: z.number(),
})

export type InvoiceItem = z.infer<typeof InvoiceItemSchema>

export const CreateInvoiceSchema = z.object({
  owner_id: z.string().min(1, 'Owner ID is required'),
  customer_id: z.string().min(1, 'Please select a customer'),
  title: z.string().min(1, 'Invoice title is required'),
  items: z.string().min(1, 'At least one item is required'),
  total_amount: z.string(),
})

export type CreateInvoice = z.infer<typeof CreateInvoiceSchema>
