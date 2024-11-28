import { Event } from '../../types/api';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'TON Community Meetup',
    description: 'Join us for a community meetup to discuss the latest developments in TON ecosystem.',
    date: '2024-12-01T18:00:00Z',
    location: 'San Francisco, CA',
    organizer: 'TON Foundation',
    attendees: [],
    maxAttendees: 100,
    category: 'meetup',
    status: 'upcoming',
    badge: {
      image: 'https://example.com/badge1.png',
      role: 'attendee',
    },
  },
  {
    id: '2',
    title: 'TON Developers Conference',
    description: 'A conference for developers building on TON blockchain.',
    date: '2024-12-15T09:00:00Z',
    location: 'Virtual',
    organizer: 'TON Dev Community',
    attendees: [],
    maxAttendees: 500,
    category: 'conference',
    status: 'upcoming',
    badge: {
      image: 'https://example.com/badge2.png',
      role: 'speaker',
      achievement: 'Speaker at TON Dev Conference 2024',
    },
  },
];
