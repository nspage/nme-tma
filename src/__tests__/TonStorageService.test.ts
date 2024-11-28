import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { TonStorageService } from '../services/TonStorageService';
import { EventStorageContract } from '../contracts/EventStorage';
import { deployEventStorage } from '../test/setup';

describe('TonStorageService', () => {
  let blockchain: Blockchain;
  let contract: SandboxContract<EventStorageContract>;
  let storageService: TonStorageService;
  let deployer: SandboxContract<TreasuryContract>;

  beforeEach(async () => {
    blockchain = await Blockchain.create();
    deployer = await blockchain.treasury('deployer');
    contract = await deployEventStorage(blockchain);
    storageService = new TonStorageService(contract);
  });

  it('should store event data', async () => {
    const eventData = {
      id: 'test-event-1',
      title: 'Test Event',
      description: 'Test Description',
      date: new Date(),
      location: 'Test Location',
      organizer: 'Test Organizer',
      maxParticipants: 100,
    };

    await storageService.storeEvent(eventData);
    const events = await storageService.getEvents();
    expect(events).toHaveLength(1);
    expect(events[0].id).toBe(eventData.id);
  });

  it('should update event data', async () => {
    // First store the event
    const eventData = {
      id: 'test-event-1',
      title: 'Test Event',
      description: 'Test Description',
      date: new Date(),
      location: 'Test Location',
      organizer: 'Test Organizer',
      maxParticipants: 100,
    };

    await storageService.storeEvent(eventData);

    // Then update it
    const updateData = {
      title: 'Updated Test Event',
      maxParticipants: 200,
    };

    await storageService.updateEvent('test-event-1', updateData);
    const events = await storageService.getEvents();
    expect(events).toHaveLength(1);
    expect(events[0].title).toBe(updateData.title);
    expect(events[0].maxParticipants).toBe(updateData.maxParticipants);
  });

  it('should delete event data', async () => {
    // First store the event
    const eventData = {
      id: 'test-event-1',
      title: 'Test Event',
      description: 'Test Description',
      date: new Date(),
      location: 'Test Location',
      organizer: 'Test Organizer',
      maxParticipants: 100,
    };

    await storageService.storeEvent(eventData);

    // Then delete it
    await storageService.deleteEvent('test-event-1');
    const events = await storageService.getEvents();
    expect(events).toHaveLength(0);
  });

  it('should handle concurrent operations', async () => {
    const events = Array.from({ length: 5 }, (_, i) => ({
      id: `test-event-${i}`,
      title: `Test Event ${i}`,
      description: `Test Description ${i}`,
      date: new Date(),
      location: `Test Location ${i}`,
      organizer: `Test Organizer ${i}`,
      maxParticipants: 100 + i,
    }));

    // Store events concurrently
    await Promise.all(events.map(event => storageService.storeEvent(event)));

    // Update events concurrently
    await Promise.all(events.map(event => 
      storageService.updateEvent(event.id, { 
        title: `Updated ${event.title}`,
        maxParticipants: event.maxParticipants + 100,
      })
    ));

    // Delete events concurrently
    await Promise.all(events.map(event => storageService.deleteEvent(event.id)));

    const remainingEvents = await storageService.getEvents();
    expect(remainingEvents).toHaveLength(0);
  });
});
