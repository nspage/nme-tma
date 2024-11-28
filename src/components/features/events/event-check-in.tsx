import { useState } from "react"
import { QrScanner } from "@yudiel/react-qr-scanner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { WebSocketService } from "@/lib/websocket"

interface EventCheckInProps {
  eventId: string
  onCheckIn?: (attendeeId: string) => void
}

export function EventCheckIn({ eventId, onCheckIn }: EventCheckInProps) {
  const [scanning, setScanning] = useState(false)
  const { toast } = useToast()
  const ws = new WebSocketService()

  const handleScan = async (result: string) => {
    if (!result) return

    try {
      const data = JSON.parse(result)
      if (data.eventId !== eventId) {
        toast({
          title: "Invalid QR Code",
          description: "This QR code is for a different event",
          variant: "destructive",
        })
        return
      }

      // Send check-in data to WebSocket
      ws.send({
        type: "check-in",
        eventId,
        attendeeId: data.attendeeId,
        timestamp: new Date().toISOString(),
      })

      toast({
        title: "Check-in Successful",
        description: "Attendee has been checked in",
      })

      onCheckIn?.(data.attendeeId)
      setScanning(false)
    } catch (error) {
      console.error("Error processing QR code:", error)
      toast({
        title: "Error",
        description: "Invalid QR code format",
        variant: "destructive",
      })
    }
  }

  const handleError = (error: any) => {
    console.error("QR Scanner error:", error)
    toast({
      title: "Scanner Error",
      description: "Failed to access camera",
      variant: "destructive",
    })
    setScanning(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Check-in</CardTitle>
      </CardHeader>
      <CardContent>
        {scanning ? (
          <div className="space-y-4">
            <div className="aspect-square max-w-sm mx-auto overflow-hidden rounded-lg">
              <QrScanner
                onDecode={handleScan}
                onError={handleError}
                constraints={{ facingMode: "environment" }}
              />
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setScanning(false)}
            >
              Cancel Scanning
            </Button>
          </div>
        ) : (
          <Button className="w-full" onClick={() => setScanning(true)}>
            Start Scanning
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
