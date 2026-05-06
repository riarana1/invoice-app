'use client'

import { useActionState, useEffect, useRef } from 'react'
import { addCustomer } from '@/lib/actions/customer.actions'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

export default function CustomerForm({ userId }: { userId: string }) {
  const [state, formAction, isPending] = useActionState(addCustomer, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
      if (state.message) alert(state.message)
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="w-full">
      {/* Hidden input to pass the owner_id */}
      <input type="hidden" name="owner_id" value={userId} />

      {state?.message && !state.success && (
        <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/20 dark:border-red-900 dark:text-red-400 px-4 py-2 rounded mb-4 text-sm">
          {state.message}
        </div>
      )}

      <div className="w-full flex items-center space-x-4 mb-3">
        <section className="w-1/2">
          <Label className="text-sm font-medium dark:text-slate-300 mb-1.5 block">Customer Name</Label>
          <Input
            type="text"
            name="name"
            placeholder="e.g. Acme Corp"
            required
          />
          {state?.errors?.name && (
            <p className="text-destructive text-xs mt-1">
              {state.errors.name[0]}
            </p>
          )}
        </section>

        <section className="w-1/2">
          <Label className="text-sm font-medium dark:text-slate-300 mb-1.5 block">Email Address</Label>
          <Input
            type="email"
            name="email"
            placeholder="customer@example.com"
            required
          />
          {state?.errors?.email && (
            <p className="text-destructive text-xs mt-1">
              {state.errors.email[0]}
            </p>
          )}
        </section>
      </div>

      <Label htmlFor="address" className="text-sm font-medium dark:text-slate-300 mb-1.5 block">
        Billing Address
      </Label>
      <Textarea
        name="address"
        id="address"
        rows={3}
        className="mb-4"
        required
      />
      {state?.errors?.address && (
        <p className="text-destructive text-xs mt-1">
          {state.errors.address[0]}
        </p>
      )}

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4 transition-colors"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          'Add Customer'
        )}
      </Button>
    </form>
  )
}
