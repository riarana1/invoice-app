'use server'

import { invoices, bankInfo } from '@/db/schema'
import { db } from '@/db'
import { desc, eq } from 'drizzle-orm'
import { CreateInvoiceSchema } from '@/lib/validations/invoice'
import { fromError } from 'zod-validation-error'
import { revalidatePath } from 'next/cache'
import { formatError } from '../utils'

// Define the type for the state managed by useActionState
type FormState = {
  error?: string
  success?: boolean
} | null

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

//👇🏻 add a new row to the invoices table
export const createInvoice = async (
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> => {
  const rawData = {
    owner_id: formData.get('owner_id'),
    customer_id: formData.get('customer_id'),
    title: formData.get('title'),
    items: formData.get('items'),
    total_amount: formData.get('total_amount'),
  }

  const validated = CreateInvoiceSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      error: fromError(validated.error).toString(),
    }
  }

  try {
    await db.insert(invoices).values({
      owner_id: validated.data.owner_id,
      customer_id: validated.data.customer_id,
      title: validated.data.title,
      items: validated.data.items,
      total_amount: validated.data.total_amount,
    })
    revalidatePath('/history')
    return { success: true }
  } catch {
    return { error: 'Failed to create invoice in database' }
  }
}

//👇🏻 get all user's invoices
export const getUserInvoices = async (user_id: string) => {
  return await db
    .select()
    .from(invoices)
    .where(eq(invoices.owner_id, user_id))
    .orderBy(desc(invoices.created_at))
}

//👇🏻 get single invoice
export const getInvoiceById = async (id: string) => {
  const result = await db
    .select()
    .from(invoices)
    .where(eq(invoices.id, Number(id)))
  return result[0]
}

export const sendInvoiceAction = async (data: SendInvoiceData) => {
  try {
    // Implementation for sending email (e.g., Resend, Postmark, or Nodemailer)
    return { success: true, message: 'Invoice sent successfully!' }
  } catch {
    return { error: 'Failed to send invoice' }
  }
}

//👇🏻 get user's bank info
export const getBankInfoByUserId = async (user_id: string) => {
  const result = await db
    .select()
    .from(bankInfo)
    .where(eq(bankInfo.owner_id, user_id))
  return result[0]
}

//👇🏻 update bank info table
export async function updateBankInfoAction(
  _prevState: unknown,
  formData: FormData,
) {
  try {
    const userId = formData.get('userId') as string
    if (!userId) throw new Error('User ID is required')

    await db
      .insert(bankInfo)
      .values({
        owner_id: userId,
        bank_name: formData.get('bankName') as string,
        account_number: formData.get('accountNumber') as string,
        account_name: formData.get('accountName') as string,
        currency: formData.get('currency') as string,
      })
      .onConflictDoUpdate({
        target: bankInfo.owner_id,
        set: {
          bank_name: formData.get('bankName') as string,
          account_number: formData.get('accountNumber') as string,
          account_name: formData.get('accountName') as string,
          currency: formData.get('currency') as string,
        },
      })

    revalidatePath('/settings')
    return { success: true, message: 'Bank info updated successfully' }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

export async function getCustomerById(customerId: string) {
  const customer = await db.query.customers.findFirst({
    where: (customers, { eq }) => eq(customers.id, Number(customerId)),
  })
  if (!customer) throw new Error('Customer not found')
  return customer
}
