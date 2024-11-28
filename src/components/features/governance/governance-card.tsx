import { Button } from '@/components/ui/button'
import { useTonAuth } from '@/hooks/use-ton-auth'
import { useGovernance } from '@/hooks/use-governance'
import WebApp from '@twa-dev/sdk'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { useNavigate } from 'react-router-dom'
import { ProposalFilters } from './proposal-filters'

export function GovernanceCard() {
  const { wallet } = useTonAuth()
  const { proposals, loading, vote, createProposal, userVotes, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, selectedTags, setSelectedTags, allTags } = useGovernance()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    category: '',
    quorum: 1000,
    tags: [],
    duration: 7 * 24 * 60 * 60, // 7 days in seconds
  })
  const navigate = useNavigate()

  const handleCreateProposal = async () => {
    await createProposal(newProposal)
    setIsCreateDialogOpen(false)
    setNewProposal({
      title: '',
      description: '',
      category: '',
      quorum: 1000,
      tags: [],
      duration: 7 * 24 * 60 * 60,
    })
  }

  if (!wallet) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Please connect your wallet to access governance features
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Governance</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Create Proposal</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Proposal</DialogTitle>
              <DialogDescription>
                Create a new governance proposal for the community to vote on.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newProposal.title}
                  onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProposal.description}
                  onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newProposal.category}
                    onValueChange={(value) => setNewProposal({ ...newProposal, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="treasury">Treasury</SelectItem>
                      <SelectItem value="governance">Governance</SelectItem>
                      <SelectItem value="membership">Membership</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quorum">Quorum</Label>
                  <Input
                    id="quorum"
                    type="number"
                    min="1"
                    value={newProposal.quorum}
                    onChange={(e) => setNewProposal({ ...newProposal, quorum: parseInt(e.target.value) || 1000 })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={newProposal.tags.join(', ')}
                  onChange={(e) => setNewProposal({
                    ...newProposal,
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  })}
                  placeholder="e.g. finance, community, rewards"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={newProposal.duration / (24 * 60 * 60)}
                  onChange={(e) => setNewProposal({
                    ...newProposal,
                    duration: (parseInt(e.target.value) || 7) * 24 * 60 * 60
                  })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateProposal}
                disabled={!newProposal.title || !newProposal.description || !newProposal.category}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <ProposalFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        allTags={allTags}
      />

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="p-4 border rounded-lg bg-card space-y-4"
            >
              <div className="space-y-2">
                <h3 className="text-lg font-medium">
                  <Button
                    variant="link"
                    className="p-0 h-auto font-medium"
                    onClick={() => navigate(`/governance/${proposal.id}`)}
                  >
                    {proposal.title}
                  </Button>
                </h3>
                <p className="text-muted-foreground line-clamp-2">{proposal.description}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div>
                    Created {formatDistanceToNow(proposal.startTime, { addSuffix: true })}
                  </div>
                  <div>
                    Ends {formatDistanceToNow(proposal.endTime, { addSuffix: true })}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>For ({proposal.votesFor})</span>
                    <span>{((proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100 || 0).toFixed(1)}%</span>
                  </div>
                  <Progress value={proposal.votesFor / (proposal.votesFor + proposal.votesAgainst) * 100 || 0} />
                </div>

                {proposal.votes.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Recent votes:
                    <div className="flex items-center space-x-2 mt-1">
                      {proposal.votes.slice(-3).map((vote, i) => (
                        <div
                          key={`${vote.voter}-${vote.timestamp}`}
                          className="flex items-center space-x-1"
                        >
                          <div className={vote.support ? 'text-green-500' : 'text-red-500'}>
                            {vote.support ? (
                              <ThumbsUp className="h-3 w-3" />
                            ) : (
                              <ThumbsDown className="h-3 w-3" />
                            )}
                          </div>
                          <span>{vote.voter.slice(0, 4)}...{vote.voter.slice(-2)}</span>
                          {i < proposal.votes.slice(-3).length - 1 && <span>•</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Quorum: {((proposal.votesFor + proposal.votesAgainst) / proposal.quorum * 100).toFixed(1)}%
                </div>
                <div className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => vote(proposal.id, true)}
                    disabled={userVotes[proposal.id] !== undefined}
                  >
                    {userVotes[proposal.id] === true ? 'Voted For' : 'Vote For'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => vote(proposal.id, false)}
                    disabled={userVotes[proposal.id] !== undefined}
                  >
                    {userVotes[proposal.id] === false ? 'Voted Against' : 'Vote Against'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
