import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowUpRight, ArrowDownRight, ExternalLink } from "lucide-react"

// Placeholder data - replace with actual data from blockchain
const treasuryData = {
  balance: "1,234,567 TON",
  usdValue: "$2,469,134",
  transactions: [
    {
      id: "1",
      type: "deposit",
      amount: "50,000 TON",
      from: "0x1234...5678",
      timestamp: "2024-02-10T14:30:00Z",
      status: "completed",
      txHash: "0xabcd...efgh",
    },
    {
      id: "2",
      type: "withdrawal",
      amount: "10,000 TON",
      to: "0x9876...5432",
      timestamp: "2024-02-09T13:15:00Z",
      status: "completed",
      txHash: "0xijkl...mnop",
    },
    {
      id: "3",
      type: "deposit",
      amount: "25,000 TON",
      from: "0x4567...8901",
      timestamp: "2024-02-08T12:45:00Z",
      status: "pending",
      txHash: "0xqrst...uvwx",
    },
  ],
  stats: {
    totalDeposits: "1,500,000 TON",
    totalWithdrawals: "265,433 TON",
    activeProposals: 3,
  },
}

const statusColors = {
  completed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
}

export function AdminTreasuryOverview() {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Treasury Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{treasuryData.balance}</div>
            <p className="text-xs text-muted-foreground">
              ≈ {treasuryData.usdValue}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Deposits
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {treasuryData.stats.totalDeposits}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Withdrawals
            </CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {treasuryData.stats.totalWithdrawals}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Proposals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {treasuryData.stats.activeProposals}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>From/To</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transaction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {treasuryData.transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {tx.type === "deposit" ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      <span className="capitalize">{tx.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{tx.amount}</TableCell>
                  <TableCell>{tx.from || tx.to}</TableCell>
                  <TableCell>{formatTimestamp(tx.timestamp)}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        statusColors[tx.status as keyof typeof statusColors]
                      }
                    >
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <a
                      href={`https://tonscan.org/tx/${tx.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      {tx.txHash.slice(0, 6)}...{tx.txHash.slice(-4)}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
