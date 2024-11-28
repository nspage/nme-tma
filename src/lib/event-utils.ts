import { Event } from "@/types/event"

export type EventFilter = {
  status?: Event["status"][]
  locationType?: Event["location"]["type"][]
  tokenGated?: boolean
  search?: string
  startDate?: Date
  endDate?: Date
}

export type EventSortField = "startDate" | "endDate" | "capacity" | "attendees"
export type SortDirection = "asc" | "desc"

export function filterEvents(events: Event[], filter: EventFilter): Event[] {
  return events.filter((event) => {
    // Status filter
    if (filter.status?.length && !filter.status.includes(event.status)) {
      return false
    }

    // Location type filter
    if (
      filter.locationType?.length &&
      !filter.locationType.includes(event.location.type)
    ) {
      return false
    }

    // Token gating filter
    if (
      typeof filter.tokenGated === "boolean" &&
      event.tokenGated?.required !== filter.tokenGated
    ) {
      return false
    }

    // Date range filter
    if (filter.startDate && new Date(event.startDate) < filter.startDate) {
      return false
    }
    if (filter.endDate && new Date(event.endDate) > filter.endDate) {
      return false
    }

    // Search filter
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase()
      const searchableText = [
        event.title,
        event.description,
        event.location.venue,
        event.location.address,
        ...(event.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      if (!searchableText.includes(searchTerm)) {
        return false
      }
    }

    return true
  })
}

export function sortEvents(
  events: Event[],
  field: EventSortField,
  direction: SortDirection
): Event[] {
  return [...events].sort((a, b) => {
    let comparison = 0

    switch (field) {
      case "startDate":
        comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        break
      case "endDate":
        comparison = new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
        break
      case "capacity":
        comparison = a.capacity - b.capacity
        break
      case "attendees":
        comparison = a.attendees.length - b.attendees.length
        break
    }

    return direction === "asc" ? comparison : -comparison
  })
}

export function getEventStatusText(status: Event["status"]): string {
  switch (status) {
    case "upcoming":
      return "Upcoming"
    case "ongoing":
      return "In Progress"
    case "past":
      return "Ended"
    case "cancelled":
      return "Cancelled"
    default:
      return status
  }
}

export function formatEventDate(date: string): string {
  return new Date(date).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  })
}

export function getEventProgress(event: Event): number {
  const now = new Date().getTime()
  const start = new Date(event.startDate).getTime()
  const end = new Date(event.endDate).getTime()

  if (now < start) return 0
  if (now > end) return 100

  const total = end - start
  const current = now - start
  return Math.round((current / total) * 100)
}
