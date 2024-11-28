import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Event } from "@/types/event"

interface RSVPButtonProps {
  event: Event
  isAuthenticated: boolean
  userAddress?: string
  onSuccess?: () => void
}

export function RSVPButton({
  event,
  isAuthenticated,
  userAddress,
  onSuccess,
}: RSVPButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const isOrganizer = userAddress && event.organizer.address === userAddress
  const hasRSVPed = userAddress && event.attendees.some(a => a.address === userAddress)
  const isFull = event.attendees.length >= event.capacity
  const isPast = new Date(event.endDate) < new Date()

  const getButtonState = () => {
    if (isOrganizer) return { disabled: true, text: "You're the organizer" }
    if (!isAuthenticated) return { disabled: true, text: "Connect wallet to RSVP" }
    if (hasRSVPed) return { disabled: true, text: "Already RSVPed" }
    if (isFull) return { disabled: true, text: "Event is full" }
    if (isPast) return { disabled: true, text: "Event has ended" }
    if (event.status === "cancelled") return { disabled: true, text: "Event cancelled" }
    return { disabled: false, text: "RSVP Now" }
  }

  const handleRSVP = async () => {
    if (!userAddress) return

    try {
      setIsLoading(true)

      // Check token gating if required
      if (event.tokenGated?.required) {
        // TODO: Implement token balance check
        // const hasEnoughTokens = await checkTokenBalance(userAddress, event.tokenGated)
        // if (!hasEnoughTokens) {
        //   toast({
        //     title: "Token requirement not met",
        //     description: `You need at least ${event.tokenGated.minTokens} tokens to RSVP`,
        //     variant: "destructive",
        //   })
        //   return
        // }
      }

      // TODO: Replace with actual blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: "RSVP Successful!",
        description: "You have successfully RSVPed to this event.",
      })

      onSuccess?.()
    } catch (error) {
      toast({
        title: "RSVP Failed",
        description: "There was an error while processing your RSVP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const buttonState = getButtonState()

  return (
    <Button
      onClick={handleRSVP}
      disabled={buttonState.disabled || isLoading}
      className="w-full sm:w-auto"
    >
      {isLoading ? (
        <LoadingSpinner size="sm" className="mr-2" />
      ) : null}
      {buttonState.text}
    </Button>
  )
}
