import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { compareSync } from 'bcrypt-ts-edge'
import { eq } from 'drizzle-orm'
import type { NextAuthConfig, DefaultSession } from 'next-auth'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { JWT } from 'next-auth/jwt'

import { db } from './db/index'
import { users } from './db/schema'
import { NextResponse } from 'next/server'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }
}

// Extend the JWT type to include custom properties
declare module 'next-auth/jwt' {
  interface JWT {
    name?: string | null
    sub?: string // 'sub' is typically the user ID, which is a string
  }
}

export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: 'email',
        },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (credentials == null) return null

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        })
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password,
          )
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
            }
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        if (user.name === 'NO_NAME' && user.id) {
          token.name = user.email!.split('@')[0]
          await db
            .update(users)
            .set({
              name: token.name,
            })
            .where(eq(users.id, user.id))
        }
      }

      if (session?.user?.name && trigger === 'update') {
        token.name = session.user.name
      }

      return token
    },
    session: async ({ session, token }) => {
      if (session.user) {
        if (token.name) {
          session.user.name = token.name
        }
        if (token.sub) {
          session.user.id = token.sub as string
        }
      }
      return session
    },
    authorized({ request, auth }) {
      const protectedPaths = [
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ]
      const { pathname } = request.nextUrl
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false
      if (!request.cookies.get('sessionCartId')) {
        const sessionCartId = crypto.randomUUID()
        const newRequestHeaders = new Headers(request.headers)
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        })
        response.cookies.set('sessionCartId', sessionCartId)
        return response
      } else {
        return true
      }
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
