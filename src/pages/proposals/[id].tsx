import { useState } from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { useQuery } from "@/lib/hooks/use-query"
import { useMutation } from "@/lib/hooks/use-mutation"
import { proposalService } from "@/lib/api"
import { useWallet } from "@/lib/hooks/use-wallet"
import { Comment } from "@/lib/types/api"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export function ProposalPage() {
  const { id } = useParams<{ id: string }>()
  const { address } = useWallet()
  const { toast } = useToast()
  const [comment, setComment] = useState("")

  const { data: proposal, isLoading, error, refetch } = useQuery(() =>
    proposalService.getProposal(id!)
  )

  const { mutate: vote, isLoading: isVoting } = useMutation(
    (support: boolean) => proposalService.vote(id!, support),
    {
      onSuccess: () => {
        refetch()
        toast({
          title: "Vote recorded",
          description: "Your vote has been successfully recorded.",
        })
      },
    }
  )

  const { mutate: submitComment, isLoading: isSubmittingComment } = useMutation(
    () => proposalService.addComment(id!, comment),
    {
      onSuccess: () => {
        refetch()
        setComment("")
        toast({
          title: "Comment added",
          description: "Your comment has been successfully added.",
        })
      },
    }
  )

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !proposal) {
    return <ErrorMessage error={error} />
  }

  const hasVoted = proposal.votes.some((vote) => vote.voter === address)

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold">{proposal.title}</h1>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              proposal.status === "active"
                ? "bg-green-100 text-green-800"
                : proposal.status === "passed"
                ? "bg-blue-100 text-blue-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {proposal.status}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>By: {proposal.author}</span>
          <span>•</span>
          <span>{new Date(proposal.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="text-lg">{proposal.description}</p>
      </div>

      {proposal.status === "active" && !hasVoted && (
        <div className="flex gap-4">
          <Button
            onClick={() => vote(true)}
            disabled={isVoting}
            className="flex-1"
          >
            👍 Vote For
          </Button>
          <Button
            onClick={() => vote(false)}
            disabled={isVoting}
            variant="outline"
            className="flex-1"
          >
            👎 Vote Against
          </Button>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Comments</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              onClick={() => submitComment()}
              disabled={isSubmittingComment || !comment.trim()}
            >
              Submit Comment
            </Button>
          </div>
          <div className="space-y-4">
            {proposal.comments.map((comment: Comment) => (
              <div key={comment.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{comment.author}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p>{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
