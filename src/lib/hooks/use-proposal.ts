import { useCallback, useEffect, useState } from 'react'
import { Address, fromNano, toNano } from 'ton-core'
import { useTonClient } from './use-ton-client'
import { ProposalContract } from '../contracts/proposal'
import { useWalletTransaction } from './use-wallet-transaction'
import { useTonConnect } from './use-ton-connect'

export interface ProposalState {
  votesFor: string
  votesAgainst: string
  quorum: string
  status: 'active' | 'passed' | 'rejected' | 'expired'
  deadline: Date
  isLoading: boolean
  error: Error | null
}

export function useProposal(contractAddress: string) {
  const client = useTonClient()
  const { sendTransaction } = useWalletTransaction()
  const { wallet } = useTonConnect()
  const [state, setState] = useState<ProposalState>({
    votesFor: '0',
    votesAgainst: '0',
    quorum: '0',
    status: 'active',
    deadline: new Date(),
    isLoading: true,
    error: null,
  })

  const fetchProposalState = useCallback(async () => {
    if (!client || !contractAddress) return

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const contract = new ProposalContract(
        Address.parse(contractAddress)
      )

      const [votes, status] = await Promise.all([
        contract.getVotes(client),
        contract.getStatus(client),
      ])

      setState({
        votesFor: fromNano(votes.votesFor),
        votesAgainst: fromNano(votes.votesAgainst),
        quorum: fromNano(votes.quorum),
        status: status.status,
        deadline: new Date(status.deadline * 1000),
        isLoading: false,
        error: null,
      })
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err : new Error('Failed to fetch proposal state'),
      }))
    }
  }, [client, contractAddress])

  const vote = useCallback(async (support: boolean, amount: string) => {
    if (!wallet?.account.address) {
      throw new Error('Wallet not connected')
    }

    await sendTransaction({
      messages: [
        {
          address: contractAddress,
          amount: toNano('0.05'), // Gas fee
          payload: {
            abi: 'Proposal',
            method: 'vote',
            params: {
              support,
              votingPower: toNano(amount),
            },
          },
        },
      ],
    })

    // Refetch state after voting
    await fetchProposalState()
  }, [wallet, contractAddress, sendTransaction, fetchProposalState])

  // Fetch initial state
  useEffect(() => {
    fetchProposalState()
  }, [fetchProposalState])

  // Poll for updates
  useEffect(() => {
    if (state.status === 'active') {
      const interval = setInterval(fetchProposalState, 10000) // Poll every 10 seconds
      return () => clearInterval(interval)
    }
  }, [fetchProposalState, state.status])

  return {
    ...state,
    vote,
    refetch: fetchProposalState,
  }
}
