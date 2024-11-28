import { useState } from "react"
import { Link } from "react-router-dom"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Event } from "@/types/event"
import { formatEventDate, formatEventTime } from "@/lib/utils"

interface EventCalendarProps {
  events: Event[]
}

export function EventCalendar({ events }: EventCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Create a map of dates to events
  const eventsByDate = events.reduce((acc, event) => {
    const date = new Date(event.startDate).toDateString()
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(event)
    return acc
  }, {} as Record<string, Event[]>)

  // Get events for the selected date
  const selectedEvents = selectedDate
    ? eventsByDate[selectedDate.toDateString()] || []
    : []

  // Get dates that have events
  const eventDates = Object.keys(eventsByDate).map(date => new Date(date))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Calendar</CardTitle>
        <CardDescription>View and manage upcoming events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            components={{
              DayContent: ({ date }) => {
                const hasEvents = eventsByDate[date.toDateString()]?.length > 0
                return (
                  <div
                    className={`w-full h-full flex items-center justify-center relative ${
                      hasEvents ? "font-bold" : ""
                    }`}
                  >
                    {date.getDate()}
                    {hasEvents && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                        <div className="h-1 w-1 rounded-full bg-primary" />
                      </div>
                    )}
                  </div>
                )
              },
            }}
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate ? formatEventDate(selectedDate) : "No date selected"}
              </CardTitle>
              <CardDescription>
                {selectedEvents.length} event{selectedEvents.length !== 1 && "s"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {selectedEvents.length > 0 ? (
                    selectedEvents.map((event) => (
                      <Link key={event.id} to={`/events/${event.id}`}>
                        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <CardHeader className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <CardTitle className="text-sm">
                                  {event.title}
                                </CardTitle>
                                <CardDescription className="text-xs">
                                  {formatEventTime(event.startDate)}
                                </CardDescription>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {event.location.type}
                              </Badge>
                            </div>
                          </CardHeader>
                        </Card>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      No events on this date
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
