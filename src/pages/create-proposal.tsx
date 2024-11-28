import { ProposalCreationForm } from "@/components/features/governance/proposal-creation-form"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export function CreateProposalPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link to="/proposals">← Back to Proposals</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="border rounded-lg p-6 bg-card">
            <h1 className="text-2xl font-bold mb-6">Create Proposal</h1>
            <ProposalCreationForm />
          </div>
        </div>

        <div className="space-y-6">
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-lg font-semibold mb-4">Guidelines</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Before creating a proposal, make sure it meets the following criteria:
              </p>
              <ul className="list-disc pl-4 space-y-2">
                <li>Clear and specific objective</li>
                <li>Detailed implementation plan</li>
                <li>Resource requirements</li>
                <li>Timeline for execution</li>
                <li>Success metrics</li>
              </ul>
              <p>
                Your proposal will be reviewed by the community and requires a
                minimum quorum to pass.
              </p>
            </div>
          </div>

          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-lg font-semibold mb-4">Requirements</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span>Minimum TON Balance</span>
                <span className="font-medium">100 TON</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Voting Period</span>
                <span className="font-medium">7 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Minimum Quorum</span>
                <span className="font-medium">25%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateProposalPage
