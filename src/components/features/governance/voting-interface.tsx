import React from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface VotingInterfaceProps {
  proposalId: string
  votesFor: number
  votesAgainst: number
  quorum: number
  userVotingPower: number
  hasVoted: boolean
  isActive: boolean
  onVote: (proposalId: string, vote: boolean) => Promise<void>
  isLoading?: boolean
}

export function VotingInterface({
  proposalId,
  votesFor,
  votesAgainst,
  quorum,
  userVotingPower,
  hasVoted,
  isActive,
  onVote,
  isLoading = false,
}: VotingInterfaceProps) {
  const totalVotes = votesFor + votesAgainst
  const forPercentage = totalVotes > 0 ? (votesFor / totalVotes) * 100 : 0
  const againstPercentage = totalVotes > 0 ? (votesAgainst / totalVotes) * 100 : 0
  const quorumPercentage = totalVotes > 0 ? (totalVotes / quorum) * 100 : 0

  const handleVote = async (vote: boolean) => {
    try {
      await onVote(proposalId, vote)
    } catch (error) {
      console.error("Failed to cast vote:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Cast Your Vote</h3>
        {userVotingPower > 0 && (
          <p className="text-sm text-muted-foreground">
            Your voting power: {userVotingPower}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <TooltipProvider>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>For ({votesFor} votes)</span>
                <span>{forPercentage.toFixed(1)}%</span>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Progress value={forPercentage} className="h-2 bg-green-200">
                    <div className="h-full bg-green-500" style={{ width: `${forPercentage}%` }} />
                  </Progress>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Votes For: {forPercentage.toFixed(1)}%</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Against ({votesAgainst} votes)</span>
                <span>{againstPercentage.toFixed(1)}%</span>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Progress value={againstPercentage} className="h-2 bg-red-200">
                    <div className="h-full bg-red-500" style={{ width: `${againstPercentage}%` }} />
                  </Progress>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Votes Against: {againstPercentage.toFixed(1)}%</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Quorum Progress</span>
                <span>{quorumPercentage.toFixed(1)}%</span>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Progress value={quorumPercentage} className="h-2" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Quorum Progress: {quorumPercentage.toFixed(1)}%</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>

        {isActive && !hasVoted && userVotingPower > 0 && (
          <div className="flex gap-4">
            <Button
              className="flex-1 bg-green-500 hover:bg-green-600"
              onClick={() => handleVote(true)}
              disabled={isLoading}
            >
              Vote For
            </Button>
            <Button
              className="flex-1 bg-red-500 hover:bg-red-600"
              onClick={() => handleVote(false)}
              disabled={isLoading}
            >
              Vote Against
            </Button>
          </div>
        )}

        {hasVoted && (
          <p className="text-sm text-center text-muted-foreground">
            You have already cast your vote on this proposal
          </p>
        )}

        {!isActive && (
          <p className="text-sm text-center text-muted-foreground">
            This proposal is no longer active
          </p>
        )}

        {userVotingPower === 0 && (
          <p className="text-sm text-center text-muted-foreground">
            You need voting power to participate in this proposal
          </p>
        )}
      </CardContent>
    </Card>
  )
}
