'use client'

import {
  useEffect,
  useState,
  useCallback,
  useActionState,
  startTransition,
} from 'react'
import { useSession } from 'next-auth/react'
import SideNav from '@/components/shared/SideNav'
import {
  getBankInfoByUserId,
  updateBankInfoAction,
} from '@/lib/actions/invoice.actions'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Banknote, CreditCard, Landmark, Loader2, User } from 'lucide-react'

export default function Settings() {
  const { data: session, status } = useSession()
  const userId = session?.user?.id

  const [bankInfo, setBankInfo] = useState({
    account_name: '',
    account_number: '',
    bank_name: '',
    currency: '',
  })

  const [state, formAction, isPending] = useActionState(
    updateBankInfoAction,
    null,
  )

  const fetchBankInfo = useCallback(async () => {
    if (!userId) return
    try {
      const data = await getBankInfoByUserId(userId)
      if (data) {
        setBankInfo({
          account_name: data.account_name,
          account_number: data.account_number,
          bank_name: data.bank_name,
          currency: data.currency,
        })
      }
    } catch (err) {
      console.error(err)
    }
  }, [userId])

  useEffect(() => {
    if (status === 'authenticated') {
      startTransition(() => {
        fetchBankInfo()
      })
    }
  }, [status, fetchBankInfo])

  // Handle the action response (e.g., alerts and refreshing display)
  useEffect(() => {
    if (state?.success) {
      alert(state.message)
      // Wrap in startTransition to avoid cascading render warning
      startTransition(() => {
        fetchBankInfo()
      })
    } else if (state?.success === false) {
      alert(state.message)
    }
  }, [state, fetchBankInfo])

  if (status === 'loading') {
    return <p>Loading...</p>
  }

  return (
    <div className="w-full">
      <main className="min-h-screen flex items-start bg-gray-50/50">
        <SideNav />

        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
              <p className="text-muted-foreground">
                Manage your account preferences and bank details.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Current Info Summary */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="border-none shadow-sm bg-blue-600 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Banknote className="w-5 h-5" />
                      Live Preview
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      This is how your info appears on invoices.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                      <p className="text-xs uppercase font-semibold text-blue-200 mb-1">
                        Account Holder
                      </p>
                      <p className="font-medium">
                        {bankInfo.account_name || 'Not set'}
                      </p>
                    </div>
                    <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                      <p className="text-xs uppercase font-semibold text-blue-200 mb-1">
                        Account Number
                      </p>
                      <p className="font-medium font-mono">
                        {bankInfo.account_number || '•••• ••••'}
                      </p>
                    </div>
                    <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                      <p className="text-xs uppercase font-semibold text-blue-200 mb-1">
                        Bank & Currency
                      </p>
                      <p className="font-medium">
                        {bankInfo.bank_name || 'N/A'} ({bankInfo.currency})
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Update Form */}
              <Card className="lg:col-span-2 shadow-sm">
                <CardHeader>
                  <CardTitle>Bank Details</CardTitle>
                  <CardDescription>
                    Set up the account where you want to receive payments.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form action={formAction} className="space-y-6">
                    <Input type="hidden" name="userId" value={userId || ''} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="accountName"
                          className="flex items-center gap-2"
                        >
                          <User className="w-4 h-4 text-gray-500" />
                          Account Name
                        </Label>
                        <Input
                          type="text"
                          name="accountName"
                          id="accountName"
                          placeholder="e.g. John Doe"
                          value={bankInfo.account_name}
                          onChange={(e) =>
                            setBankInfo((p) => ({
                              ...p,
                              account_name: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="accountNumber"
                          className="flex items-center gap-2"
                        >
                          <CreditCard className="w-4 h-4 text-gray-500" />
                          Account Number
                        </Label>
                        <Input
                          type="text"
                          name="accountNumber"
                          id="accountNumber"
                          placeholder="1234567890"
                          value={bankInfo.account_number}
                          onChange={(e) =>
                            setBankInfo((p) => ({
                              ...p,
                              account_number: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="bankName"
                          className="flex items-center gap-2"
                        >
                          <Landmark className="w-4 h-4 text-gray-500" />
                          Bank Name
                        </Label>
                        <Input
                          type="text"
                          name="bankName"
                          id="bankName"
                          placeholder="Global Bank"
                          value={bankInfo.bank_name}
                          onChange={(e) =>
                            setBankInfo((p) => ({
                              ...p,
                              bank_name: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select
                          name="currency"
                          value={bankInfo.currency}
                          onValueChange={(val) =>
                            setBankInfo((prev) => ({ ...prev, currency: val }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="$">USD ($)</SelectItem>
                            <SelectItem value="€">EUR (€)</SelectItem>
                            <SelectItem value="£">GBP (£)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="pt-4 border-t flex justify-end">
                      <Button
                        type="submit"
                        className="min-w-37.5"
                        disabled={isPending}
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
