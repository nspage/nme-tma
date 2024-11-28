import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const voteSchema = z.object({
  choice: z.enum(["for", "against", "abstain"]),
  votingPower: z.string(),
  reason: z.string().max(500).optional(),
})

interface ProposalVoteFormProps {
  proposalId: string
  title: string
  currentResults: {
    for: number
    against: number
    abstain: number
    total: number
    quorum: number
  }
  userVotingPower: string
  hasVoted: boolean
}

export function ProposalVoteForm({
  proposalId,
  title,
  currentResults,
  userVotingPower,
  hasVoted,
}: ProposalVoteFormProps) {
  const [isPending, setIsPending] = useState(false)

  const form = useForm<z.infer<typeof voteSchema>>({
    resolver: zodResolver(voteSchema),
    defaultValues: {
      votingPower: userVotingPower,
    },
  })

  async function onSubmit(values: z.infer<typeof voteSchema>) {
    setIsPending(true)
    
    try {
      // Implement voting logic here
      console.log("Submitting vote:", values)
      
      toast({
        title: "Vote Submitted",
        description: "Your vote has been successfully recorded.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit vote. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  const forPercentage = (currentResults.for / currentResults.total) * 100
  const againstPercentage = (currentResults.against / currentResults.total) * 100
  const abstainPercentage = (currentResults.abstain / currentResults.total) * 100
  const quorumPercentage = (currentResults.total / currentResults.quorum) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cast Your Vote</CardTitle>
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Current Results</span>
              <span>Quorum: {quorumPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={quorumPercentage} className="h-2" />
            
            <div className="grid gap-2 pt-2">
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Progress
                  value={forPercentage}
                  className={cn(
                    "h-2",
                    forPercentage > againstPercentage
                      ? "bg-green-100"
                      : "bg-muted"
                  )}
                />
                <div className="min-w-[3rem] text-sm text-right">
                  For: {forPercentage.toFixed(1)}%
                </div>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Progress
                  value={againstPercentage}
                  className={cn(
                    "h-2",
                    againstPercentage > forPercentage
                      ? "bg-red-100"
                      : "bg-muted"
                  )}
                />
                <div className="min-w-[3rem] text-sm text-right">
                  Against: {againstPercentage.toFixed(1)}%
                </div>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Progress
                  value={abstainPercentage}
                  className="h-2 bg-muted"
                />
                <div className="min-w-[3rem] text-sm text-right">
                  Abstain: {abstainPercentage.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {!hasVoted ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="choice"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Your Vote</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-3 gap-4"
                        >
                          <FormItem>
                            <FormControl>
                              <div>
                                <RadioGroupItem
                                  value="for"
                                  id="for"
                                  className="peer sr-only"
                                />
                                <label
                                  htmlFor="for"
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                  <span className="text-sm font-medium">For</span>
                                </label>
                              </div>
                            </FormControl>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <div>
                                <RadioGroupItem
                                  value="against"
                                  id="against"
                                  className="peer sr-only"
                                />
                                <label
                                  htmlFor="against"
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                  <span className="text-sm font-medium">
                                    Against
                                  </span>
                                </label>
                              </div>
                            </FormControl>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <div>
                                <RadioGroupItem
                                  value="abstain"
                                  id="abstain"
                                  className="peer sr-only"
                                />
                                <label
                                  htmlFor="abstain"
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                  <span className="text-sm font-medium">
                                    Abstain
                                  </span>
                                </label>
                              </div>
                            </FormControl>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="votingPower"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Voting Power</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          max={userVotingPower}
                        />
                      </FormControl>
                      <FormDescription>
                        Available voting power: {userVotingPower} TON
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share your reasoning"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Explain your vote to the community.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit Vote
                </Button>
              </form>
            </Form>
          ) : (
            <div className="rounded-lg border bg-muted p-4 text-center">
              <p className="text-sm text-muted-foreground">
                You have already voted on this proposal.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
