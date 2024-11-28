import { useCallback, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { memberService } from '../api/services/members'
import { Member, UpdateMemberInput, PaginationParams } from '../types/api'

export function useMembers() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  const getProfile = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await memberService.getProfile()
      return response.data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast({
        title: 'Error',
        description: 'Failed to fetch profile',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const getMember = useCallback(async (idOrAddress: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await memberService.getMember(idOrAddress)
      return response.data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast({
        title: 'Error',
        description: 'Failed to fetch member',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const getMembers = useCallback(async (params?: PaginationParams) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await memberService.getMembers(params)
      return response.data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast({
        title: 'Error',
        description: 'Failed to fetch members',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const getVotingHistory = useCallback(async (memberId: string, params?: PaginationParams) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await memberService.getVotingHistory(memberId, params)
      return response.data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast({
        title: 'Error',
        description: 'Failed to fetch voting history',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const getProposals = useCallback(async (memberId: string, params?: PaginationParams) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await memberService.getProposals(memberId, params)
      return response.data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast({
        title: 'Error',
        description: 'Failed to fetch member proposals',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const getGroups = useCallback(async (memberId: string, params?: PaginationParams) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await memberService.getGroups(memberId, params)
      return response.data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast({
        title: 'Error',
        description: 'Failed to fetch member groups',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const getEventHistory = useCallback(async (memberId: string, params?: PaginationParams) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await memberService.getEventHistory(memberId, params)
      return response.data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast({
        title: 'Error',
        description: 'Failed to fetch event history',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const getGovernanceHistory = useCallback(async (memberId: string, params?: PaginationParams) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await memberService.getGovernanceHistory(memberId, params)
      return response.data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast({
        title: 'Error',
        description: 'Failed to fetch governance history',
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
    getProfile,
    getMember,
    getMembers,
    getVotingHistory,
    getProposals,
    getGroups,
    getEventHistory,
    getGovernanceHistory,
  }
}
