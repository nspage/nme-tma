import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  size?: "sm" | "default" | "lg"
  className?: string
  centered?: boolean
}

export function LoadingSpinner({
  size = "default",
  className,
  centered = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <div
      className={cn(
        "flex items-center",
        centered && "justify-center w-full h-full",
        className
      )}
    >
      <Loader2
        className={cn(
          "animate-spin text-muted-foreground",
          sizeClasses[size]
        )}
      />
    </div>
  )
}

interface LoadingOverlayProps extends LoadingSpinnerProps {
  message?: string
}

export function LoadingOverlay({
  message,
  size = "lg",
  className,
}: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className={cn("flex flex-col items-center gap-4", className)}>
        <LoadingSpinner size={size} />
        {message && (
          <p className="text-sm font-medium text-muted-foreground">{message}</p>
        )}
      </div>
    </div>
  )
}
