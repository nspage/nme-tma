import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, beginCell, Address } from 'ton-core';
import { EventStorageContract } from '../contracts/EventStorage';
import { BadgeCollectionContract } from '../contracts/badge-collection';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function deployEventStorage(blockchain: Blockchain): Promise<SandboxContract<EventStorageContract>> {
  // Create test wallet
  const deployer = await blockchain.treasury('deployer');

  // Read compiled contract
  const storageCode = Cell.fromBoc(readFileSync(
    join(__dirname, '../contracts/event_storage.cell')
  ))[0];

  // Create initial data cell
  const dataCell = beginCell()
    .storeAddress(deployer.address)
    .storeDict(null)
    .endCell();

  // Create contract
  const contract = blockchain.openContract(
    EventStorageContract.createFromAddress(
      Address.parseFriendly(deployer.address.toString()).address
    )
  );

  // Deploy
  const deployResult = await contract.sendDeploy(deployer.getSender(), BigInt('10000000')); // 0.01 TON

  if (!deployResult.transactions.length) {
    throw new Error('Contract deployment failed');
  }

  return contract;
}

export async function deployBadgeCollection(blockchain: Blockchain): Promise<SandboxContract<BadgeCollectionContract>> {
  // Create test wallets
  const deployer = await blockchain.treasury('deployer');
  const minter = await blockchain.treasury('minter');
  const storageProvider = await blockchain.treasury('storage');

  // Read compiled contract
  const collectionCode = Cell.fromBoc(readFileSync(
    join(__dirname, '../contracts/badge_collection.cell')
  ))[0];

  // Create initial data cell
  const collectionContent = beginCell()
    .storeStringTail('Test Badge Collection')
    .endCell();

  const config = {
    ownerAddress: deployer.address,
    minterAddress: minter.address,
    storageProvider: storageProvider.address,
    collectionContent,
  };

  const contract = BadgeCollectionContract.createFromConfig(config, collectionCode);

  // Deploy contract
  const deployResult = await blockchain.createContract({
    code: collectionCode,
    data: contract.init!.data,
  });

  const badgeCollection = blockchain.openContract(
    contract.address,
    BadgeCollectionContract
  );

  return badgeCollection;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
