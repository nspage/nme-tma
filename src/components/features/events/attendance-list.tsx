import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Event, EventAttendee } from "@/types/event"
import { MoreHorizontal, Search } from "lucide-react"

interface AttendanceListProps {
  event: Event
  isOrganizer: boolean
  onStatusChange?: (attendeeId: string, newStatus: EventAttendee["status"]) => Promise<void>
}

export function AttendanceList({
  event,
  isOrganizer,
  onStatusChange,
}: AttendanceListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [loadingAttendeeId, setLoadingAttendeeId] = useState<string | null>(null)
  const { toast } = useToast()

  const statusColors = {
    confirmed: "bg-green-100 text-green-800",
    waitlist: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
  }

  const filteredAttendees = event.attendees.filter((attendee) => {
    const searchString = searchQuery.toLowerCase()
    return (
      attendee.address.toLowerCase().includes(searchString) ||
      attendee.displayName?.toLowerCase().includes(searchString)
    )
  })

  const handleStatusChange = async (
    attendeeId: string,
    newStatus: EventAttendee["status"]
  ) => {
    if (!onStatusChange) return

    try {
      setLoadingAttendeeId(attendeeId)
      await onStatusChange(attendeeId, newStatus)
      toast({
        title: "Status Updated",
        description: "Attendee status has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update attendee status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingAttendeeId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by address or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredAttendees.length} attendee{filteredAttendees.length !== 1 && "s"}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>Display Name</TableHead>
              <TableHead>RSVP Time</TableHead>
              <TableHead>Status</TableHead>
              {isOrganizer && <TableHead className="w-[100px]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttendees.map((attendee) => (
              <TableRow key={attendee.id}>
                <TableCell className="font-mono">
                  {attendee.address.slice(0, 6)}...{attendee.address.slice(-4)}
                </TableCell>
                <TableCell>{attendee.displayName || "Anonymous"}</TableCell>
                <TableCell>
                  {new Date(attendee.rsvpTimestamp).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      statusColors[attendee.status as keyof typeof statusColors]
                    }
                  >
                    {attendee.status}
                  </Badge>
                </TableCell>
                {isOrganizer && (
                  <TableCell>
                    {loadingAttendeeId === attendee.id ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(attendee.id, "confirmed")
                            }
                          >
                            Confirm Attendance
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(attendee.id, "waitlist")
                            }
                          >
                            Move to Waitlist
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(attendee.id, "cancelled")
                            }
                            className="text-red-600"
                          >
                            Cancel RSVP
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
            {filteredAttendees.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={isOrganizer ? 5 : 4}
                  className="h-24 text-center"
                >
                  No attendees found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
