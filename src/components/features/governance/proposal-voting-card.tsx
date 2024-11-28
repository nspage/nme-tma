import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ProposalVotingCardProps {
  id: string
  onVote?: (vote: "yes" | "no" | "abstain", comment?: string) => void
}

export function ProposalVotingCard({ id, onVote }: ProposalVotingCardProps) {
  const [vote, setVote] = useState<"yes" | "no" | "abstain">()
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!vote) return

    setIsSubmitting(true)
    try {
      await onVote?.(vote, comment)
      // Reset form after successful submission
      setVote(undefined)
      setComment("")
    } catch (error) {
      console.error("Failed to submit vote:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cast Your Vote</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <RadioGroup value={vote} onValueChange={(value) => setVote(value as typeof vote)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes" />
              <Label htmlFor="yes">Yes, I support this proposal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no" />
              <Label htmlFor="no">No, I oppose this proposal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="abstain" id="abstain" />
              <Label htmlFor="abstain">Abstain from voting</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="comment">Comment (optional)</Label>
          <Textarea
            id="comment"
            placeholder="Share your thoughts on this proposal..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={!vote || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Submitting..." : "Submit Vote"}
        </Button>
      </CardFooter>
    </Card>
  )
}
