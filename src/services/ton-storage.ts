import { Cell, beginCell, Address } from 'ton-core';
import { TonClient, WalletContractV4 } from '@ton/ton';
import { Buffer } from 'buffer';
import { EventStorageContract } from '../contracts/EventStorage';

const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export interface EventMetadata {
  title: string;
  description: string;
  imageUrl?: string;
  additionalDetails?: Record<string, any>;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class TonStorageService {
  private client: TonClient;
  private storageContract: EventStorageContract;
  private cache: Map<string, CacheEntry<any>> = new Map();

  constructor(endpoint: string, contractAddress: Address) {
    this.client = new TonClient({ endpoint });
    this.storageContract = new EventStorageContract(contractAddress);
  }

  private isCacheValid<T>(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    return Date.now() - entry.timestamp < CACHE_EXPIRY;
  }

  private getCachedData<T>(key: string): T | null {
    if (!this.isCacheValid(key)) {
      this.cache.delete(key);
      return null;
    }
    return this.cache.get(key)?.data || null;
  }

  private setCachedData<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  // Convert event metadata to cell format
  private serializeMetadata(metadata: EventMetadata): Cell {
    const content = beginCell();
    
    content.storeStringTail(metadata.title);
    content.storeStringTail(metadata.description);
    
    if (metadata.imageUrl) {
      content.storeBit(1);
      content.storeStringTail(metadata.imageUrl);
    } else {
      content.storeBit(0);
    }

    if (metadata.additionalDetails) {
      content.storeBit(1);
      content.storeStringTail(JSON.stringify(metadata.additionalDetails));
    } else {
      content.storeBit(0);
    }

    return content.endCell();
  }

  // Deserialize metadata from cell format
  private deserializeMetadata(cell: Cell): EventMetadata {
    const slice = cell.beginParse();
    
    const metadata: EventMetadata = {
      title: slice.loadStringTail(),
      description: slice.loadStringTail(),
    };

    if (slice.loadBit()) {
      metadata.imageUrl = slice.loadStringTail();
    }

    if (slice.loadBit()) {
      metadata.additionalDetails = JSON.parse(slice.loadStringTail());
    }

    return metadata;
  }

  // Upload event metadata using smart contract
  async uploadEventMetadata(
    wallet: WalletContractV4,
    eventId: string,
    metadata: EventMetadata
  ): Promise<string> {
    try {
      const cell = this.serializeMetadata(metadata);
      const dataId = BigInt('0x' + Buffer.from(eventId).toString('hex'));

      await this.storageContract.sendStoreData(this.client.provider(), {
        via: wallet.sender(),
        params: {
          dataId,
          data: cell,
        },
      });

      // Cache the metadata
      this.setCachedData(`event:${eventId}`, metadata);
      
      return `ton://${eventId}`;
    } catch (error) {
      console.error('Error uploading to TON Storage:', error);
      throw error;
    }
  }

  // Update event metadata
  async updateEventMetadata(
    wallet: WalletContractV4,
    eventId: string,
    metadata: EventMetadata
  ): Promise<void> {
    try {
      const cell = this.serializeMetadata(metadata);
      const dataId = BigInt('0x' + Buffer.from(eventId).toString('hex'));

      await this.storageContract.sendUpdateData(this.client.provider(), {
        via: wallet.sender(),
        params: {
          dataId,
          data: cell,
        },
      });

      // Update cache
      this.setCachedData(`event:${eventId}`, metadata);
    } catch (error) {
      console.error('Error updating event metadata:', error);
      throw error;
    }
  }

  // Delete event metadata
  async deleteEventMetadata(
    wallet: WalletContractV4,
    eventId: string
  ): Promise<void> {
    try {
      const dataId = BigInt('0x' + Buffer.from(eventId).toString('hex'));

      await this.storageContract.sendDeleteData(this.client.provider(), {
        via: wallet.sender(),
        params: {
          dataId,
        },
      });

      // Remove from cache
      this.cache.delete(`event:${eventId}`);
    } catch (error) {
      console.error('Error deleting event metadata:', error);
      throw error;
    }
  }

  // Helper method to chunk large data
  private chunkData(data: string, chunkSize: number): string[] {
    const chunks: string[] = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }
    return chunks;
  }

  // Store large data by splitting it into multiple cells
  async storeLargeData(data: string): Promise<Cell> {
    const chunks = this.chunkData(data, 127); // TON cells can store ~127 bytes of data
    let currentCell = beginCell();
    
    for (let i = chunks.length - 1; i >= 0; i--) {
      const chunk = chunks[i];
      if (i === chunks.length - 1) {
        currentCell.storeStringTail(chunk);
      } else {
        currentCell = beginCell()
          .storeStringTail(chunk)
          .storeRef(currentCell.endCell());
      }
    }
    
    return currentCell.endCell();
  }

  // Retrieve large data from multiple cells
  async retrieveLargeData(cell: Cell): Promise<string> {
    let currentCell = cell;
    let result = '';
    
    while (true) {
      const slice = currentCell.beginParse();
      result = slice.loadStringTail() + result;
      
      if (!slice.remainingRefs) {
        break;
      }
      
      currentCell = slice.loadRef();
    }
    
    return result;
  }

  // Clear expired cache entries
  clearExpiredCache(): void {
    for (const [key, entry] of this.cache.entries()) {
      if (!this.isCacheValid(key)) {
        this.cache.delete(key);
      }
    }
  }
}

// Create storage provider configuration
export const createTonStorageService = (endpoint: string, contractAddress: Address) => {
  return new TonStorageService(endpoint, contractAddress);
};
