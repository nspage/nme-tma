import { useRouteError } from "react-router-dom"

export function ErrorPage() {
  const error = useRouteError() as Error
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4 text-center">
        <h1 className="text-4xl font-bold text-foreground">Oops!</h1>
        <p className="text-xl text-muted-foreground">Sorry, an unexpected error has occurred.</p>
        <p className="text-sm text-muted-foreground">
          {error?.message || "Unknown error occurred"}
        </p>
      </div>
    </div>
  )
}

export default ErrorPage
