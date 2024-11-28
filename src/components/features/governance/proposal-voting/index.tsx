import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useProposal } from "@/lib/hooks/use-proposal"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { Loader2, ThumbsDown, ThumbsUp } from "lucide-react"
import { toast } from "sonner"

interface ProposalVotingProps {
  contractAddress: string
}

export function ProposalVoting({ contractAddress }: ProposalVotingProps) {
  const {
    votesFor,
    votesAgainst,
    quorum,
    status,
    deadline,
    isLoading,
    error,
    vote,
  } = useProposal(contractAddress)

  const [votingAmount, setVotingAmount] = useState("1")
  const [isVoting, setIsVoting] = useState(false)

  const totalVotes = parseFloat(votesFor) + parseFloat(votesAgainst)
  const votesForPercentage = totalVotes > 0 
    ? (parseFloat(votesFor) / totalVotes) * 100 
    : 0
  const quorumPercentage = totalVotes > 0 
    ? (totalVotes / parseFloat(quorum)) * 100 
    : 0

  const handleVote = async (support: boolean) => {
    try {
      setIsVoting(true)
      await vote(support, votingAmount)
      toast.success("Vote submitted successfully!")
    } catch (error) {
      toast.error("Failed to vote: " + (error instanceof Error ? error.message : "Unknown error"))
    } finally {
      setIsVoting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Failed to load proposal: {error.message}
      </div>
    )
  }

  const isExpired = new Date(deadline) < new Date()

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>For</span>
            <span>{votesForPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={votesForPercentage} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Against</span>
            <span>{(100 - votesForPercentage).toFixed(1)}%</span>
          </div>
          <Progress value={100 - votesForPercentage} className="bg-red-200" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Quorum Progress</span>
            <span>{quorumPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={quorumPercentage} className="bg-blue-200" />
        </div>
      </div>

      {!isExpired && (
        <Card className="p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Voting Amount (TON)</Label>
              <Input
                id="amount"
                type="number"
                step="0.1"
                min="0.1"
                value={votingAmount}
                onChange={(e) => setVotingAmount(e.target.value)}
                placeholder="Enter amount of TON"
              />
            </div>

            <div className="flex gap-4">
              <Button
                className="flex-1"
                onClick={() => handleVote(true)}
                disabled={isVoting}
              >
                {isVoting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <ThumbsUp className="mr-2 h-4 w-4" />
                For
              </Button>
              <Button
                className="flex-1"
                onClick={() => handleVote(false)}
                variant="destructive"
                disabled={isVoting}
              >
                {isVoting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <ThumbsDown className="mr-2 h-4 w-4" />
                Against
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="text-sm text-muted-foreground">
        {isExpired ? (
          <p>Voting has ended</p>
        ) : (
          <p>
            Voting ends on{" "}
            {new Date(deadline).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  )
}
