import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  numeric,
  uuid,
} from 'drizzle-orm/pg-core'
import type { AdapterAccount } from 'next-auth/adapters'

export const users = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email').unique().notNull(),
  password: text('password'),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
})

export const accounts = pgTable(
  'account',
  {
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (table) => [
    primaryKey({ columns: [table.provider, table.providerAccountId] }),
  ],
)

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').notNull().primaryKey(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })],
)

//👇🏻 invoice table with its column types
export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey().notNull(),
  owner_id: text('owner_id').notNull(),
  customer_id: text('customer_id').notNull(),
  title: text('title').notNull(),
  items: text('items').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  total_amount: numeric('total_amount').notNull(),
})

//👇🏻 customers table with its column types
export const customers = pgTable('customers', {
  id: serial('id').primaryKey().notNull(),
  created_at: timestamp('created_at').defaultNow(),
  owner_id: text('owner_id').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  address: text('address').notNull(),
})

//👇🏻 bank_info table with its column types
export const bankInfo = pgTable('bank_info', {
  id: serial('id').primaryKey().notNull(),
  owner_id: text('owner_id').notNull().unique(),
  bank_name: text('bank_name').notNull(),
  account_number: numeric('account_number').notNull(),
  account_name: text('account_name').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  currency: text('currency').notNull(),
})

export type Customer = typeof customers.$inferSelect
export type BankInfo = typeof bankInfo.$inferSelect
export type Invoice = typeof invoices.$inferSelect
