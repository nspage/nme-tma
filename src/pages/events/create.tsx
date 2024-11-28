import { CreateEvent } from '@/components/features/events/create-event'

export function CreateEventPage() {
  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Create Event</h1>
      <CreateEvent />
    </div>
  )
}

export default CreateEventPage
