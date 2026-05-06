'use server'

import { hashSync } from 'bcrypt-ts-edge'
import { signIn, signOut } from '@/auth'
import { db } from '@/db'
import { users } from '@/db/schema'
import {
  signInFormSchema,
  signUpFormSchema,
  updateUserSchema,
} from '../validator'
import { z } from 'zod'
import { formatError } from '../utils'
import { revalidatePath } from 'next/cache'
import { and, eq } from 'drizzle-orm'

// Define the type for the state managed by useActionState
type AuthFormState = {
  errors?: Record<string, string[] | undefined>
  message?: string
  success?: boolean
} | null

export async function signUp(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const validated = signUpFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!validated.success) {
    return {
      errors: z.flattenError(validated.error).fieldErrors,
      message: 'Missing Fields. Failed to Register.',
    }
  }

  const data = validated.data

  try {
    await db.insert(users).values({
      name: data.name,
      email: data.email,
      password: hashSync(data.password, 10),
    })

    // Automatically sign in after successful registration
    revalidatePath('/', 'layout')
    await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    return { success: true, message: 'Signed up successfully' }
  } catch (error) {
    // Let redirects from signIn bubble up to Next.js
    if ((error as { digest?: string }).digest?.includes('NEXT_REDIRECT')) {
      throw error
    }

    return {
      success: false,
      message: formatError(error).includes(
        'duplicate key value violates unique constraint "user_email_idx"',
      )
        ? 'Email already exists'
        : formatError(error),
    }
  }
}

export async function signInWithCredentials(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const validated = signInFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validated.success) {
    return {
      errors: z.flattenError(validated.error).fieldErrors,
      message: 'Invalid email or password format.',
    }
  }

  const user = validated.data

  try {
    revalidatePath('/', 'layout')
    await signIn('credentials', {
      ...user,
      redirect: false,
    })

    return { success: true, message: 'Signed in successfully' }
  } catch (error) {
    if ((error as { digest?: string }).digest?.includes('NEXT_REDIRECT')) {
      throw error
    }
    return { success: false, message: 'Invalid email or password' }
  }
}

export async function handleSignOut() {
  revalidatePath('/', 'layout')
  await signOut({ redirectTo: '/sign-in' })
}

export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  try {
    await db
      .update(users)
      .set({
        name: user.name,
      })
      .where(and(eq(users.id, user.id)))

    revalidatePath('/admin/users')
    return {
      success: true,
      message: 'User updated successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

export async function getUserById(userId: string) {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  })
  if (!user) throw new Error('User not found')
  return user
}
