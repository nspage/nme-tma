import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useCreateProposal } from "@/lib/hooks/use-create-proposal"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { CalendarInput } from "@/components/ui/calendar-input"

const proposalFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Category is required"),
  tags: z.string().transform((str) => str.split(",").map((s) => s.trim())),
  minVotingPower: z.string().min(1, "Minimum voting power is required"),
  quorum: z.string().min(1, "Quorum is required"),
  deadline: z.date().min(new Date(), "Deadline must be in the future"),
})

type ProposalFormData = z.infer<typeof proposalFormSchema>

interface ProposalFormProps {
  onSuccess?: (result: { proposalId: string; contractAddress: string }) => void
  initialData?: Partial<ProposalFormData>
}

export function ProposalForm({
  onSuccess,
  initialData,
}: ProposalFormProps) {
  const { createProposal } = useCreateProposal()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: {
      ...initialData,
      minVotingPower: "1",
      quorum: "100",
    },
  })

  const onSubmit = async (data: ProposalFormData) => {
    try {
      const result = await createProposal({
        title: data.title,
        description: data.description,
        deadline: data.deadline,
        minVotingPower: data.minVotingPower,
        quorum: data.quorum,
      })
      
      toast.success("Proposal created successfully!")
      onSuccess?.(result)
    } catch (error) {
      toast.error("Failed to create proposal: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter proposal title"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter proposal description"
          className="min-h-[100px]"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            placeholder="e.g., Finance, Development"
            {...register("category")}
          />
          {errors.category && (
            <p className="text-sm text-red-500">{errors.category.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            placeholder="Enter tags, separated by commas"
            {...register("tags")}
          />
          {errors.tags && (
            <p className="text-sm text-red-500">{errors.tags.message}</p>
          )}
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minVotingPower">Min. Voting Power (TON)</Label>
          <Input
            id="minVotingPower"
            type="number"
            step="0.1"
            min="0.1"
            placeholder="1"
            {...register("minVotingPower")}
          />
          {errors.minVotingPower && (
            <p className="text-sm text-red-500">{errors.minVotingPower.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="quorum">Quorum (TON)</Label>
          <Input
            id="quorum"
            type="number"
            step="1"
            min="1"
            placeholder="100"
            {...register("quorum")}
          />
          {errors.quorum && (
            <p className="text-sm text-red-500">{errors.quorum.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="deadline">Deadline</Label>
          <CalendarInput
            id="deadline"
            name="deadline"
            control={control}
            error={errors.deadline}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Proposal
        </Button>
      </div>
    </form>
  )
}
