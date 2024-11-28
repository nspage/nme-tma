import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { useQuery } from "@/lib/hooks/use-query"
import { proposalService } from "@/lib/api"
import { Proposal } from "@/lib/types/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ProposalForm } from "@/components/forms/proposal-form"

export function ProposalsPage() {
  const navigate = useNavigate()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { data: proposals, isLoading, error, refetch } = useQuery(proposalService.getProposals)

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return <ErrorMessage error={error} />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Proposals</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Proposal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Proposal</DialogTitle>
            </DialogHeader>
            <ProposalForm
              onSuccess={() => {
                setIsCreateDialogOpen(false)
                refetch()
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {proposals?.items.map((proposal: Proposal) => (
          <div
            key={proposal.id}
            className="p-4 border rounded-lg hover:border-primary cursor-pointer"
            onClick={() => navigate(`/proposals/${proposal.id}`)}
          >
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-semibold">{proposal.title}</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {new Date(proposal.createdAt).toLocaleDateString()}
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
            <p className="text-muted-foreground mb-4">
              {proposal.description.length > 200
                ? `${proposal.description.slice(0, 200)}...`
                : proposal.description}
            </p>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>By: {proposal.author}</span>
              <div className="flex items-center gap-4">
                <span>👍 {proposal.votesFor}</span>
                <span>👎 {proposal.votesAgainst}</span>
                <span>💬 {proposal.comments.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
