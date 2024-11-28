import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, ArrowUpDown } from "lucide-react"
import { useEvents } from "@/lib/hooks/use-events"
import { formatEventDate, formatEventTime, cn } from "@/lib/utils"
import { Event } from "@/types/event"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventCalendar } from "@/components/features/events/event-calendar"

type SortField = "startDate" | "capacity" | "title"
type SortDirection = "asc" | "desc"

export function EventsPage() {
  const { getEvents } = useEvents()
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [sortField, setSortField] = useState<SortField>("startDate")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [view, setView] = useState<"list" | "calendar">("list")

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      const response = await getEvents()
      setEvents(response.items)
      setError(null)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const sortEvents = (events: Event[], field: SortField, direction: SortDirection) => {
    return [...events].sort((a, b) => {
      let comparison = 0
      switch (field) {
        case "startDate":
          comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          break
        case "capacity":
          comparison = a.capacity - b.capacity
          break
        case "title":
          comparison = a.title.localeCompare(b.title)
          break
      }
      return direction === "asc" ? comparison : -comparison
    })
  }

  const sortedEvents = sortEvents(events, sortField, sortDirection)

  const toggleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-destructive">
              <p>Failed to load events. Please try again later.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Community Events</h1>
          <p className="text-muted-foreground">Join and organize events with the community</p>
        </div>
        <div className="flex items-center gap-4">
          <Tabs value={view} onValueChange={(v) => setView(v as "list" | "calendar")}>
            <TabsList>
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>
          </Tabs>
          <Link to="/events/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as "list" | "calendar")}>
        <TabsContent value="list" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Upcoming Events</CardTitle>
                <div className="flex items-center gap-4">
                  <Select
                    value={sortField}
                    onValueChange={(value: SortField) => toggleSort(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="startDate">Date</SelectItem>
                      <SelectItem value="capacity">Capacity</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                  >
                    <ArrowUpDown className={cn(
                      "h-4 w-4",
                      sortDirection === "desc" && "transform rotate-180"
                    )} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {sortedEvents.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  <p>No events found</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {sortedEvents.map((event) => (
                    <Link key={event.id} to={`/events/${event.id}`}>
                      <Card className="hover:bg-muted/50 transition-colors">
                        <CardHeader className="space-y-1">
                          <div className="flex justify-between items-start">
                            <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                            <Badge>{event.location.type}</Badge>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-1 h-4 w-4" />
                            {formatEventDate(event.startDate)}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {event.description}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <MapPin className="mr-1 h-4 w-4" />
                              {event.location.type === "online"
                                ? "Online"
                                : event.location.venue || "TBA"}
                            </div>
                            <div className="flex items-center">
                              <Users className="mr-1 h-4 w-4" />
                              {event.attendees?.length || 0}/{event.capacity}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="mt-0">
          <EventCalendar events={events} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
