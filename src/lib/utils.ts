import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isToday, isYesterday, isTomorrow } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d)
}

export function formatEventDate(date: string | Date): string {
  const eventDate = typeof date === 'string' ? new Date(date) : date
  
  if (isToday(eventDate)) {
    return 'Today'
  }
  if (isTomorrow(eventDate)) {
    return 'Tomorrow'
  }
  if (isYesterday(eventDate)) {
    return 'Yesterday'
  }
  
  return format(eventDate, 'MMM d, yyyy')
}

export function formatEventTime(date: string | Date): string {
  const eventDate = typeof date === 'string' ? new Date(date) : date
  return format(eventDate, 'h:mm a')
}

export function formatDateTime(date: string | Date): string {
  const eventDate = typeof date === 'string' ? new Date(date) : date
  return `${formatEventDate(eventDate)} at ${formatEventTime(eventDate)}`
}

export function getRelativeTimeString(
  date: Date | number,
  lang = navigator.language
): string {
  const timeMs = typeof date === "number" ? date : date.getTime()
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000)
  const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity]
  const units: Intl.RelativeTimeFormatUnit[] = [
    "second",
    "minute",
    "hour",
    "day",
    "week",
    "month",
    "year",
  ]
  const unitIndex = cutoffs.findIndex(cutoff => cutoff > Math.abs(deltaSeconds))
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1

  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" })
  return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex])
}

export function truncateAddress(address: string, start = 4, end = 4): string {
  if (!address) return ''
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num)
}

export function getTimeLeft(deadline: string): string {
  const now = new Date().getTime()
  const end = new Date(deadline).getTime()
  const timeLeft = end - now

  if (timeLeft <= 0) return 'Expired'

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export function getVotePercentage(votesFor: number, votesAgainst: number): number {
  const total = votesFor + votesAgainst
  if (total === 0) return 0
  return Math.round((votesFor / total) * 100)
}

export function getStatusColor(status: string): string {
  const colors = {
    active: 'bg-green-500',
    passed: 'bg-blue-500',
    rejected: 'bg-red-500',
    expired: 'bg-gray-500',
    upcoming: 'bg-yellow-500',
    ongoing: 'bg-green-500',
    completed: 'bg-blue-500',
    cancelled: 'bg-red-500',
  }
  return colors[status as keyof typeof colors] || 'bg-gray-500'
}
