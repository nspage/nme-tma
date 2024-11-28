import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'

interface VoteHistoryProps {
  votes: Array<{
    voter: string
    support: boolean
    timestamp: number
    power: number
  }>
}

export function VoteHistory({ votes }: VoteHistoryProps) {
  const sortedVotes = [...votes].sort((a, b) => b.timestamp - a.timestamp)

  if (votes.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          No votes yet
        </div>
      </Card>
    )
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {sortedVotes.map((vote, index) => (
          <Card key={`${vote.voter}-${vote.timestamp}`} className="p-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {vote.voter.slice(0, 2)}
                  </span>
                </div>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">
                    {vote.voter}
                  </span>
                  <span className="text-muted-foreground">
                    voted {vote.support ? 'For' : 'Against'}
                  </span>
                  {vote.support ? (
                    <ThumbsUp className="h-4 w-4 text-primary" />
                  ) : (
                    <ThumbsDown className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDistanceToNow(vote.timestamp, { addSuffix: true })}
                  {vote.power > 1 && ` · ${vote.power} voting power`}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}
