import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function InvoiceTable({ itemList }: { itemList: Item[] }) {
  return (
    <Table>
      <TableHeader className="dark:bg-slate-800">
        <TableRow className="dark:border-slate-700">
          <TableHead className="dark:text-slate-300">Name</TableHead>
          <TableHead className="dark:text-slate-300">Rate</TableHead>
          <TableHead className="dark:text-slate-300">Quantity</TableHead>
          <TableHead className="dark:text-slate-300">Amount</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {itemList.map((item) => (
          <TableRow key={item.id} className="dark:border-slate-800">
            <TableCell className="text-sm dark:text-white">{item.name}</TableCell>
            <TableCell className="text-sm dark:text-white">{item.cost}</TableCell>
            <TableCell className="text-sm dark:text-white">{item.quantity}</TableCell>
            <TableCell className="text-sm dark:text-white">
              {Number(item.cost * item.quantity).toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
