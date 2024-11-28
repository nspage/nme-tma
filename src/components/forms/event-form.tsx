import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMutation } from "@/lib/hooks/use-mutation"
import { eventService } from "@/lib/api"
import { CreateEventInput } from "@/lib/types/api"

const eventFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  date: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Event date must be in the future",
  }),
  location: z.string().min(5, "Location must be at least 5 characters"),
  maxAttendees: z.string()
    .transform(Number)
    .refine((n) => !isNaN(n) && n > 0, "Must be a positive number")
    .optional(),
  category: z.string().min(1, "Category is required"),
  badgeImage: z.string().min(1, "Badge image URL is required"),
  badgeRole: z.enum(["ATTENDEE", "SPEAKER", "ORGANIZER", "SPONSOR", "VIP"], {
    required_error: "Badge role is required",
  }),
  badgeAttributes: z.object({
    achievement: z.string().optional(),
    customField1: z.string().optional(),
    customField2: z.string().optional(),
  }).optional(),
})

type EventFormData = z.infer<typeof eventFormSchema>

interface EventFormProps {
  onSuccess?: () => void
}

export function EventForm({ onSuccess }: EventFormProps) {
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      location: "",
      category: "",
      badgeImage: "",
      badgeRole: "ATTENDEE",
      badgeAttributes: {
        achievement: "",
        customField1: "",
        customField2: "",
      },
    },
  })

  const { mutate, isLoading, error } = useMutation<CreateEventInput, any>(
    eventService.createEvent,
    {
      onSuccess: () => {
        form.reset()
        onSuccess?.()
      },
    }
  )

  const onSubmit = async (data: EventFormData) => {
    await mutate({
      ...data,
      maxAttendees: data.maxAttendees ? Number(data.maxAttendees) : undefined,
    })
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
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter event title" {...field} />
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
              <FormLabel>Event Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter event description"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date & Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxAttendees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Attendees (Optional)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="No limit" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter event location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="Enter event category" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-medium mb-4">Badge Details</h3>
          
          <FormField
            control={form.control}
            name="badgeImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Badge Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="Enter badge image URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="badgeRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Badge Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a badge role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ATTENDEE">Attendee</SelectItem>
                    <SelectItem value="SPEAKER">Speaker</SelectItem>
                    <SelectItem value="ORGANIZER">Organizer</SelectItem>
                    <SelectItem value="SPONSOR">Sponsor</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="badgeAttributes.achievement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Achievement (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter achievement or special recognition" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="badgeAttributes.customField1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Field 1 (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter custom attribute" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="badgeAttributes.customField2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Field 2 (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter custom attribute" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? <LoadingSpinner size="sm" /> : "Create Event Badge"}
        </Button>
      </form>
    </Form>
  )
}
