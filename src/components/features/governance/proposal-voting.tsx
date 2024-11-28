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
      <div className="text-center text-red-500 p-4">
        Error loading proposal: {error.message}
      </div>
    )
  }

  const isActive = status === "active"
  const timeLeft = Math.max(0, new Date(deadline).getTime() - Date.now())
  const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Voting</h3>
          <div className="text-sm text-muted-foreground">
            {isActive ? (
              <>
                {daysLeft}d {hoursLeft}h left
              </>
            ) : (
              <span className="capitalize">{status}</span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>For ({votesFor} TON)</span>
              <span>Against ({votesAgainst} TON)</span>
            </div>
            <Progress value={votesForPercentage} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Quorum Progress</span>
              <span>{Math.round(quorumPercentage)}%</span>
            </div>
            <Progress value={quorumPercentage} className="h-2" />
          </div>
        </div>
      </div>

      {isActive && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="votingAmount">Voting Amount (TON)</Label>
            <Input
              id="votingAmount"
              type="number"
              min="0.1"
              step="0.1"
              value={votingAmount}
              onChange={(e) => setVotingAmount(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => handleVote(true)}
              disabled={isVoting || !isActive}
              className="space-x-2"
            >
              {isVoting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ThumbsUp className="h-4 w-4" />
              )}
              <span>For</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleVote(false)}
              disabled={isVoting || !isActive}
              className="space-x-2"
            >
              {isVoting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ThumbsDown className="h-4 w-4" />
              )}
              <span>Against</span>
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
