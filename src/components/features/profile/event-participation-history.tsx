import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/lib/hooks/use-wallet"
import { useQuery } from "@/lib/hooks/use-query"
import { memberService } from "@/lib/api"
import { Event } from "@/lib/types/api"
import { Link } from "react-router-dom"
import { formatDate } from "@/lib/utils"

export function EventParticipationHistory() {
  const { address } = useWallet()
  const { data: events } = useQuery(() => memberService.getEventHistory(address!))

  if (!events?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Event History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No events attended yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event: Event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="block p-4 border rounded-lg hover:bg-accent"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{event.title}</h3>
                <span className="text-sm text-muted-foreground">
                  {formatDate(event.date)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {event.description.length > 100
                  ? `${event.description.slice(0, 100)}...`
                  : event.description}
              </p>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
