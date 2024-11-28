import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, MessageSquare, Clock } from "lucide-react"
import { Link } from "react-router-dom"
import { SearchBar } from "@/components/ui/search-bar"
import { FilterDropdown } from "@/components/ui/filter-dropdown"

interface Proposal {
  id: string
  title: string
  description: string
  status: "Open" | "Closed" | "Passed" | "Rejected"
  votes: {
    for: number
    against: number
  }
  comments: number
  deadline: string
  author: {
    name: string
    avatar: string
  }
}

const MOCK_PROPOSALS: Proposal[] = [
  {
    id: "1",
    title: "Implement Cross-Chain Bridge for TON",
    description: "Proposal to develop a secure bridge for cross-chain asset transfers between TON and other major blockchains.",
    status: "Open",
    votes: {
      for: 1500,
      against: 300
    },
    comments: 45,
    deadline: "2024-04-01",
    author: {
      name: "Alex Thompson",
      avatar: "https://picsum.photos/seed/user1/40/40"
    }
  },
  {
    id: "2",
    title: "Community Treasury Allocation",
    description: "Proposal to allocate community treasury funds for developer grants and ecosystem growth initiatives.",
    status: "Closed",
    votes: {
      for: 2200,
      against: 800
    },
    comments: 72,
    deadline: "2024-03-15",
    author: {
      name: "Sarah Chen",
      avatar: "https://picsum.photos/seed/user2/40/40"
    }
  }
]

export function ProposalsPage() {
  const [proposals] = useState<Proposal[]>(MOCK_PROPOSALS)

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Governance Proposals</h1>
        <Button asChild>
          <Link to="/proposals/create">Create Proposal</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-3 space-y-6">
          <div className="flex gap-4">
            <SearchBar className="flex-1" placeholder="Search proposals..." />
            <FilterDropdown
              options={[
                { label: "All", value: "all" },
                { label: "Open", value: "open" },
                { label: "Closed", value: "closed" },
                { label: "Passed", value: "passed" },
                { label: "Rejected", value: "rejected" },
              ]}
              defaultValue="all"
              onValueChange={() => {}}
            />
          </div>

          <div className="space-y-4">
            {proposals.map((proposal) => (
              <Link key={proposal.id} to={`/proposals/${proposal.id}`}>
                <div className="p-6 rounded-lg border hover:border-primary transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {proposal.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {proposal.description}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        proposal.status === "Open"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {proposal.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      {proposal.votes.for} votes for
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <ThumbsDown className="w-4 h-4 mr-2" />
                      {proposal.votes.against} votes against
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      {proposal.comments} comments
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Deadline: {new Date(proposal.deadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold mb-4">About Governance</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Participate in shaping the future of TON by voting on important
              proposals and contributing to discussions.
            </p>
            <ul className="text-sm space-y-2">
              <li>• Review proposals carefully</li>
              <li>• Engage in discussions</li>
              <li>• Vote responsibly</li>
              <li>• Submit thoughtful proposals</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
