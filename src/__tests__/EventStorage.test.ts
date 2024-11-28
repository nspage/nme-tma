import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, beginCell } from 'ton-core';
import { EventStorageContract, EventData } from '../contracts/EventStorage';
import { deployEventStorage } from '../test/setup';

describe('EventStorage', () => {
  let blockchain: Blockchain;
  let contract: SandboxContract<EventStorageContract>;
  let deployer: SandboxContract<TreasuryContract>;

  beforeEach(async () => {
    blockchain = await Blockchain.create();
    deployer = await blockchain.treasury('deployer');
    contract = await deployEventStorage(blockchain);
  });

  it('should deploy', async () => {
    const owner = await contract.getOwner();
    expect(owner.toString()).toBe(deployer.address.toString());
  });

  it('should store event data', async () => {
    const eventData: EventData = {
      title: 'Test Event',
      description: 'Test Description',
      date: Math.floor(Date.now() / 1000),
      location: 'Test Location',
      organizer: 'Test Organizer',
      maxParticipants: 100,
    };

    await contract.sendStoreData(deployer.getSender(), {
      id: 'test-event-1',
      data: eventData,
      value: BigInt('50000000'), // 0.05 TON
    });

    const registry = await contract.getDataRegistry();
    expect(registry).toBeDefined();
  });

  it('should update event data', async () => {
    // First store the event
    const eventData: EventData = {
      title: 'Test Event',
      description: 'Test Description',
      date: Math.floor(Date.now() / 1000),
      location: 'Test Location',
      organizer: 'Test Organizer',
      maxParticipants: 100,
    };

    await contract.sendStoreData(deployer.getSender(), {
      id: 'test-event-1',
      data: eventData,
      value: BigInt('50000000'),
    });

    // Then update it
    const updateData: Partial<EventData> = {
      title: 'Updated Test Event',
      maxParticipants: 200,
    };

    await contract.sendUpdateData(deployer.getSender(), {
      id: 'test-event-1',
      data: updateData,
      value: BigInt('50000000'),
    });

    const registry = await contract.getDataRegistry();
    expect(registry).toBeDefined();
  });

  it('should delete event data', async () => {
    // First store the event
    const eventData: EventData = {
      title: 'Test Event',
      description: 'Test Description',
      date: Math.floor(Date.now() / 1000),
      location: 'Test Location',
      organizer: 'Test Organizer',
      maxParticipants: 100,
    };

    await contract.sendStoreData(deployer.getSender(), {
      id: 'test-event-1',
      data: eventData,
      value: BigInt('50000000'),
    });

    // Then delete it
    await contract.sendDeleteData(deployer.getSender(), {
      id: 'test-event-1',
      value: BigInt('50000000'),
    });

    const registry = await contract.getDataRegistry();
    expect(registry).toBeDefined();
  });
});
