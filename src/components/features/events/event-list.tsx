import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ErrorMessage } from '@/components/ui/error-message'
import { useEvents } from '@/lib/hooks/use-events'
import { Event } from '@/types/event'
import { formatEventDate, getEventStatusText } from '@/lib/event-utils'
import { Users, MapPin, Calendar } from 'lucide-react'

export function EventList() {
  const [events, setEvents] = useState<Event[]>([])
  const { getEvents, isLoading, error } = useEvents()

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents()
        if (response?.items) {
          setEvents(response.items)
        }
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    }

    fetchEvents()
  }, [getEvents])

  if (error) {
    return <ErrorMessage error={error} />
  }

  if (isLoading) {
    return <div>Loading events...</div>
  }

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500'
      case 'ongoing':
        return 'bg-green-500'
      case 'past':
        return 'bg-gray-500'
      case 'cancelled':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="grid gap-4">
      {events.map((event) => (
        <Link key={event.id} to={`/events/${event.id}`}>
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{event.title}</CardTitle>
                <span
                  className={`${getStatusColor(
                    event.status
                  )} px-2 py-1 rounded-full text-white text-sm`}
                >
                  {getEventStatusText(event.status)}
                </span>
              </div>
              <CardDescription>{event.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatEventDate(event.startDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>
                    {event.attendees.length} / {event.capacity} attendees
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location.type}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
