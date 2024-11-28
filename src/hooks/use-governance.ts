import { useCallback, useEffect, useState, useMemo } from 'react'
import { useTonAuth } from './use-ton-auth'
import { GovernanceContract, createTonClient } from '@/lib/contracts/governance'
import WebApp from '@twa-dev/sdk'
import { Address } from 'ton-core'

// TODO: Replace with actual contract address
const GOVERNANCE_CONTRACT_ADDRESS = 'EQD...'

export type ProposalData = {
  id: string
  title: string
  description: string
  status: 'active' | 'closed'
  votesFor: number
  votesAgainst: number
  startTime: number
  endTime: number
  quorum: number
  creator: string
  votes: Array<{
    voter: string
    support: boolean
    timestamp: number
    power: number
  }>
  category: string
  tags: string[]
}

export function useGovernance() {
  const { wallet } = useTonAuth()
  const [proposals, setProposals] = useState<ProposalData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userVotes, setUserVotes] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const fetchProposals = useCallback(async () => {
    if (!wallet) return

    try {
      setLoading(true)
      setError(null)

      const client = createTonClient()
      const contract = new GovernanceContract(Address.parse(GOVERNANCE_CONTRACT_ADDRESS))
      const provider = client.open(contract)
      const proposals = await contract.getProposals(provider)

      // Track user votes
      const votes: Record<string, boolean> = {}
      proposals.forEach(proposal => {
        const userVote = proposal.votes.find(v => v.voter === wallet.address)
        if (userVote) {
          votes[proposal.id] = userVote.support
        }
      })
      setUserVotes(votes)
      setProposals(proposals)
    } catch (err) {
      console.error('Failed to fetch proposals:', err)
      setError('Failed to fetch proposals. Please try again.')
      WebApp.showAlert('Failed to fetch proposals. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [wallet])

  // Filter proposals based on search query, category, and tags
  const filteredProposals = useMemo(() => {
    return proposals.filter(proposal => {
      // Search query filter
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch = !searchQuery || 
        proposal.title.toLowerCase().includes(searchLower) ||
        proposal.description.toLowerCase().includes(searchLower)

      // Category filter
      const matchesCategory = selectedCategory === 'all' || 
        proposal.category === selectedCategory

      // Tags filter
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => proposal.tags.includes(tag))

      return matchesSearch && matchesCategory && matchesTags
    })
  }, [proposals, searchQuery, selectedCategory, selectedTags])

  // Get all unique tags from proposals
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    proposals.forEach(proposal => {
      proposal.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [proposals])

  const vote = useCallback(async (proposalId: string, support: boolean) => {
    if (!wallet) {
      WebApp.showAlert('Please connect your wallet to vote.')
      return
    }

    const proposal = proposals.find(p => p.id === proposalId)
    if (!proposal) {
      WebApp.showAlert('Proposal not found.')
      return
    }

    if (new Date(proposal.endTime) < new Date()) {
      WebApp.showAlert('This proposal has ended.')
      return
    }

    if (userVotes[proposalId] !== undefined) {
      WebApp.showAlert('You have already voted on this proposal.')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const client = createTonClient()
      const contract = new GovernanceContract(Address.parse(GOVERNANCE_CONTRACT_ADDRESS))
      const provider = client.open(contract)

      await contract.sendVote(provider, wallet, { proposalId, support })
      WebApp.showAlert('Vote submitted successfully!')
      
      // Update local state
      setUserVotes(prev => ({ ...prev, [proposalId]: support }))
      setProposals(prev => prev.map(p => {
        if (p.id === proposalId) {
          return {
            ...p,
            votesFor: support ? p.votesFor + 1 : p.votesFor,
            votesAgainst: support ? p.votesAgainst : p.votesAgainst + 1,
            votes: [
              ...p.votes,
              {
                voter: wallet.address,
                support,
                timestamp: Date.now(),
                power: 1 // Mock voting power
              }
            ]
          }
        }
        return p
      }))
    } catch (err) {
      console.error('Failed to vote:', err)
      setError('Failed to vote. Please try again.')
      WebApp.showAlert('Failed to vote. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [wallet, proposals, userVotes])

  const createProposal = useCallback(async (params: {
    title: string
    description: string
    quorum: number
    duration: number
    category: string
    tags: string[]
  }) => {
    if (!wallet) {
      WebApp.showAlert('Please connect your wallet to create a proposal.')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const client = createTonClient()
      const contract = new GovernanceContract(Address.parse(GOVERNANCE_CONTRACT_ADDRESS))
      const provider = client.open(contract)

      await contract.createProposal(provider, wallet, params)
      WebApp.showAlert('Proposal created successfully!')
      
      // Add mock proposal to local state
      const newProposal: ProposalData = {
        id: Date.now().toString(),
        title: params.title,
        description: params.description,
        status: 'active',
        votesFor: 0,
        votesAgainst: 0,
        startTime: Date.now(),
        endTime: Date.now() + params.duration * 1000,
        quorum: params.quorum,
        creator: wallet.address,
        votes: [],
        category: params.category,
        tags: params.tags
      }
      setProposals(prev => [...prev, newProposal])
    } catch (err) {
      console.error('Failed to create proposal:', err)
      setError('Failed to create proposal. Please try again.')
      WebApp.showAlert('Failed to create proposal. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [wallet])

  // Fetch proposals when wallet connects
  useEffect(() => {
    if (wallet) {
      fetchProposals()
    }
  }, [wallet, fetchProposals])

  return {
    proposals: filteredProposals,
    allProposals: proposals,
    loading,
    error,
    vote,
    createProposal,
    fetchProposals,
    userVotes,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedTags,
    setSelectedTags,
    allTags
  }
}
