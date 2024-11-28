import { useNavigate } from 'react-router-dom'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useEvents } from '@/lib/hooks/use-events'
import { toast } from 'sonner'

const formSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters"),
  description: z.string()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must not exceed 1000 characters"),
  startDate: z.date()
    .min(new Date(), "Start date must be in the future"),
  endDate: z.date()
    .min(new Date(), "End date must be in the future"),
  locationType: z.enum(["online", "physical", "hybrid"]),
  venue: z.string().optional(),
  address: z.string().optional(),
  onlineLink: z.string().url().optional(),
  capacity: z.number()
    .min(1, "Capacity must be at least 1")
    .max(10000, "Capacity must not exceed 10000"),
}).refine((data) => {
  return data.endDate >= data.startDate
}, {
  message: "End date must be after start date",
  path: ["endDate"],
}).refine((data) => {
  if (data.locationType === "physical" || data.locationType === "hybrid") {
    return !!data.venue && !!data.address
  }
  return true
}, {
  message: "Venue and address are required for physical or hybrid events",
  path: ["venue"],
}).refine((data) => {
  if (data.locationType === "online" || data.locationType === "hybrid") {
    return !!data.onlineLink
  }
  return true
}, {
  message: "Online link is required for online or hybrid events",
  path: ["onlineLink"],
})

export function CreateEvent() {
  const navigate = useNavigate()
  const { createEvent } = useEvents()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      locationType: "online",
      capacity: 100,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createEvent({
        title: values.title,
        description: values.description,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        location: {
          type: values.locationType,
          venue: values.venue,
          address: values.address,
          onlineLink: values.onlineLink,
        },
        capacity: values.capacity,
      })
      toast.success("Event created successfully!")
      navigate("/events")
    } catch (error) {
      toast.error("Failed to create event")
      console.error(error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Event</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event title" {...field} />
                  </FormControl>
                  <FormDescription>
                    Choose a clear and descriptive title for your event
                  </FormDescription>
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
                      placeholder="Describe your event..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide details about the event, its purpose, and what attendees can expect
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="locationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="physical">Physical</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose how attendees will participate in your event
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(form.watch("locationType") === "physical" || form.watch("locationType") === "hybrid") && (
              <>
                <FormField
                  control={form.control}
                  name="venue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Venue Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter venue name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter venue address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {(form.watch("locationType") === "online" || form.watch("locationType") === "hybrid") && (
              <FormField
                control={form.control}
                name="onlineLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Online Meeting Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://meet.example.com/..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide the link where attendees can join the event online
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Attendees</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Set the maximum number of attendees for your event
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/events")}
              >
                Cancel
              </Button>
              <Button type="submit">Create Event</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
