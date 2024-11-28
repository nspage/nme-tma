import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Users, Link as LinkIcon } from "lucide-react"

interface EventDetailsCardProps {
  id: string
}

// Placeholder data - replace with actual data from API
const event = {
  id: "1",
  title: "Community Town Hall",
  description: "Monthly community meeting to discuss governance proposals and ecosystem updates.",
  type: "online",
  date: "2024-02-15",
  time: "15:00 UTC",
  location: "Discord",
  locationLink: "https://discord.gg/example",
  attendees: 45,
  maxAttendees: 100,
  status: "upcoming",
  organizer: "0x1234...5678",
  agenda: `
    ## Agenda

    1. Welcome and Introduction (5 mins)
    2. Ecosystem Updates (15 mins)
       - Development progress
       - Partnership announcements
       - Community growth metrics
    
    3. Governance Overview (20 mins)
       - Active proposals review
       - Voting statistics
       - Treasury updates
    
    4. Open Discussion (15 mins)
       - Community feedback
       - Questions and answers
    
    5. Next Steps and Closing (5 mins)

    ## Additional Information
    
    - The session will be recorded
    - Questions can be submitted in advance
    - Live translation available in Spanish and Chinese
  `,
}

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

export function EventDetailsCard({ id }: EventDetailsCardProps) {
  const handleRSVP = async () => {
    // Implement RSVP functionality
    console.log("RSVP for event:", id)
  }

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <CardTitle className="text-2xl">{event.title}</CardTitle>
          <div className="flex gap-2">
            <Badge className={typeColors[event.type as keyof typeof typeColors]}>
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </Badge>
            <Badge className={statusColors[event.status as keyof typeof statusColors]}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div>Organized by: {event.organizer}</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Description</h3>
          <p className="text-muted-foreground">{event.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" />
            <span>{event.attendees} / {event.maxAttendees} attendees</span>
          </div>
        </div>

        {event.locationLink && (
          <div className="flex items-center gap-2 text-sm">
            <LinkIcon className="h-4 w-4" />
            <a
              href={event.locationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Join Link
            </a>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-medium">Event Details</h3>
          <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: event.agenda }} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleRSVP}>
          RSVP
        </Button>
        {event.locationLink && (
          <Button asChild>
            <a href={event.locationLink} target="_blank" rel="noopener noreferrer">
              Join Event
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
