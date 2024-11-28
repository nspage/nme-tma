import { apiClient } from '../client'
import {
  ApiResponse,
  Group,
  CreateGroupInput,
  PaginationParams,
  PaginatedResponse,
} from '../../types/api'

export const groupService = {
  // Get all groups with pagination
  getGroups: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Group>>('/groups', {
      params,
    }),

  // Get a single group by ID
  getGroup: (id: string) =>
    apiClient.get<Group>(`/groups/${id}`),

  // Create a new group
  createGroup: (input: CreateGroupInput) =>
    apiClient.post<Group>('/groups', input),

  // Join a group
  join: (groupId: string) =>
    apiClient.post<Group>(`/groups/${groupId}/join`),

  // Leave a group
  leave: (groupId: string) =>
    apiClient.delete<Group>(`/groups/${groupId}/leave`),

  // Get members of a group
  getMembers: (groupId: string, params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<string>>(`/groups/${groupId}/members`, {
      params,
    }),

  // Get groups for current user
  getMyGroups: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Group>>('/groups/my', {
      params,
    }),

  // Update group settings (admin only)
  updateGroup: (groupId: string, input: Partial<CreateGroupInput>) =>
    apiClient.patch<Group>(`/groups/${groupId}`, input),
}
