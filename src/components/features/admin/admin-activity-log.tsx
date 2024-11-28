import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

// Placeholder data - replace with actual data from API/blockchain
const activities = [
  {
    id: "1",
    type: "proposal_created",
    user: "0x1234...5678",
    action: "Created proposal 'Implement Community Treasury'",
    timestamp: "2024-02-10T14:30:00Z",
    severity: "info",
  },
  {
    id: "2",
    type: "user_banned",
    user: "0x9876...5432",
    action: "User banned for spam",
    timestamp: "2024-02-10T13:15:00Z",
    severity: "high",
  },
  {
    id: "3",
    type: "event_cancelled",
    user: "0x4567...8901",
    action: "Cancelled event 'Developer Workshop'",
    timestamp: "2024-02-10T12:45:00Z",
    severity: "medium",
  },
  {
    id: "4",
    type: "proposal_executed",
    user: "0x2345...6789",
    action: "Executed proposal 'Protocol Upgrade'",
    timestamp: "2024-02-10T11:30:00Z",
    severity: "info",
  },
  {
    id: "5",
    type: "funds_transferred",
    user: "0x3456...7890",
    action: "Transferred 1000 TON to treasury",
    timestamp: "2024-02-10T10:15:00Z",
    severity: "medium",
  },
]

const severityColors = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
  info: "bg-gray-100 text-gray-800",
}

const typeLabels = {
  proposal_created: "Proposal",
  user_banned: "Moderation",
  event_cancelled: "Event",
  proposal_executed: "Execution",
  funds_transferred: "Treasury",
}

export function AdminActivityLog() {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start justify-between space-x-4 rounded-lg border p-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        severityColors[activity.severity as keyof typeof severityColors]
                      }
                    >
                      {typeLabels[activity.type as keyof typeof typeLabels]}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">by {activity.user}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
