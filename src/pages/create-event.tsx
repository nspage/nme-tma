import { EventRegistrationForm } from "@/components/features/events/event-registration-form"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export function CreateEventPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link to="/events">← Back to Events</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="border rounded-lg p-6 bg-card">
            <h1 className="text-2xl font-bold mb-6">Create Event</h1>
            <EventRegistrationForm />
          </div>
        </div>

        <div className="space-y-6">
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-lg font-semibold mb-4">Event Types</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">Meetup</h3>
                <p>Casual community gatherings for networking and discussions.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">Workshop</h3>
                <p>Educational sessions focused on specific topics or skills.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">Conference</h3>
                <p>Large-scale events with multiple speakers and tracks.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">Hackathon</h3>
                <p>Collaborative coding events to build and showcase projects.</p>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-lg font-semibold mb-4">Requirements</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span>Minimum TON Balance</span>
                <span className="font-medium">50 TON</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Maximum Attendees</span>
                <span className="font-medium">500</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Notice Period</span>
                <span className="font-medium">48 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateEventPage
