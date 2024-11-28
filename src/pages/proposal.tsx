import { useParams } from "react-router-dom"
import { ProposalDetailsCard } from "@/components/features/governance/proposal-details-card"
import { VoteButton } from "@/components/features/governance/vote-button"
import { DiscussionThread } from "@/components/features/governance/discussion-thread"
import { VotingResultsGraph } from "@/components/features/governance/voting-results-graph"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export function ProposalPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link to="/proposals">← Back to Proposals</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <ProposalDetailsCard id={id!} />
          <VoteButton proposalId={id!} />
          <VotingResultsGraph proposalId={id!} />
        </div>

        <div className="space-y-6">
          <div className="sticky top-6">
            <DiscussionThread proposalId={id!} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProposalPage
