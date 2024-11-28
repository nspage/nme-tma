import { WalletConnectComponent } from "@/components/features/auth/wallet-connect"
import { AuthStatusIndicator } from "@/components/features/auth/auth-status-indicator"
import { LoginButton } from "@/components/features/auth/login-button"
import { useTonAuth } from "@/hooks/use-ton-auth"
import { Navigate } from "react-router-dom"

export function ConnectPage() {
  const { isConnected } = useTonAuth()

  if (isConnected) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Connect Your Wallet</h1>
          <p className="text-muted-foreground">
            Connect your TON wallet to participate in governance and community events.
          </p>
        </div>

        <div className="p-6 border rounded-lg bg-card space-y-6">
          <WalletConnectComponent />
          <AuthStatusIndicator />
          <LoginButton />
        </div>

        <div className="text-sm text-center text-muted-foreground">
          <p>By connecting, you agree to our terms of service and privacy policy.</p>
        </div>
      </div>
    </div>
  )
}

export default ConnectPage
