import { Button } from "@/components/ui/button"
import { useWallet } from "@/lib/hooks/use-wallet"
import { Wallet } from "lucide-react"

interface LoginButtonProps {
  className?: string
}

export function LoginButton({ className }: LoginButtonProps) {
  const { connect, isLoading } = useWallet()

  return (
    <Button
      onClick={connect}
      disabled={isLoading}
      className={className}
      size="lg"
    >
      {isLoading ? (
        "Connecting..."
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  )
}
