import * as z from 'zod'

// USER
export const signInFormSchema = z.object({
  email: z.string().email().min(3, 'Email must be at least 3 characters'),
  password: z.string().min(3, 'Password must be at least 3 characters'),
})

export const signUpFormSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email().min(3, 'Email must be at least 3 characters'),
    password: z.string().min(3, 'Password must be at least 3 characters'),
    confirmPassword: z
      .string()
      .min(3, 'Confirm password must be at least 3 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
export const updateProfileSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email().min(3, 'Email must be at least 3 characters'),
})

export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, 'Id is required'),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  role: z.string().min(1, 'Role is required'),
})

export const InvoiceSchema = z.object({
  title: z.string().min(2, 'Name is required'),
  created_at: z.string().transform((str) => new Date(str)),
  items: z
    .array(
      z.object({
        description: z.string().min(1, 'Required'),
        quantity: z.number().min(1),
        price: z.number().min(0.01),
      }),
    )
    .min(1, 'At least one item is required'),
  total_amount: z.number().min(0.01),
})

export type InvoiceType = z.infer<typeof InvoiceSchema>
