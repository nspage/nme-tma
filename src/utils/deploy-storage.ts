import { TonClient, WalletContractV4, internal } from '@ton/ton';
import { Address, Dictionary, beginCell } from 'ton-core';
import { EventStorageContract, EventStorageConfig } from '@/contracts/EventStorage';

export async function deployEventStorage(
  client: TonClient,
  wallet: WalletContractV4,
  ownerAddress: Address
) {
  // Initial empty storage configuration
  const storageConfig: EventStorageConfig = {
    ownerAddress,
    dataRegistry: Dictionary.empty(),
  };

  // Deploy contract
  const eventStorage = EventStorageContract.createFromConfig(
    storageConfig,
    await client.getContractCode() // You'll need to compile and provide the contract code
  );

  // Send deployment transaction
  const seqno = await wallet.getSeqno();
  const transfer = await wallet.createTransfer({
    seqno,
    messages: [
      internal({
        to: eventStorage.address,
        value: '0.1', // Initial balance for contract
        bounce: false,
        body: beginCell().endCell(),
      }),
    ],
  });

  await client.sendExternalMessage(wallet, transfer);

  // Wait for deployment
  let attempts = 0;
  while (attempts < 10) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const deployed = await client.isContractDeployed(eventStorage.address);
    if (deployed) {
      return eventStorage;
    }
    attempts++;
  }

  throw new Error('Contract deployment timeout');
}
