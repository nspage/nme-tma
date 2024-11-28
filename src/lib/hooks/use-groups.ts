import { useCallback, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { groupService } from '../api/services/groups'
import { Group, CreateGroupInput, PaginationParams } from '../types/api'

export function useGroups() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  const getGroups = useCallback(async (params?: PaginationParams) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await groupService.getGroups(params)
      return response.data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast({
        title: 'Error',
        description: 'Failed to fetch groups',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const getGroup = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await groupService.getGroup(id)
      return response.data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast({
        title: 'Error',
        description: 'Failed to fetch group',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const createGroup = useCallback(async (input: CreateGroupInput) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await groupService.createGroup(input)
      toast({
        title: 'Success',
        description: 'Group created successfully',
      })
      return response.data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast({
        title: 'Error',
        description: 'Failed to create group',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const join = useCallback(async (groupId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await groupService.join(groupId)
      toast({
        title: 'Success',
        description: 'Successfully joined group',
      })
      return response.data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast({
        title: 'Error',
        description: 'Failed to join group',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const leave = useCallback(async (groupId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await groupService.leave(groupId)
      toast({
        title: 'Success',
        description: 'Successfully left group',
      })
      return response.data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast({
        title: 'Error',
        description: 'Failed to leave group',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const getMembers = useCallback(async (groupId: string, params?: PaginationParams) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await groupService.getMembers(groupId, params)
      return response.data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast({
        title: 'Error',
        description: 'Failed to fetch group members',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const getMyGroups = useCallback(async (params?: PaginationParams) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await groupService.getMyGroups(params)
      return response.data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast({
        title: 'Error',
        description: 'Failed to fetch your groups',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const updateGroup = useCallback(async (groupId: string, input: Partial<CreateGroupInput>) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await groupService.updateGroup(groupId, input)
      toast({
        title: 'Success',
        description: 'Group updated successfully',
      })
      return response.data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast({
        title: 'Error',
        description: 'Failed to update group',
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
    getGroups,
    getGroup,
    createGroup,
    join,
    leave,
    getMembers,
    getMyGroups,
    updateGroup,
  }
}
