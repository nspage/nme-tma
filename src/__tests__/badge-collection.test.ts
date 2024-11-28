import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Address, beginCell, Cell } from 'ton-core';
import { BadgeCollectionContract } from '../contracts/badge-collection';
import { deployBadgeCollection } from '../test/setup';

describe('BadgeCollectionContract', () => {
  let blockchain: Blockchain;
  let contract: SandboxContract<BadgeCollectionContract>;
  let owner: SandboxContract<any>;
  let minter: SandboxContract<any>;
  let user: SandboxContract<any>;

  beforeAll(async () => {
    blockchain = await Blockchain.create();
    
    // Create test wallets
    owner = await blockchain.treasury('owner');
    minter = await blockchain.treasury('minter');
    user = await blockchain.treasury('user');
  });

  beforeEach(async () => {
    // Deploy new contract instance for each test
    contract = await deployBadgeCollection(blockchain);
  });

  describe('Collection Data', () => {
    it('should return correct collection data', async () => {
      const data = await contract.getCollectionData();
      
      expect(data.nextItemIndex).toBe(0);
      expect(data.ownerAddress).toEqual(owner.address);
      expect(data.minterAddress).toEqual(minter.address);
    });

    it('should have correct initial state', async () => {
      const state = await contract.getState();
      expect(state.isDeployed).toBe(true);
    });
  });

  describe('Minting', () => {
    it('should allow minter to mint badges', async () => {
      const metadata = beginCell()
        .storeStringTail('Test Badge Metadata')
        .endCell();

      await contract.mint(minter.getSender(), {
        to: user.address,
        content: metadata,
      });

      const nextIndex = await contract.getNextItemIndex();
      expect(nextIndex).toBe(1);
    });

    it('should not allow non-minter to mint badges', async () => {
      const metadata = beginCell()
        .storeStringTail('Test Badge Metadata')
        .endCell();

      await expect(
        contract.mint(user.getSender(), {
          to: user.address,
          content: metadata,
        })
      ).rejects.toThrow();
    });
  });

  describe('Ownership', () => {
    it('should verify badge ownership correctly', async () => {
      // Mint a badge first
      const metadata = beginCell()
        .storeStringTail('Test Badge Metadata')
        .endCell();

      await contract.mint(minter.getSender(), {
        to: user.address,
        content: metadata,
      });

      const isOwner = await contract.verifyOwnership(user.address, 0);
      expect(isOwner).toBe(true);
    });

    it('should return false for non-owners', async () => {
      // Mint a badge to user1
      const metadata = beginCell()
        .storeStringTail('Test Badge Metadata')
        .endCell();

      await contract.mint(minter.getSender(), {
        to: user.address,
        content: metadata,
      });

      // Check ownership with different address
      const otherUser = await blockchain.treasury('otherUser');
      const isOwner = await contract.verifyOwnership(otherUser.address, 0);
      expect(isOwner).toBe(false);
    });
  });

  describe('Metadata', () => {
    it('should store and retrieve metadata correctly', async () => {
      const testMetadata = beginCell()
        .storeStringTail('Test Badge Metadata')
        .endCell();

      await contract.mint(minter.getSender(), {
        to: user.address,
        content: testMetadata,
      });

      const metadata = await contract.getBadgeMetadata(0);
      expect(metadata.toString()).toEqual(testMetadata.toString());
    });
  });

  describe('SBT Functionality', () => {
    it('should not allow badge transfer', async () => {
      // Mint a badge
      const metadata = beginCell()
        .storeStringTail('Test Badge Metadata')
        .endCell();

      await contract.mint(minter.getSender(), {
        to: user.address,
        content: metadata,
      });

      // Attempt to transfer
      const otherUser = await blockchain.treasury('otherUser');
      await expect(
        contract.transfer(user.getSender(), {
          to: otherUser.address,
          tokenId: 0,
        })
      ).rejects.toThrow();
    });
  });
});
