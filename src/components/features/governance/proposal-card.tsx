import React from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"

export interface ProposalCardProps {
  id: string
  title: string
  description: string
  status: "active" | "passed" | "failed" | "pending"
  votesFor: number
  votesAgainst: number
  quorum: number
  createdAt: Date
  endTime: Date
  category: string
  tags: string[]
  onClick?: () => void
}

export function ProposalCard({
  id,
  title,
  description,
  status,
  votesFor,
  votesAgainst,
  quorum,
  createdAt,
  endTime,
  category,
  tags,
  onClick,
}: ProposalCardProps) {
  const navigate = useNavigate()
  const totalVotes = votesFor + votesAgainst
  const forPercentage = totalVotes > 0 ? (votesFor / totalVotes) * 100 : 0
  const quorumPercentage = totalVotes > 0 ? (totalVotes / quorum) * 100 : 0

  const statusColors = {
    active: "bg-blue-500",
    passed: "bg-green-500",
    failed: "bg-red-500",
    pending: "bg-yellow-500",
  }

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      navigate(`/proposals/${id}`)
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleClick}>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className={statusColors[status]}>
            {status.toUpperCase()}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Created {formatDistanceToNow(createdAt)} ago
          </span>
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline">{category}</Badge>
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <TooltipProvider>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Votes For: {votesFor}</span>
              <span>{forPercentage.toFixed(1)}%</span>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Progress value={forPercentage} className="h-2" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Votes For: {forPercentage.toFixed(1)}%</p>
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
      </CardContent>

      <CardFooter className="flex justify-between">
        <span className="text-sm text-muted-foreground">
          Ends {formatDistanceToNow(endTime)} from now
        </span>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}
