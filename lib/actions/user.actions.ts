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
import { formatError } from '../utils'
import { revalidatePath } from 'next/cache'
import { and, eq } from 'drizzle-orm'
import z from 'zod'

export async function signUp(_prevState: unknown, formData: FormData) {
  try {
    const data = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    })

    await db.insert(users).values({
      name: data.name,
      email: data.email,
      password: hashSync(data.password, 10),
    })

    // Automatically sign in after successful registration
    await signIn('credentials', {
      email: data.email,
      password: data.password,
    })

    return { success: true, message: 'User created successfully' }
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
  _prevState: unknown,
  formData: FormData,
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    })
    await signIn('credentials', user)
    return { success: true, message: 'Sign in successfully' }
  } catch (error) {
    if ((error as { digest?: string }).digest?.includes('NEXT_REDIRECT')) {
      throw error
    }

    return { success: false, message: 'Invalid email or password' }
  }
}

export const SignOut = async () => {
  await signOut()
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
