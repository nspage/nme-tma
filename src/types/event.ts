export interface EventAttendee {
  id: string
  address: string
  displayName?: string
  rsvpTimestamp: string
  status: "confirmed" | "waitlist" | "cancelled"
}

export interface Event {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  location: {
    type: "online" | "physical" | "hybrid"
    venue?: string
    address?: string
    onlineLink?: string
  }
  capacity: number
  tokenGated?: {
    required: boolean
    minTokens?: number
    tokenAddress?: string
  }
  organizer: {
    id: string
    address: string
    displayName?: string
  }
  attendees: EventAttendee[]
  status: "upcoming" | "ongoing" | "past" | "cancelled"
  tags?: string[]
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export type EventSummary = Pick<
  Event,
  | "id"
  | "title"
  | "startDate"
  | "endDate"
  | "location"
  | "capacity"
  | "status"
  | "imageUrl"
> & {
  attendeeCount: number
}
