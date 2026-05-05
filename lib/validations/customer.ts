import { z } from 'zod'

export const CreateCustomerSchema = z.object({
  owner_id: z.string().min(1, 'Owner ID is required'),
  name: z.string().min(1, 'Customer name is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(1, 'Address is required'),
})

export type CreateCustomer = z.infer<typeof CreateCustomerSchema>
