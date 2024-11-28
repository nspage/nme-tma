import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./alert"

interface ErrorMessageProps {
  title?: string
  error: Error | null
  className?: string
}

export function ErrorMessage({
  title = "Error",
  error,
  className,
}: ErrorMessageProps) {
  if (!error) return null

  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {error.message || "An unexpected error occurred"}
      </AlertDescription>
    </Alert>
  )
}
