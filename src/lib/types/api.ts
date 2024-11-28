// Proposal Types
export interface Proposal {
  id: string
  title: string
  description: string
  author: string
  createdAt: string
  status: 'active' | 'passed' | 'rejected' | 'expired'
  votesFor: number
  votesAgainst: number
  deadline: string
  comments: Comment[]
}

export interface CreateProposalInput {
  title: string
  description: string
  deadline: string
}

export interface VoteInput {
  proposalId: string
  vote: 'for' | 'against'
}

// Event Types
export interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  organizer: string
  attendees: string[]
  maxAttendees?: number
  category: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  badge?: {
    image: string
    role: string
    achievement?: string
  }
}

export interface CreateEventInput {
  title: string
  description: string
  date: string
  location: string
  maxAttendees?: number
  category: string
  badgeImage: string
  badgeRole: 'ATTENDEE' | 'SPEAKER' | 'ORGANIZER' | 'SPONSOR' | 'VIP'
  badgeAttributes?: {
    achievement?: string
    customField1?: string
    customField2?: string
  }
}

// Group Types
export interface Group {
  id: string
  name: string
  description: string
  category: string
  members: string[]
  admins: string[]
  createdAt: string
  discussions: number
}

export interface CreateGroupInput {
  name: string
  description: string
  category: string
}

// Member Types
export interface Member {
  id: string
  address: string
  username: string
  bio: string
  avatar: string
  role: string
  joinedAt: string
  socialLinks: {
    platform: string
    url: string
  }[]
  groups: Group[]
  proposalsCreated: number
  eventsAttended: number
  votesParticipated: number
  proposals: Proposal[]
  votes: {
    proposalId: string
    vote: 'for' | 'against'
    timestamp: string
  }[]
}

export interface UpdateMemberInput {
  username?: string
  bio?: string
  avatar?: string
  socialLinks?: {
    platform: string
    url: string
  }[]
}

// Comment Types
export interface Comment {
  id: string
  content: string
  author: string
  createdAt: string
  replies?: Comment[]
}

export interface CreateCommentInput {
  content: string
  proposalId: string
  parentId?: string
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
}

// Pagination Types
export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
