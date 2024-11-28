import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ErrorMessage } from '@/components/ui/error-message'
import { useEvents } from '@/lib/hooks/use-events'
import { useTonAuth } from '@/lib/hooks/use-ton-auth'
import { Event } from '@/lib/types/api'
import { formatDate, getStatusColor, truncateAddress } from '@/lib/utils'

export function EventDetail() {
  const { id } = useParams<{ id: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const { getEvent, register, unregister, isLoading, error } = useEvents()
  const { isConnected, address } = useTonAuth()

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return
      try {
        const eventData = await getEvent(id)
        setEvent(eventData)
      } catch (error) {
        console.error('Error fetching event:', error)
      }
    }

    fetchEvent()
  }, [id, getEvent])

  const handleRegister = async () => {
    if (!id || !event) return
    try {
      await register(id)
      const updatedEvent = await getEvent(id)
      setEvent(updatedEvent)
    } catch (error) {
      console.error('Error registering for event:', error)
    }
  }

  const handleUnregister = async () => {
    if (!id || !event) return
    try {
      await unregister(id)
      const updatedEvent = await getEvent(id)
      setEvent(updatedEvent)
    } catch (error) {
      console.error('Error unregistering from event:', error)
    }
  }

  if (error) {
    return <ErrorMessage error={error} />
  }

  if (isLoading || !event) {
    return <div>Loading event...</div>
  }

  const isUpcoming = event.status === 'upcoming'
  const isRegistered = event.attendees.includes(address || '')
  const isFull = event.maxAttendees && event.attendees.length >= event.maxAttendees

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{event.title}</CardTitle>
            <span
              className={`${getStatusColor(event.status)} px-2 py-1 rounded-full text-white text-sm`}
            >
              {event.status}
            </span>
          </div>
          <CardDescription>
            Organized by {truncateAddress(event.organizer)} on {formatDate(event.date)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {event.description}
            </p>
            <div className="flex justify-between text-sm">
              <span>Location: {event.location}</span>
              <span>
                Attendees: {event.attendees.length}
                {event.maxAttendees && ` / ${event.maxAttendees}`}
              </span>
            </div>
            {isConnected && isUpcoming && (
              <div>
                {isRegistered ? (
                  <Button onClick={handleUnregister} variant="outline">
                    Unregister
                  </Button>
                ) : (
                  <Button onClick={handleRegister} disabled={isFull}>
                    {isFull ? 'Event Full' : 'Register'}
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {event.attendees.map((attendee) => (
              <div
                key={attendee}
                className="text-sm p-2 rounded-md bg-muted/50"
              >
                {truncateAddress(attendee)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
