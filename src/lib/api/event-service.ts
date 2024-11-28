import { TonClient } from '@ton/ton';
import { Address } from '@ton/core';
import { BadgeCollection } from '@/contracts/badge-collection';
import { getHttpEndpoint } from '@orbs-network/ton-access';

export interface CreateEventInput {
  title: string;
  description: string;
  date: string;
  location: string;
  maxAttendees?: number;
  category: string;
  badgeImage: string;
  badgeRole: 'ATTENDEE' | 'SPEAKER' | 'ORGANIZER' | 'SPONSOR' | 'VIP';
  badgeAttributes?: {
    achievement?: string;
    customField1?: string;
    customField2?: string;
  };
}

export interface EventResponse {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  maxAttendees?: number;
  category: string;
  badgeImage: string;
  badgeRole: string;
  badgeAttributes?: {
    achievement?: string;
    customField1?: string;
    customField2?: string;
  };
  createdAt: string;
  updatedAt: string;
}

class EventService {
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

  async createEvent(input: CreateEventInput): Promise<EventResponse> {
    try {
      const collection = await this.initializeCollection();
      
      // Format metadata according to TEP-64
      const metadata = {
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

      // Create event in the collection contract
      const result = await collection.createEvent(metadata);

      return {
        id: result.id,
        ...input,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Failed to create event. Please try again.');
    }
  }

  async getEvent(id: string): Promise<EventResponse> {
    try {
      const collection = await this.initializeCollection();
      const event = await collection.getEvent(id);
      
      return {
        id,
        title: event.metadata.name,
        description: event.metadata.description,
        date: event.metadata.attributes.event_date,
        location: event.metadata.attributes.location,
        category: event.metadata.attributes.category,
        badgeImage: event.metadata.image,
        badgeRole: event.metadata.attributes.role,
        badgeAttributes: {
          achievement: event.metadata.attributes.achievement,
          customField1: event.metadata.attributes.custom_field_1,
          customField2: event.metadata.attributes.custom_field_2,
        },
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      };
    } catch (error) {
      console.error('Error fetching event:', error);
      throw new Error('Failed to fetch event. Please try again.');
    }
  }

  async getEvents(): Promise<EventResponse[]> {
    try {
      const collection = await this.initializeCollection();
      const events = await collection.getEvents();
      
      return events.map(event => ({
        id: event.id,
        title: event.metadata.name,
        description: event.metadata.description,
        date: event.metadata.attributes.event_date,
        location: event.metadata.attributes.location,
        category: event.metadata.attributes.category,
        badgeImage: event.metadata.image,
        badgeRole: event.metadata.attributes.role,
        badgeAttributes: {
          achievement: event.metadata.attributes.achievement,
          customField1: event.metadata.attributes.custom_field_1,
          customField2: event.metadata.attributes.custom_field_2,
        },
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new Error('Failed to fetch events. Please try again.');
    }
  }
}

export const eventService = new EventService();