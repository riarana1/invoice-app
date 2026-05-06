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
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Rate</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {itemList.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="text-sm">{item.name}</TableCell>
            <TableCell className="text-sm">{item.cost}</TableCell>
            <TableCell className="text-sm">{item.quantity}</TableCell>
            <TableCell className="text-sm">
              {Number(item.cost * item.quantity).toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
