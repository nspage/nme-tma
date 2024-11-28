import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { EventList } from "@/components/features/events/event-list"

export function EventsPage() {
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">
            Join and organize community events
          </p>
        </div>
        <Link to="/events/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      <EventList />
    </div>
  )
}
