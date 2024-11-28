import { apiClient } from '../client'
import {
  ApiResponse,
  Member,
  UpdateMemberInput,
  PaginationParams,
  PaginatedResponse,
  Event,
  Proposal,
  Group,
} from '../../types/api'

export const memberService = {
  // Get current member profile
  getProfile: () =>
    apiClient.get<Member>('/members/me'),

  // Get a member by ID or address
  getMember: (idOrAddress: string) =>
    apiClient.get<Member>(`/members/${idOrAddress}`),

  // Update member profile
  updateProfile: (input: UpdateMemberInput) =>
    apiClient.patch<Member>('/members/me', input),

  // Get all members with pagination
  getMembers: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Member>>('/members', {
      params,
    }),

  // Get member's voting history
  getVotingHistory: (memberId: string, params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Proposal>>(`/members/${memberId}/votes`, {
      params,
    }),

  // Get member's proposals
  getProposals: (memberId: string, params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Proposal>>(`/members/${memberId}/proposals`, {
      params,
    }),

  // Get member's groups
  getGroups: (memberId: string, params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Group>>(`/members/${memberId}/groups`, {
      params,
    }),

  // Get member's event history
  getEventHistory: (memberId: string, params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Event>>(`/members/${memberId}/events`, {
      params,
    }),

  // Get member's governance history (proposals and votes)
  getGovernanceHistory: (memberId: string, params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Proposal>>(`/members/${memberId}/governance`, {
      params,
    }),
}
