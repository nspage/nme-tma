import { SandboxContract } from '@ton-community/sandbox';
import { EventStorageContract, EventData } from '../contracts/EventStorage';
import { Address } from 'ton-core';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: string;
  maxParticipants: number;
}

export class TonStorageService {
  private cache: Map<string, Event>;
  private deployer: Address;

  constructor(
    private contract: SandboxContract<EventStorageContract>,
    deployer: Address
  ) {
    this.cache = new Map();
    this.deployer = deployer;
  }

  async storeEvent(event: Event): Promise<void> {
    const eventData: EventData = {
      title: event.title,
      description: event.description,
      date: Math.floor(event.date.getTime() / 1000),
      location: event.location,
      organizer: event.organizer,
      maxParticipants: event.maxParticipants,
    };

    await this.contract.sendStoreData(this.deployer, {
      id: event.id,
      data: eventData,
      value: BigInt('50000000'), // 0.05 TON
    });

    this.cache.set(event.id, event);
  }

  async updateEvent(id: string, update: Partial<Event>): Promise<void> {
    const eventData: Partial<EventData> = {
      ...(update.title && { title: update.title }),
      ...(update.description && { description: update.description }),
      ...(update.date && { date: Math.floor(update.date.getTime() / 1000) }),
      ...(update.location && { location: update.location }),
      ...(update.organizer && { organizer: update.organizer }),
      ...(update.maxParticipants && { maxParticipants: update.maxParticipants }),
    };

    await this.contract.sendUpdateData(this.deployer, {
      id,
      data: eventData,
      value: BigInt('50000000'), // 0.05 TON
    });

    // Update cache
    const cachedEvent = this.cache.get(id);
    if (cachedEvent) {
      this.cache.set(id, { ...cachedEvent, ...update });
    }
  }

  async deleteEvent(id: string): Promise<void> {
    await this.contract.sendDeleteData(this.deployer, {
      id,
      value: BigInt('50000000'), // 0.05 TON
    });

    this.cache.delete(id);
  }

  async getEvents(): Promise<Event[]> {
    const registry = await this.contract.getDataRegistry();
    // TODO: Parse registry cell to get events
    // For now, return cached events
    return Array.from(this.cache.values());
  }

  private async refreshCache(): Promise<void> {
    const registry = await this.contract.getDataRegistry();
    // TODO: Parse registry cell to update cache
  }
}
