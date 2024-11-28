import { TonClient } from '@ton/ton';
import { Address } from '@ton/core';
import { BadgeCollection } from '@/contracts/badge-collection';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { apiClient } from '../client';
import {
  ApiResponse,
  Event,
  CreateEventInput,
  PaginationParams,
  PaginatedResponse,
} from '../../types/api';

// Initialize TON client and badge collection
class BadgeService {
  private client: TonClient | null = null;
  private collection: BadgeCollection | null = null;

  private async initializeClient() {
    if (!this.client) {
      const endpoint = await getHttpEndpoint({
        network: import.meta.env.VITE_TON_NETWORK === 'testnet' ? 'testnet' : 'mainnet'
      });
      this.client = new TonClient({ endpoint });
    }
    return this.client;
  }

  private async initializeCollection() {
    if (!this.collection) {
      const client = await this.initializeClient();
      const address = Address.parse(import.meta.env.VITE_BADGE_COLLECTION_ADDRESS);
      this.collection = new BadgeCollection(address);
      await this.collection.init(client);
    }
    return this.collection;
  }

  async createBadge(metadata: any) {
    const collection = await this.initializeCollection();
    return collection.createEvent(metadata);
  }

  async getBadge(id: string) {
    const collection = await this.initializeCollection();
    return collection.getEvent(id);
  }

  async getBadges() {
    const collection = await this.initializeCollection();
    return collection.getEvents();
  }
}

const badgeService = new BadgeService();

export const eventService = {
  // Get all events with pagination
  getEvents: async (params?: PaginationParams) => {
    const [apiEvents, onchainBadges] = await Promise.all([
      apiClient.get<PaginatedResponse<Event>>('/events', { params }),
      badgeService.getBadges()
    ]);

    // Merge API events with onchain badge data
    const mergedEvents = apiEvents.data.items.map(event => {
      const badge = onchainBadges.find(b => b.id === event.id);
      return {
        ...event,
        badge: badge ? {
          image: badge.metadata.image,
          role: badge.metadata.attributes.role,
          achievement: badge.metadata.attributes.achievement,
        } : null
      };
    });

    return {
      ...apiEvents.data,
      items: mergedEvents
    };
  },

  // Get a single event by ID
  getEvent: async (id: string) => {
    const [apiEvent, onchainBadge] = await Promise.all([
      apiClient.get<Event>(`/events/${id}`),
      badgeService.getBadge(id)
    ]);

    return {
      ...apiEvent.data,
      badge: onchainBadge ? {
        image: onchainBadge.metadata.image,
        role: onchainBadge.metadata.attributes.role,
        achievement: onchainBadge.metadata.attributes.achievement,
      } : null
    };
  },

  // Create a new event with badge
  createEvent: async (input: CreateEventInput) => {
    // First create the event in API
    const apiEvent = await apiClient.post<Event>('/events', input);

    // Then create the badge onchain
    const badgeMetadata = {
      name: input.title,
      description: input.description,
      image: input.badgeImage,
      attributes: {
        event_date: input.date,
        location: input.location,
        role: input.badgeRole,
        ...(input.badgeAttributes?.achievement && { achievement: input.badgeAttributes.achievement }),
        ...(input.badgeAttributes?.customField1 && { custom_field_1: input.badgeAttributes.customField1 }),
        ...(input.badgeAttributes?.customField2 && { custom_field_2: input.badgeAttributes.customField2 }),
      }
    };

    const badge = await badgeService.createBadge(badgeMetadata);

    return {
      ...apiEvent.data,
      badge: {
        image: badgeMetadata.image,
        role: badgeMetadata.attributes.role,
        achievement: badgeMetadata.attributes.achievement,
      }
    };
  },

  // Register for an event and mint badge
  register: async (eventId: string) => {
    const apiResponse = await apiClient.post<Event>(`/events/${eventId}/register`);
    const collection = await badgeService.initializeCollection();
    await collection.mintBadge(eventId);
    return apiResponse;
  },

  // Unregister from an event (badge remains as it's non-transferable)
  unregister: (eventId: string) =>
    apiClient.delete<Event>(`/events/${eventId}/register`),

  // Get registered events and badges for current user
  getMyEvents: async (params?: PaginationParams) => {
    const [apiEvents, onchainBadges] = await Promise.all([
      apiClient.get<PaginatedResponse<Event>>('/events/my', { params }),
      badgeService.getBadges()
    ]);

    const mergedEvents = apiEvents.data.items.map(event => {
      const badge = onchainBadges.find(b => b.id === event.id);
      return {
        ...event,
        badge: badge ? {
          image: badge.metadata.image,
          role: badge.metadata.attributes.role,
          achievement: badge.metadata.attributes.achievement,
        } : null
      };
    });

    return {
      ...apiEvents.data,
      items: mergedEvents
    };
  },
};
