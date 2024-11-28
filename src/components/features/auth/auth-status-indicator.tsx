import { useWallet } from "@/lib/hooks/use-wallet"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface AuthStatusIndicatorProps {
  className?: string
}

export function AuthStatusIndicator({ className }: AuthStatusIndicatorProps) {
  const { isConnected, address } = useWallet()

  if (!isConnected) {
    return (
      <Badge variant="outline" className={cn("bg-red-50", className)}>
        Not Connected
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className={cn("bg-green-50", className)}>
      Connected: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""}
    </Badge>
  )
}
