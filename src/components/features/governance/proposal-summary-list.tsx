import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Placeholder data - replace with actual data from API
const proposals = [
  {
    id: "1",
    title: "Implement Community Treasury",
    description: "Create a community-controlled treasury for funding development initiatives.",
    status: "active",
    votes: { yes: 120, no: 30, abstain: 10 },
    endDate: "2024-02-28",
  },
  {
    id: "2",
    title: "Protocol Upgrade Proposal",
    description: "Upgrade the governance protocol to support quadratic voting.",
    status: "pending",
    votes: { yes: 0, no: 0, abstain: 0 },
    endDate: "2024-03-15",
  },
]

const statusColors = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  passed: "bg-blue-100 text-blue-800",
  failed: "bg-red-100 text-red-800",
}

export function ProposalSummaryList() {
  return (
    <div className="space-y-4">
      {proposals.map((proposal) => (
        <Card key={proposal.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-xl">{proposal.title}</CardTitle>
              <Badge className={statusColors[proposal.status as keyof typeof statusColors]}>
                {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{proposal.description}</p>
            {proposal.status === "active" && (
              <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="font-medium">{proposal.votes.yes}</div>
                  <div className="text-muted-foreground">Yes</div>
                </div>
                <div>
                  <div className="font-medium">{proposal.votes.no}</div>
                  <div className="text-muted-foreground">No</div>
                </div>
                <div>
                  <div className="font-medium">{proposal.votes.abstain}</div>
                  <div className="text-muted-foreground">Abstain</div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Ends on {new Date(proposal.endDate).toLocaleDateString()}
            </div>
            <Button variant="outline" asChild>
              <Link to={`/proposals/${proposal.id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
