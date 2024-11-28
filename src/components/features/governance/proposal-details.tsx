import { useParams } from 'react-router-dom'
import { useGovernance } from '@/hooks/use-governance'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Loader2, ThumbsUp, ThumbsDown, Calendar, Users, BarChart } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { VoteHistory } from './vote-history'
import { Separator } from '@/components/ui/separator'
import { useTonAuth } from '@/hooks/use-ton-auth'

export function ProposalDetails() {
  const { id } = useParams()
  const { wallet } = useTonAuth()
  const { proposals, loading, vote, userVotes } = useGovernance()
  const proposal = proposals.find(p => p.id === id)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Proposal not found
      </div>
    )
  }

  const totalVotes = proposal.votesFor + proposal.votesAgainst
  const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0
  const againstPercentage = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0
  const quorumPercentage = totalVotes > 0 ? (totalVotes / proposal.quorum) * 100 : 0
  const isActive = proposal.endTime > Date.now()
  const hasVoted = userVotes[proposal.id] !== undefined

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{proposal.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={isActive ? 'default' : 'secondary'}>
                {isActive ? 'Active' : 'Closed'}
              </Badge>
              <Badge variant="outline">{proposal.category}</Badge>
              {proposal.tags.map(tag => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>
          {wallet && isActive && !hasVoted && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => vote(proposal.id, true)}
                className="flex items-center gap-2"
              >
                <ThumbsUp className="h-4 w-4" />
                Vote For
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => vote(proposal.id, false)}
                className="flex items-center gap-2"
              >
                <ThumbsDown className="h-4 w-4" />
                Vote Against
              </Button>
            </div>
          )}
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Timeline</span>
              </div>
              <div className="space-y-1">
                <div>
                  <span className="text-muted-foreground">Created: </span>
                  {format(proposal.startTime, 'PPP')}
                </div>
                <div>
                  <span className="text-muted-foreground">Ends: </span>
                  {format(proposal.endTime, 'PPP')}
                </div>
                <div className="text-sm text-muted-foreground">
                  {isActive
                    ? `Ends ${formatDistanceToNow(proposal.endTime, { addSuffix: true })}`
                    : `Ended ${formatDistanceToNow(proposal.endTime, { addSuffix: true })}`}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Participation</span>
              </div>
              <div className="space-y-1">
                <div>
                  <span className="text-muted-foreground">Total Votes: </span>
                  {totalVotes}
                </div>
                <div>
                  <span className="text-muted-foreground">Quorum Required: </span>
                  {proposal.quorum}
                </div>
                <div className="text-sm text-muted-foreground">
                  {quorumPercentage.toFixed(1)}% of quorum reached
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <BarChart className="h-4 w-4" />
                <span>Results</span>
              </div>
              <div className="space-y-1">
                <div>
                  <span className="text-muted-foreground">For: </span>
                  {proposal.votesFor} ({forPercentage.toFixed(1)}%)
                </div>
                <div>
                  <span className="text-muted-foreground">Against: </span>
                  {proposal.votesAgainst} ({againstPercentage.toFixed(1)}%)
                </div>
                {hasVoted && (
                  <div className="text-sm text-muted-foreground">
                    You voted {userVotes[proposal.id] ? 'For' : 'Against'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{proposal.description}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Voting Progress</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>For ({forPercentage.toFixed(1)}%)</span>
                  <span>Against ({againstPercentage.toFixed(1)}%)</span>
                </div>
                <div className="flex gap-1">
                  <div
                    className="h-2 rounded-l bg-primary transition-all"
                    style={{ width: `${forPercentage}%` }}
                  />
                  <div
                    className="h-2 rounded-r bg-destructive transition-all"
                    style={{ width: `${againstPercentage}%` }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>Quorum Progress</span>
                  <span>{quorumPercentage.toFixed(1)}%</span>
                </div>
                <Progress value={quorumPercentage} />
              </div>
            </div>
          </div>
        </Card>

        <Separator className="my-6" />

        <div className="space-y-4">
          <h3 className="font-medium">Vote History</h3>
          <VoteHistory votes={proposal.votes} />
        </div>
      </div>
    </div>
  )
}
