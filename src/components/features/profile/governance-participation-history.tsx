import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/lib/hooks/use-wallet"
import { useQuery } from "@/lib/hooks/use-query"
import { memberService } from "@/lib/api"
import { Proposal } from "@/lib/types/api"
import { Link } from "react-router-dom"
import { formatDate } from "@/lib/utils"

export function GovernanceParticipationHistory() {
  const { address } = useWallet()
  const { data: proposals } = useQuery(() =>
    memberService.getGovernanceHistory(address!)
  )

  if (!proposals?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Governance History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No governance participation yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Governance History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {proposals.map((proposal: Proposal) => (
            <Link
              key={proposal.id}
              to={`/proposals/${proposal.id}`}
              className="block p-4 border rounded-lg hover:bg-accent"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{proposal.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(proposal.createdAt)}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
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
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {proposal.description.length > 100
                    ? `${proposal.description.slice(0, 100)}...`
                    : proposal.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>👍 {proposal.votesFor}</span>
                  <span>👎 {proposal.votesAgainst}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
