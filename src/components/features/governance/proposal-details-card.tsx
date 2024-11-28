import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ProposalDetailsCardProps {
  id: string
}

// Placeholder data - replace with actual data from API/blockchain
const proposal = {
  id: "1",
  title: "Implement Community Treasury",
  description: "Create a community-controlled treasury for funding development initiatives and supporting ecosystem growth. This proposal outlines the structure, governance, and initial funding mechanisms.",
  status: "active",
  creator: "0x1234...5678",
  createdAt: "2024-02-01",
  endDate: "2024-02-28",
  votes: {
    yes: 120,
    no: 30,
    abstain: 10,
  },
  quorum: 200,
  details: `
    ## Background
    The community needs a sustainable funding mechanism for long-term development.

    ## Proposal
    1. Create a multi-sig treasury wallet
    2. Implement proposal-based funding requests
    3. Set up regular community funding rounds

    ## Implementation
    - Treasury contract deployment
    - Governance integration
    - Documentation and guidelines

    ## Timeline
    - Month 1: Contract development and audit
    - Month 2: Community review and testing
    - Month 3: Mainnet deployment
  `,
}

const statusColors = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  passed: "bg-blue-100 text-blue-800",
  failed: "bg-red-100 text-red-800",
}

export function ProposalDetailsCard({ id }: ProposalDetailsCardProps) {
  const totalVotes = proposal.votes.yes + proposal.votes.no + proposal.votes.abstain
  const yesPercentage = (proposal.votes.yes / totalVotes) * 100
  const noPercentage = (proposal.votes.no / totalVotes) * 100
  const quorumPercentage = (totalVotes / proposal.quorum) * 100

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <CardTitle className="text-2xl">{proposal.title}</CardTitle>
          <Badge className={statusColors[proposal.status as keyof typeof statusColors]}>
            {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
          </Badge>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div>Created by: {proposal.creator}</div>
          <div>•</div>
          <div>Created: {new Date(proposal.createdAt).toLocaleDateString()}</div>
          <div>•</div>
          <div>Ends: {new Date(proposal.endDate).toLocaleDateString()}</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Description</h3>
          <p className="text-muted-foreground">{proposal.description}</p>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Voting Progress</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Yes ({proposal.votes.yes} votes)</span>
              <span>{yesPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={yesPercentage} className="bg-red-100" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>No ({proposal.votes.no} votes)</span>
              <span>{noPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={noPercentage} className="bg-red-100" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Quorum Progress ({totalVotes} / {proposal.quorum})</span>
              <span>{quorumPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={quorumPercentage} />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Proposal Details</h3>
          <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: proposal.details }} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
