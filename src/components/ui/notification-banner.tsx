import { X } from "lucide-react"
import { useState } from "react"
import { Button } from "./button"

interface NotificationBannerProps {
  title?: string
  message?: string
  type?: "info" | "warning" | "success" | "error"
  onClose?: () => void
}

export function NotificationBanner({
  title = "Welcome to NME Community!",
  message = "This is a beta version. Please report any issues you encounter.",
  type = "info",
  onClose,
}: NotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) {
    return null
  }

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  const variants = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
  }

  return (
    <div
      className={`relative rounded-lg border p-4 ${variants[type]} mb-6`}
      role="alert"
    >
      <div className="flex items-start gap-4">
        <div className="flex-1">
          {title && <h3 className="font-medium mb-1">{title}</h3>}
          <p className="text-sm">{message}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 rounded-full"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </div>
    </div>
  )
}
