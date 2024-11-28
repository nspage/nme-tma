import { useCallback } from 'react'
import { Address, Cell, toNano, beginCell } from 'ton-core'
import { useTonClient } from './use-ton-client'
import { ProposalContract, ProposalConfig } from '../contracts/proposal'
import { useWalletTransaction } from './use-wallet-transaction'
import { useTonConnect } from './use-ton-connect'

export interface CreateProposalParams {
  title: string
  description: string
  deadline: Date
  minVotingPower: string // in TON
  quorum: string // in TON
}

export function useCreateProposal() {
  const client = useTonClient()
  const { sendTransaction } = useWalletTransaction()
  const { wallet } = useTonConnect()

  const createProposal = useCallback(async (params: CreateProposalParams) => {
    if (!client || !wallet?.address) {
      throw new Error('Wallet not connected')
    }

    try {
      // Create unique proposal ID
      const proposalId = `${Date.now()}-${Math.random().toString(36).slice(2)}`

      // Create proposal config
      const config: ProposalConfig = {
        id: proposalId,
        title: params.title,
        description: params.description,
        author: Address.parse(wallet.address),
        deadline: Math.floor(params.deadline.getTime() / 1000),
        minVotingPower: toNano(params.minVotingPower),
        quorum: toNano(params.quorum),
      }

      // Get contract code
      const code = Cell.fromBoc(Buffer.from(process.env.VITE_PROPOSAL_CONTRACT_CODE!, 'base64'))[0]

      // Create contract instance
      const contract = ProposalContract.createFromConfig(config, code)

      // Deploy contract
      await sendTransaction({
        messages: [
          {
            address: contract.address.toString(),
            amount: toNano('0.1'), // Initial balance for contract
            stateInit: {
              code: code.toBoc().toString('base64'),
              data: beginCell()
                .storeUint(0, 1) // Simple version
                .storeAddress(Address.parse(wallet.address))
                .storeUint(config.deadline, 32)
                .storeCoins(config.minVotingPower)
                .storeCoins(config.quorum)
                .storeRef(
                  beginCell()
                    .storeStringTail(config.id)
                    .storeStringTail(config.title)
                    .storeStringTail(config.description)
                    .endCell()
                )
                .endCell()
                .toBoc()
                .toString('base64'),
            },
          },
        ],
      })

      return {
        proposalId,
        contractAddress: contract.address.toString(),
      }
    } catch (error) {
      console.error('Failed to create proposal:', error)
      throw error
    }
  }, [client, wallet, sendTransaction])

  return {
    createProposal,
  }
}
