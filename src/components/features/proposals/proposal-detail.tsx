import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ErrorMessage } from '@/components/ui/error-message'
import { useProposals } from '@/lib/hooks/use-proposals'
import { useTonAuth } from '@/lib/hooks/use-ton-auth'
import { Proposal, Comment } from '@/lib/types/api'
import { formatDate, getTimeLeft, getVotePercentage, getStatusColor, truncateAddress } from '@/lib/utils'

export function ProposalDetail() {
  const { id } = useParams<{ id: string }>()
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [comment, setComment] = useState('')
  const { getProposal, vote, getComments, addComment, isLoading, error } = useProposals()
  const { isConnected, address } = useTonAuth()

  useEffect(() => {
    const fetchProposal = async () => {
      if (!id) return
      try {
        const proposalData = await getProposal(id)
        setProposal(proposalData)
      } catch (error) {
        console.error('Error fetching proposal:', error)
      }
    }

    const fetchComments = async () => {
      if (!id) return
      try {
        const commentsData = await getComments(id)
        setComments(commentsData)
      } catch (error) {
        console.error('Error fetching comments:', error)
      }
    }

    fetchProposal()
    fetchComments()
  }, [id, getProposal, getComments])

  const handleVote = async (voteType: 'for' | 'against') => {
    if (!id || !proposal) return
    try {
      await vote({ proposalId: id, vote: voteType })
      const updatedProposal = await getProposal(id)
      setProposal(updatedProposal)
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  const handleComment = async () => {
    if (!id || !comment.trim()) return
    try {
      await addComment({ proposalId: id, content: comment })
      const updatedComments = await getComments(id)
      setComments(updatedComments)
      setComment('')
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  if (error) {
    return <ErrorMessage error={error} />
  }

  if (isLoading || !proposal) {
    return <div>Loading proposal...</div>
  }

  const isActive = proposal.status === 'active'
  const hasVoted = proposal.votes?.some((v) => v.author === address)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{proposal.title}</CardTitle>
            <span
              className={`${getStatusColor(proposal.status)} px-2 py-1 rounded-full text-white text-sm`}
            >
              {proposal.status}
            </span>
          </div>
          <CardDescription>
            Created by {truncateAddress(proposal.author)} on {formatDate(proposal.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {proposal.description}
            </p>
            <div className="flex justify-between text-sm">
              <span>Time left: {getTimeLeft(proposal.deadline)}</span>
              <span>
                Votes: {getVotePercentage(proposal.votesFor, proposal.votesAgainst)}% in favor
              </span>
            </div>
            {isConnected && isActive && !hasVoted && (
              <div className="flex gap-4">
                <Button onClick={() => handleVote('for')} variant="default">
                  Vote For
                </Button>
                <Button onClick={() => handleVote('against')} variant="outline">
                  Vote Against
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isConnected && (
              <div className="space-y-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button onClick={handleComment} disabled={!comment.trim()}>
                  Post Comment
                </Button>
              </div>
            )}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">
                      {truncateAddress(comment.author)}
                    </span>
                    <span className="text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
