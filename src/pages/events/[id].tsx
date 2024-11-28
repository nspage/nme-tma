import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Globe,
  Building,
  ArrowLeft,
  ExternalLink,
} from "lucide-react"
import { useEvents } from "@/lib/hooks/use-events"
import { useTonConnect } from "@/lib/hooks/use-ton-connect"
import { formatEventDate, formatEventTime, cn } from "@/lib/utils"
import { toast } from "sonner"

export function EventPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getEvent, register, unregister } = useEvents()
  const { connected } = useTonConnect()
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)

  useEffect(() => {
    if (!id) return
    fetchEvent()
  }, [id])

  const fetchEvent = async () => {
    try {
      setIsLoading(true)
      const data = await getEvent(id!)
      setEvent(data)
      setError(null)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRSVP = async () => {
    if (!event || !connected) return
    try {
      setIsRegistering(true)
      if (event.isRegistered) {
        await unregister(event.id)
        toast.success("Successfully unregistered from event")
      } else {
        await register(event.id)
        toast.success("Successfully registered for event")
      }
      await fetchEvent() // Refresh event data
    } catch (error) {
      toast.error(event.isRegistered ? "Failed to unregister" : "Failed to register")
      console.error(error)
    } finally {
      setIsRegistering(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <p className="text-destructive">Failed to load event details</p>
              <Button onClick={() => navigate("/events")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Events
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isFullyBooked = event.attendees.length >= event.capacity
  const canRegister = connected && !isFullyBooked

  return (
    <div className="container py-8 space-y-8">
      <Button
        variant="ghost"
        onClick={() => navigate("/events")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Button>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-2xl">{event.title}</CardTitle>
                  <CardDescription className="mt-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatEventDate(event.startDate)}</span>
                      {event.startDate !== event.endDate && (
                        <>
                          <span>-</span>
                          <span>{formatEventDate(event.endDate)}</span>
                        </>
                      )}
                    </div>
                  </CardDescription>
                </div>
                <Badge className={cn(
                  event.isRegistered && "bg-green-100 text-green-800",
                  isFullyBooked && "bg-red-100 text-red-800"
                )}>
                  {event.isRegistered ? "Registered" : isFullyBooked ? "Fully Booked" : "Open"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose dark:prose-invert">
                <p>{event.description}</p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Event Details</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {event.attendees.length} / {event.capacity} attendees
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {event.location.type === "online" ? (
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Building className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>
                      {event.location.type === "online"
                        ? "Online Event"
                        : event.location.venue}
                    </span>
                  </div>
                </div>
              </div>

              {event.location.type !== "online" && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-semibold">Location</h3>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                      <span>{event.location.address}</span>
                    </div>
                  </div>
                </>
              )}

              {event.location.type !== "physical" && event.location.onlineLink && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-semibold">Online Meeting Link</h3>
                    <Button
                      variant="outline"
                      className="w-full"
                      asChild
                    >
                      <a
                        href={event.location.onlineLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Join Meeting
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available spots</span>
                  <span className="font-medium">
                    {event.capacity - event.attendees.length} remaining
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all"
                    style={{
                      width: `${(event.attendees.length / event.capacity) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {!connected ? (
                <Button className="w-full" disabled>
                  Connect Wallet to Register
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={handleRSVP}
                  disabled={!canRegister && !event.isRegistered}
                  variant={event.isRegistered ? "destructive" : "default"}
                >
                  {isRegistering ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : event.isRegistered ? (
                    "Cancel Registration"
                  ) : isFullyBooked ? (
                    "Event Full"
                  ) : (
                    "Register for Event"
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {event.attendees.length > 0 ? (
                  event.attendees.map((attendee) => (
                    <div
                      key={attendee.address}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">
                        {attendee.displayName || `${attendee.address.slice(0, 6)}...${attendee.address.slice(-4)}`}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {attendee.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center">
                    No attendees yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
