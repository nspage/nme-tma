import React from "react"
import { useParams } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatDistanceToNow, format } from "date-fns"
import { ProposalVoteForm } from "./proposal-vote-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ProposalDetailProps {
  proposal: {
    id: string
    title: string
    description: string
    status: "active" | "passed" | "failed" | "pending"
    votesFor: number
    votesAgainst: number
    votesAbstain: number
    quorum: number
    createdAt: Date
    endTime: Date
    category: string
    tags: string[]
    creator: string
    executionStrategy: string
    executionPayload: string
  }
  userVotingPower: string
  hasVoted: boolean
}

export function ProposalDetail({ proposal, userVotingPower, hasVoted }: ProposalDetailProps) {
  const { id } = useParams()

  const statusColors = {
    active: "bg-blue-500",
    passed: "bg-green-500",
    failed: "bg-red-500",
    pending: "bg-yellow-500",
  }

  const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Badge variant="secondary" className={statusColors[proposal.status]}>
              {proposal.status.toUpperCase()}
            </Badge>
            <h1 className="text-3xl font-bold">{proposal.title}</h1>
          </div>
          <div className="text-sm text-muted-foreground text-right space-y-1">
            <p>Created by {proposal.creator}</p>
            <p>{format(proposal.createdAt, "PPP")}</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline">{proposal.category}</Badge>
          {proposal.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vote">Vote</TabsTrigger>
          <TabsTrigger value="execution">Execution</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {proposal.description}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Created</span>
                <span>{formatDistanceToNow(proposal.createdAt)} ago</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span>Ends</span>
                <span>{formatDistanceToNow(proposal.endTime)} from now</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vote">
          <ProposalVoteForm
            proposalId={proposal.id}
            title={proposal.title}
            currentResults={{
              for: proposal.votesFor,
              against: proposal.votesAgainst,
              abstain: proposal.votesAbstain,
              total: totalVotes,
              quorum: proposal.quorum,
            }}
            userVotingPower={userVotingPower}
            hasVoted={hasVoted}
          />
        </TabsContent>

        <TabsContent value="execution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Execution Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{proposal.executionStrategy}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Execution Payload</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                <pre className="text-sm">
                  <code>{proposal.executionPayload}</code>
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
