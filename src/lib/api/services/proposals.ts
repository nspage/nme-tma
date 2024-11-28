import { apiClient } from '../client'
import {
  ApiResponse,
  Proposal,
  CreateProposalInput,
  VoteInput,
  PaginationParams,
  PaginatedResponse,
  Comment,
  CreateCommentInput,
} from '../../types/api'

export const proposalService = {
  // Get all proposals with pagination
  getProposals: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Proposal>>('/proposals', {
      params,
    }),

  // Get a single proposal by ID
  getProposal: (id: string) =>
    apiClient.get<Proposal>(`/proposals/${id}`),

  // Create a new proposal
  createProposal: (input: CreateProposalInput) =>
    apiClient.post<Proposal>('/proposals', input),

  // Vote on a proposal
  vote: (input: VoteInput) =>
    apiClient.post<Proposal>(`/proposals/${input.proposalId}/vote`, input),

  // Get comments for a proposal
  getComments: (proposalId: string) =>
    apiClient.get<Comment[]>(`/proposals/${proposalId}/comments`),

  // Add a comment to a proposal
  addComment: (input: CreateCommentInput) =>
    apiClient.post<Comment>(`/proposals/${input.proposalId}/comments`, input),
}
