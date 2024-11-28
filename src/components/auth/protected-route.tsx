import { Navigate, useLocation } from "react-router-dom"
import { useWallet } from "@/lib/hooks/use-wallet"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()
  const { isConnected, isLoading } = useWallet()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isConnected) {
    return <Navigate to="/connect" state={{ from: location }} replace />
  }

  return <>{children}</>
}
