import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ErrorMessage } from '@/components/ui/error-message'
import { useProposals } from '@/lib/hooks/use-proposals'
import { Proposal } from '@/lib/types/api'
import { formatDate, getTimeLeft, getVotePercentage, getStatusColor } from '@/lib/utils'

export function ProposalList() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const { getProposals, isLoading, error } = useProposals()

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await getProposals()
        if (response?.items) {
          setProposals(response.items)
        }
      } catch (error) {
        console.error('Error fetching proposals:', error)
      }
    }

    fetchProposals()
  }, [getProposals])

  if (error) {
    return <ErrorMessage error={error} />
  }

  if (isLoading) {
    return <div>Loading proposals...</div>
  }

  return (
    <div className="grid gap-4">
      {proposals.map((proposal) => (
        <Link key={proposal.id} to={`/proposals/${proposal.id}`}>
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{proposal.title}</CardTitle>
                <span
                  className={`${getStatusColor(
                    proposal.status
                  )} px-2 py-1 rounded-full text-white text-sm`}
                >
                  {proposal.status}
                </span>
              </div>
              <CardDescription>
                Created by {proposal.author} on {formatDate(proposal.createdAt)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {proposal.description}
                </p>
                <div className="flex justify-between text-sm">
                  <span>
                    Time left: {getTimeLeft(proposal.deadline)}
                  </span>
                  <span>
                    Votes: {getVotePercentage(proposal.votesFor, proposal.votesAgainst)}% in favor
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
