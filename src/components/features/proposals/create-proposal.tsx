import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ErrorMessage } from '@/components/ui/error-message'
import { useProposals } from '@/lib/hooks/use-proposals'
import { useTonAuth } from '@/lib/hooks/use-ton-auth'

export function CreateProposal() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const { createProposal, isLoading, error } = useProposals()
  const { isConnected } = useTonAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim() || !deadline) return

    try {
      await createProposal({
        title: title.trim(),
        description: description.trim(),
        deadline,
      })
      navigate('/proposals')
    } catch (error) {
      console.error('Error creating proposal:', error)
    }
  }

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="py-4">
          <p className="text-center text-muted-foreground">
            Please connect your wallet to create a proposal
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Proposal</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <ErrorMessage error={error} />}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <input
              id="title"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="deadline" className="text-sm font-medium">
              Deadline
            </label>
            <input
              id="deadline"
              type="datetime-local"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Proposal'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
