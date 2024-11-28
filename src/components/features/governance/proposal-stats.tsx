import React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatDistanceToNow } from "date-fns"

interface ProposalStatsProps {
  votesFor: number
  votesAgainst: number
  quorum: number
  startTime: Date
  endTime: Date
  totalVoters: number
  uniqueVoters: number
}

export function ProposalStats({
  votesFor,
  votesAgainst,
  quorum,
  startTime,
  endTime,
  totalVoters,
  uniqueVoters,
}: ProposalStatsProps) {
  const totalVotes = votesFor + votesAgainst
  const forPercentage = totalVotes > 0 ? (votesFor / totalVotes) * 100 : 0
  const quorumPercentage = totalVotes > 0 ? (totalVotes / quorum) * 100 : 0
  const participationRate = totalVoters > 0 ? (uniqueVoters / totalVoters) * 100 : 0

  const timeLeft = new Date() < endTime ? formatDistanceToNow(endTime) : "Ended"
  const duration = formatDistanceToNow(startTime)

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Proposal Statistics</h3>
      </CardHeader>
      <CardContent className="space-y-6">
        <TooltipProvider>
          {/* Time Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Time Left</p>
              <p className="text-lg font-medium">{timeLeft}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="text-lg font-medium">{duration}</p>
            </div>
          </div>

          {/* Vote Distribution */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Vote Distribution</p>
            <div className="h-4 rounded-full overflow-hidden bg-muted">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="h-full flex">
                    <div
                      className="bg-green-500 transition-all"
                      style={{ width: `${forPercentage}%` }}
                    />
                    <div
                      className="bg-red-500 transition-all"
                      style={{ width: `${100 - forPercentage}%` }}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>For: {forPercentage.toFixed(1)}%</p>
                  <p>Against: {(100 - forPercentage).toFixed(1)}%</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Quorum Progress */}
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
                <p>
                  {totalVotes} out of {quorum} votes needed
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Participation Stats */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Participation Rate</span>
              <span>{participationRate.toFixed(1)}%</span>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Progress value={participationRate} className="h-2" />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {uniqueVoters} out of {totalVoters} eligible voters
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Vote Counts */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-green-500">{votesFor}</p>
              <p className="text-sm text-muted-foreground">Votes For</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-red-500">{votesAgainst}</p>
              <p className="text-sm text-muted-foreground">Votes Against</p>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
