import React from "react"
import { ProposalCard, ProposalCardProps } from "./proposal-card"

interface ProposalListProps {
  proposals: Omit<ProposalCardProps, "onClick">[]
  onProposalClick?: (id: string) => void
}

export function ProposalList({ proposals, onProposalClick }: ProposalListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {proposals.map((proposal) => (
        <ProposalCard
          key={proposal.id}
          {...proposal}
          onClick={() => onProposalClick?.(proposal.id)}
        />
      ))}
    </div>
  )
}
