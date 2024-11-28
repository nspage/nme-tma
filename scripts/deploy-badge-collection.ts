import { Address, beginCell, Cell, toNano } from 'ton-core';
import { TonClient4 } from '@ton/ton';
import fs from 'fs';
import path from 'path';

async function deploy() {
  // Initialize TON client
  const client = new TonClient4({
    endpoint: process.env.TON_ENDPOINT || 'https://mainnet-v4.ton.org',
  });

  // Load contract code
  const contractCode = Cell.fromBoc(
    fs.readFileSync(
      path.resolve(__dirname, '../src/contracts/badge-collection.fc')
    )
  )[0];

  // Get deployer wallet
  const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!deployerPrivateKey) {
    throw new Error('DEPLOYER_PRIVATE_KEY not set in environment');
  }

  const deployerWallet = client.open(deployerPrivateKey);
  const deployerAddress = await deployerWallet.address();

  // Prepare initial data
  const initialData = beginCell()
    .storeUint(0, 64) // next_item_index
    .storeRef(
      beginCell()
        .storeStringTail('TON Event Badge Collection')
        .endCell()
    ) // collection_content
    .storeRef(
      beginCell()
        .storeAddress(deployerAddress)
        .endCell()
    ) // owner_address
    .storeRef(
      beginCell()
        .storeAddress(deployerAddress)
        .endCell()
    ) // minter_address (same as owner initially)
    .storeRef(
      beginCell()
        .storeAddress(Address.parse(process.env.TON_STORAGE_CONTRACT || ''))
        .endCell()
    ) // storage_provider
    .endCell();

  // Calculate contract address
  const stateInit = {
    code: contractCode,
    data: initialData,
  };

  const contractAddress = client.getContractAddress(0, stateInit);
  console.log('Contract will be deployed to:', contractAddress.toString());

  // Deploy contract
  try {
    const seqno = await deployerWallet.getSeqno();
    
    // Send deployment transaction
    const tx = await deployerWallet.sendDeploy(stateInit, {
      value: toNano('0.5'), // Deployment fee
      seqno,
    });

    console.log('Deployment transaction sent:', tx.hash);
    
    // Wait for deployment
    await client.waitForTransaction(tx.hash);
    console.log('Contract successfully deployed!');

    // Save contract address to file
    const deploymentInfo = {
      address: contractAddress.toString(),
      deploymentHash: tx.hash,
      timestamp: new Date().toISOString(),
    };

    fs.writeFileSync(
      path.resolve(__dirname, '../.contract-address'),
      JSON.stringify(deploymentInfo, null, 2)
    );

    console.log('Deployment info saved to .contract-address');
  } catch (error) {
    console.error('Error deploying contract:', error);
    process.exit(1);
  }
}

// Run deployment
deploy().catch(console.error);
