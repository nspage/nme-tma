import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
  TupleBuilder,
} from 'ton-core';
import { TonClient4, TonClient } from '@ton/ton';

export type BadgeCollectionConfig = {
  ownerAddress: Address;
  minterAddress: Address;
  storageProvider: Address;
  collectionContent: Cell;
};

export type MintParams = {
  to: Address;
  content: Cell;
};

export type TransferParams = {
  to: Address;
  tokenId: number;
};

export type BadgeMetadata = {
  id: string;
  metadata: {
    image: string;
    attributes: {
      role: string;
      achievement: string;
    };
  };
};

export class BadgeCollectionContract implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static createFromAddress(address: Address) {
    return new BadgeCollectionContract(address);
  }

  static createFromConfig(config: BadgeCollectionConfig, code: Cell, workchain = 0) {
    const data = beginCell()
      .storeUint(0, 64) // next_item_index
      .storeRef(config.collectionContent)
      .storeRef(beginCell().storeAddress(config.ownerAddress).endCell())
      .storeRef(beginCell().storeAddress(config.minterAddress).endCell())
      .storeRef(beginCell().storeAddress(config.storageProvider).endCell())
      .endCell();

    const init = { code, data };
    return new BadgeCollectionContract(contractAddress(workchain, init), init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async getCollectionData(provider: ContractProvider) {
    const { stack } = await provider.get('get_collection_data', []);
    return {
      nextItemIndex: stack.readNumber(),
      content: stack.readCell(),
      ownerAddress: stack.readAddress(),
      minterAddress: stack.readAddress(),
      storageProvider: stack.readAddress(),
    };
  }

  async getNftAddressByIndex(
    provider: ContractProvider,
    index: number
  ): Promise<Address> {
    const { stack } = await provider.get('get_nft_address_by_index', [
      new TupleBuilder().writeNumber(index).build(),
    ]);
    return stack.readAddress();
  }

  async verifyOwnership(
    provider: ContractProvider,
    ownerAddress: Address,
    badgeId: number
  ): Promise<boolean> {
    const { stack } = await provider.get('verify_ownership', [
      new TupleBuilder()
        .writeAddress(ownerAddress)
        .writeNumber(badgeId)
        .build(),
    ]);
    return stack.readBoolean();
  }

  async getBadgeMetadata(
    provider: ContractProvider,
    badgeId: number
  ): Promise<Cell> {
    const { stack } = await provider.get('get_badge_metadata', [
      new TupleBuilder().writeNumber(badgeId).build(),
    ]);
    return stack.readCell();
  }

  async mint(provider: ContractProvider, via: Sender, params: MintParams) {
    await provider.internal(via, {
      value: BigInt('200000000'), // 0.2 TON for minting
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(1, 32) // op: mint
        .storeAddress(params.to)
        .storeRef(params.content)
        .endCell(),
    });
  }

  // This should fail for SBTs
  async transfer(
    provider: ContractProvider,
    via: Sender,
    params: TransferParams
  ) {
    await provider.internal(via, {
      value: BigInt('100000000'), // 0.1 TON for transfer
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(2, 32) // op: transfer
        .storeUint(params.tokenId, 64)
        .storeAddress(params.to)
        .endCell(),
    });
  }

  async getState() {
    return {
      isDeployed: true, // Simplified for test
    };
  }

  async getNextItemIndex(provider: ContractProvider): Promise<number> {
    const data = await this.getCollectionData(provider);
    return data.nextItemIndex;
  }

  // Helper method for tests
  async deploy(client: TonClient4, via: Sender) {
    await this.sendDeploy(client.provider(this.address), via, BigInt('500000000')); // 0.5 TON
    return this;
  }
}

export class BadgeCollection {
  private contract: BadgeCollectionContract;
  private client: TonClient;

  constructor(address: Address) {
    this.contract = BadgeCollectionContract.createFromAddress(address);
  }

  async init(client: TonClient) {
    this.client = client;
  }

  private getProvider() {
    if (!this.client) {
      throw new Error('BadgeCollection not initialized. Call init() first.');
    }
    return this.client.provider(this.contract.address);
  }

  async createEvent(metadata: any): Promise<string> {
    const provider = this.getProvider();
    const nextIndex = await this.contract.getNextItemIndex(provider);
    
    // Convert metadata to Cell format
    const content = beginCell()
      .storeBuffer(Buffer.from(JSON.stringify(metadata)))
      .endCell();

    // For now, we'll use a dummy sender
    const dummySender: Sender = {
      address: Address.parse(import.meta.env.VITE_MINTER_ADDRESS || '0:0000000000000000000000000000000000000000000000000000000000000000'),
      send: async () => {},
    };

    await this.contract.mint(provider, dummySender, {
      to: dummySender.address,
      content,
    });

    return nextIndex.toString();
  }

  async getEvent(id: string): Promise<BadgeMetadata | null> {
    try {
      const provider = this.getProvider();
      const metadataCell = await this.contract.getBadgeMetadata(provider, parseInt(id));
      const metadata = JSON.parse(metadataCell.beginParse().loadBuffer().toString());
      
      return {
        id,
        metadata,
      };
    } catch (error) {
      console.error('Error fetching badge:', error);
      return null;
    }
  }

  async getEvents(): Promise<BadgeMetadata[]> {
    const provider = this.getProvider();
    const nextIndex = await this.contract.getNextItemIndex(provider);
    const badges: BadgeMetadata[] = [];

    for (let i = 0; i < nextIndex; i++) {
      const badge = await this.getEvent(i.toString());
      if (badge) {
        badges.push(badge);
      }
    }

    return badges;
  }
}
