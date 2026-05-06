'use server'

import { db } from '@/db'
import { customers } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'
import { CreateCustomerSchema } from '@/lib/validations/customer'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Define the type for the state managed by useActionState
type FormState = {
  errors?: {
    owner_id?: string[]
    name?: string[]
    email?: string[]
    address?: string[]
  }
  message?: string
  success?: boolean
} | null

//👇🏻 get customers list
export const getCustomers = async (user_id: string) => {
  return await db
    .select()
    .from(customers)
    .where(eq(customers.owner_id, user_id))
    .orderBy(desc(customers.created_at))
}

//👇🏻 get single customer
export const getSingleCustomer = async (name: string) => {
  return await db.select().from(customers).where(eq(customers.name, name))
}

//👇🏻 add a new row to the customers table
export const addCustomer = async (
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> => {
  const rawData = {
    owner_id: formData.get('owner_id'),
    name: formData.get('name'),
    email: formData.get('email'),
    address: formData.get('address'),
  }

  const validated = CreateCustomerSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      errors: z.flattenError(validated.error).fieldErrors,
      message: 'Invalid input fields. Failed to add customer.',
    }
  }

  try {
    await db.insert(customers).values({
      owner_id: validated.data.owner_id,
      name: validated.data.name,
      email: validated.data.email,
      address: validated.data.address,
    })

    revalidatePath('/customers') // Update this to your customers list path
    return { success: true, message: 'Customer added successfully' }
  } catch {
    return { message: 'Database Error: Failed to add customer' }
  }
}

//👇🏻 delete a customer
export const deleteCustomer = async (id: number) => {
  await db.delete(customers).where(eq(customers.id, id))
  revalidatePath('/customers')
}
