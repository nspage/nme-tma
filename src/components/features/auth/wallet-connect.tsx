import { Button } from "@/components/ui/button"
import { useTonAuth } from "@/hooks/use-ton-auth"
import { TonConnectButton } from "@tonconnect/ui-react"
import { useWalletBalance } from "@/lib/hooks/use-wallet-balance"
import { Loader2 } from "lucide-react"

export function WalletConnectComponent() {
  const { isConnected } = useTonAuth()

  if (isConnected) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="flex items-center justify-center w-full">
        <TonConnectButton />
      </div>
      <p className="text-sm text-muted-foreground text-center">
        By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  )
}

export function LoginButton() {
  const { connect, isConnected } = useTonAuth()

  if (isConnected) {
    return null
  }

  return (
    <Button onClick={connect} size="lg" className="w-full">
      Connect TON Wallet
    </Button>
  )
}

export function AuthStatusIndicator() {
  const { isConnected, wallet } = useTonAuth()
  const { balance, isLoading: isBalanceLoading, error: balanceError } = useWalletBalance(
    wallet?.address || null
  )

  if (!isConnected || !wallet) {
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg bg-muted">
        <span className="text-sm text-muted-foreground">Not connected</span>
        <div className="w-2 h-2 rounded-full bg-red-500" />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">
          {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
        </span>
        <div className="flex items-center gap-2">
          {isBalanceLoading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : balanceError ? (
            <span className="text-xs text-red-500">Error loading balance</span>
          ) : (
            <span className="text-xs text-muted-foreground">{balance} TON</span>
          )}
        </div>
      </div>
      <div className="w-2 h-2 rounded-full bg-green-500" />
    </div>
  )
}
