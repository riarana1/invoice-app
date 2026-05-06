'use client'

import React, { useState, useActionState, useEffect } from 'react'
import { createInvoice } from '@/lib/actions/invoice.actions'
import InvoiceTable from './InvoiceTable'
import { useRouter } from 'next/navigation'

interface Props {
  userId: string
  customers: Customer[]
}

// Define the type for the state managed by useActionState
type FormState = {
  error?: string
  success?: boolean
} | null

export default function InvoiceForm({ userId, customers }: Props) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    createInvoice,
    null,
  )

  const [itemList, setItemList] = useState<Item[]>([])
  const [itemName, setItemName] = useState('')
  const [itemCost, setItemCost] = useState(0)
  const [itemQuantity, setItemQuantity] = useState(1)

  useEffect(() => {
    if (state?.success) {
      alert('Invoice created!')
      router.push('/history')
    }
  }, [state, router])

  const handleAddItem = (e: React.MouseEvent) => {
    e.preventDefault()
    if (itemName && itemCost > 0) {
      setItemList([
        ...itemList,
        {
          id: Math.random().toString(36).substr(2, 9),
          name: itemName,
          cost: itemCost,
          quantity: itemQuantity,
          price: itemCost * itemQuantity,
        },
      ])
      setItemName('')
      setItemCost(0)
      setItemQuantity(1)
    }
  }

  const totalAmount = itemList.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="md:w-5/6 w-full h-full p-6">
      <h2 className="font-bold text-2xl mb-3">Add new invoice</h2>

      {state?.error && (
        <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {state.error}
        </p>
      )}

      <form action={formAction} className="w-full flex flex-col">
        {/* Hidden inputs to pass data not in standard form fields */}
        <input type="hidden" name="owner_id" value={userId} />
        <input type="hidden" name="items" value={JSON.stringify(itemList)} />
        <input type="hidden" name="total_amount" value={String(totalAmount)} />

        <label htmlFor="customer_id">Customer</label>
        <select
          name="customer_id"
          className="border p-2 rounded-sm mb-3"
          required
        >
          <option value="">Select a customer</option>
          {customers.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <label htmlFor="title">Title</label>
        <input
          name="title"
          className="border rounded-sm mb-3 py-2 px-3"
          required
        />

        <div className="w-full flex flex-col">
          <h3 className="my-4 font-bold">Items List</h3>
          <div className="flex space-x-3">
            <div className="flex flex-col w-1/4">
              <label className="text-sm">Name</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="py-2 px-4 mb-6 bg-gray-100"
              />
            </div>
            <div className="flex flex-col w-1/4">
              <label className="text-sm">Cost</label>
              <input
                type="number"
                value={itemCost}
                onChange={(e) => setItemCost(Number(e.target.value))}
                className="py-2 px-4 mb-6 bg-gray-100"
              />
            </div>
            <div className="flex flex-col w-1/4">
              <label className="text-sm">Quantity</label>
              <input
                type="number"
                value={itemQuantity}
                onChange={(e) => setItemQuantity(Number(e.target.value))}
                className="py-2 px-4 mb-6 bg-gray-100"
              />
            </div>
            <div className="flex flex-col w-1/4">
              <p className="text-sm">Price</p>
              <p className="py-2 px-4 mb-6 bg-gray-100">
                {(itemCost * itemQuantity).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddItem}
            className="bg-blue-500 text-white p-2 rounded mb-4"
          >
            Add Item
          </button>
        </div>

        <InvoiceTable itemList={itemList} />

        <button
          disabled={isPending}
          className="bg-blue-800 text-white w-full p-4 rounded my-6 disabled:bg-gray-400"
          type="submit"
        >
          {isPending ? 'SAVING...' : 'SAVE & PREVIEW INVOICE'}
        </button>
      </form>
    </div>
  )
}
