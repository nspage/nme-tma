import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { useMutation } from "@/lib/hooks/use-mutation"
import { proposalService } from "@/lib/api"
import { CreateProposalInput } from "@/lib/types/api"

const proposalFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  deadline: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Deadline must be in the future",
  }),
})

type ProposalFormData = z.infer<typeof proposalFormSchema>

interface ProposalFormProps {
  onSuccess?: () => void
}

export function ProposalForm({ onSuccess }: ProposalFormProps) {
  const form = useForm<ProposalFormData>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: {
      title: "",
      description: "",
      deadline: "",
    },
  })

  const { mutate, isLoading, error } = useMutation<CreateProposalInput, any>(
    proposalService.createProposal,
    {
      onSuccess: () => {
        form.reset()
        onSuccess?.()
      },
    }
  )

  const onSubmit = async (data: ProposalFormData) => {
    await mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ErrorMessage error={error} />
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter proposal title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter proposal description"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deadline</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? <LoadingSpinner size="sm" /> : "Create Proposal"}
        </Button>
      </form>
    </Form>
  )
}
