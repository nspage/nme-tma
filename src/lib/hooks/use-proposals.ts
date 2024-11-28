import { useCallback, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { proposalService } from '../api/services/proposals'
import { 
  Proposal, 
  CreateProposalInput, 
  VoteInput, 
  PaginationParams,
  Comment,
  CreateCommentInput,
} from '../types/api'

export function useProposals() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  const getProposals = useCallback(async (params?: PaginationParams) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await proposalService.getProposals(params)
      return response.data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast({
        title: 'Error',
        description: 'Failed to fetch proposals',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const getProposal = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await proposalService.getProposal(id)
      return response.data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast({
        title: 'Error',
        description: 'Failed to fetch proposal',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const createProposal = useCallback(async (input: CreateProposalInput) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await proposalService.createProposal(input)
      toast({
        title: 'Success',
        description: 'Proposal created successfully',
      })
      return response.data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast({
        title: 'Error',
        description: 'Failed to create proposal',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const vote = useCallback(async (input: VoteInput) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await proposalService.vote(input)
      toast({
        title: 'Success',
        description: 'Vote submitted successfully',
      })
      return response.data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast({
        title: 'Error',
        description: 'Failed to submit vote',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const getComments = useCallback(async (proposalId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await proposalService.getComments(proposalId)
      return response.data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast({
        title: 'Error',
        description: 'Failed to fetch comments',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const addComment = useCallback(async (input: CreateCommentInput) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await proposalService.addComment(input)
      toast({
        title: 'Success',
        description: 'Comment added successfully',
      })
      return response.data
    } catch (err) {
      const error = err as Error
      setError(error)
      toast({
        title: 'Error',
        description: 'Failed to add comment',
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
    getProposals,
    getProposal,
    createProposal,
    vote,
    getComments,
    addComment,
  }
}
