import { useParams } from "react-router-dom"
import { EventDetailsCard } from "@/components/features/events/event-details-card"
import { RSVPButton } from "@/components/features/events/rsvp-button"
import { QRCodeDisplay } from "@/components/features/events/qr-code-display"
import { AttendanceList } from "@/components/features/events/attendance-list"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export function EventPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link to="/events">← Back to Events</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <EventDetailsCard id={id!} />
          <RSVPButton eventId={id!} />
          
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">Event Location</h2>
            <div className="aspect-video bg-muted rounded-lg mb-4">
              {/* Map Component will go here */}
            </div>
            <p className="text-sm text-muted-foreground">
              Full address and directions will be shared with confirmed attendees.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="sticky top-6">
            <div className="border rounded-lg p-6 bg-card space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Event Pass</h3>
                <QRCodeDisplay eventId={id!} />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Attendees</h3>
                <AttendanceList eventId={id!} />
              </div>

              <div className="text-sm text-muted-foreground">
                <p>
                  Please keep your QR code handy for check-in. Make sure to follow
                  the event guidelines and code of conduct.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventPage
