import { useEffect, useState } from "react"
import QRCode from "qrcode"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Download } from "lucide-react"

interface EventQRCodeProps {
  eventId: string
  size?: number
}

export function EventQRCode({ eventId, size = 256 }: EventQRCodeProps) {
  const [qrUrl, setQrUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    generateQRCode()
  }, [eventId, size])

  const generateQRCode = async () => {
    try {
      setIsLoading(true)
      // Generate a check-in URL that the event check-in app will handle
      const checkInUrl = `ton-event://${eventId}/check-in`
      const url = await QRCode.toDataURL(checkInUrl, {
        width: size,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      })
      setQrUrl(url)
    } catch (error) {
      console.error("Error generating QR code:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (!qrUrl) return

    const link = document.createElement("a")
    link.href = qrUrl
    link.download = `event-${eventId}-qr.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <img
          src={qrUrl}
          alt="Event Check-in QR Code"
          width={size}
          height={size}
          className="rounded-lg border"
        />
      </div>
      <div className="flex justify-center">
        <Button onClick={handleDownload} variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Download QR Code
        </Button>
      </div>
    </div>
  )
}
