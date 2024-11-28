import { useCallback, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { eventService } from '../api/services/events'
import { Event, CreateEventInput, PaginationParams } from '../types/api'

export function useEvents() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  const getEvents = useCallback(async (params?: PaginationParams) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await eventService.getEvents(params)
      return response.data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast({
        title: 'Error',
        description: 'Failed to fetch events',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const getEvent = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await eventService.getEvent(id)
      return response.data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast({
        title: 'Error',
        description: 'Failed to fetch event',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const createEvent = useCallback(async (input: CreateEventInput) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await eventService.createEvent(input)
      toast({
        title: 'Success',
        description: 'Event created successfully',
      })
      return response.data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast({
        title: 'Error',
        description: 'Failed to create event',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const register = useCallback(async (eventId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await eventService.register(eventId)
      toast({
        title: 'Success',
        description: 'Successfully registered for event',
      })
      return response.data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast({
        title: 'Error',
        description: 'Failed to register for event',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const unregister = useCallback(async (eventId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await eventService.unregister(eventId)
      toast({
        title: 'Success',
        description: 'Successfully unregistered from event',
      })
      return response.data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast({
        title: 'Error',
        description: 'Failed to unregister from event',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const getMyEvents = useCallback(async (params?: PaginationParams) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await eventService.getMyEvents(params)
      return response.data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast({
        title: 'Error',
        description: 'Failed to fetch your events',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  return {
    isLoading,
    error,
    getEvents,
    getEvent,
    createEvent,
    register,
    unregister,
    getMyEvents,
  }
}
