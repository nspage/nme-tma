import { Address, beginCell, Cell } from 'ton-core';
import { TonClient4 } from '@ton/ton';

export type BadgeMetadata = {
  name: string;
  description: string;
  image: string;
  attributes: {
    event: string;
    date: string;
    type: string;
    [key: string]: string;
  };
};

export class BadgeStorage {
  private constructor(
    private readonly client: TonClient4,
    private readonly storageContract: Address
  ) {}

  static async create(client: TonClient4, storageContract: Address) {
    return new BadgeStorage(client, storageContract);
  }

  async uploadMetadata(metadata: BadgeMetadata): Promise<Cell> {
    try {
      // Convert metadata to TON cell format
      const metadataCell = this.createMetadataBag(metadata);
      
      // Upload to TON Storage using storage smart contract
      const { bag } = await this.client.storageProvider.upload({
        data: metadataCell,
      });

      return bag;
    } catch (error) {
      console.error('Error uploading metadata:', error);
      throw error;
    }
  }

  async uploadArtwork(artwork: Buffer): Promise<Cell> {
    try {
      // Create artwork cell
      const artworkCell = beginCell()
        .storeBuffer(artwork)
        .endCell();

      // Upload to TON Storage
      const { bag } = await this.client.storageProvider.upload({
        data: artworkCell,
      });

      return bag;
    } catch (error) {
      console.error('Error uploading artwork:', error);
      throw error;
    }
  }

  async getMetadata(bag: Cell): Promise<BadgeMetadata> {
    try {
      // Download metadata from TON Storage
      const { data } = await this.client.storageProvider.download({
        bag,
      });

      // Parse metadata from cells
      const slice = data.beginParse();
      const contentSlice = slice.loadRef().beginParse();
      const attributesSlice = slice.loadRef().beginParse();

      const name = contentSlice.loadStringTail();
      const description = contentSlice.loadStringTail();
      const image = contentSlice.loadStringTail();

      // Parse attributes dictionary
      const attributes: Record<string, string> = {};
      const dict = attributesSlice.loadDict(
        256,
        (slice) => slice.loadStringTail()
      );

      for (const [key, value] of dict) {
        attributes[Buffer.from(key, 'hex').toString()] = value;
      }

      return {
        name,
        description,
        image,
        attributes: {
          event: attributes.event || '',
          date: attributes.date || '',
          type: attributes.type || '',
          ...attributes,
        },
      };
    } catch (error) {
      console.error('Error fetching metadata:', error);
      throw error;
    }
  }

  async getArtwork(bag: Cell): Promise<Buffer> {
    try {
      // Download artwork from TON Storage
      const { data } = await this.client.storageProvider.download({
        bag,
      });

      return Buffer.from(data.beginParse().loadBuffer());
    } catch (error) {
      console.error('Error fetching artwork:', error);
      throw error;
    }
  }

  // Helper method to create metadata bag
  private createMetadataBag(metadata: BadgeMetadata): Cell {
    return beginCell()
      .storeRef(
        beginCell()
          .storeStringTail(metadata.name)
          .storeStringTail(metadata.description)
          .storeStringTail(metadata.image)
          .endCell()
      )
      .storeRef(
        beginCell()
          .storeDict(
            Object.entries(metadata.attributes).reduce((dict, [key, value]) => {
              return dict.set(
                Buffer.from(key).toString('hex'),
                beginCell().storeStringTail(value).endCell()
              );
            }, new Map())
          )
          .endCell()
      )
      .endCell();
  }
}
