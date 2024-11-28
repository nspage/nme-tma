import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Users } from "lucide-react"

// Placeholder data - replace with actual data from API
const events = [
  {
    id: "1",
    title: "Community Town Hall",
    description: "Monthly community meeting to discuss governance proposals and ecosystem updates.",
    type: "online",
    date: "2024-02-15",
    time: "15:00 UTC",
    location: "Discord",
    attendees: 45,
    maxAttendees: 100,
    status: "upcoming",
  },
  {
    id: "2",
    title: "Developer Workshop",
    description: "Learn how to build on TON with hands-on tutorials and expert guidance.",
    type: "hybrid",
    date: "2024-02-20",
    time: "14:00 UTC",
    location: "San Francisco + Online",
    attendees: 75,
    maxAttendees: 150,
    status: "open",
  },
]

const statusColors = {
  upcoming: "bg-blue-100 text-blue-800",
  open: "bg-green-100 text-green-800",
  full: "bg-yellow-100 text-yellow-800",
  ended: "bg-gray-100 text-gray-800",
}

const typeColors = {
  online: "bg-purple-100 text-purple-800",
  inPerson: "bg-orange-100 text-orange-800",
  hybrid: "bg-indigo-100 text-indigo-800",
}

export function EventSummaryList() {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-xl">{event.title}</CardTitle>
              <div className="flex gap-2">
                <Badge className={typeColors[event.type as keyof typeof typeColors]}>
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </Badge>
                <Badge className={statusColors[event.status as keyof typeof statusColors]}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{event.description}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{event.attendees} / {event.maxAttendees} attendees</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" asChild>
              <Link to={`/events/${event.id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
