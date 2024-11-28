import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/lib/hooks/use-wallet"
import { Wallet, LogOut } from "lucide-react"

export function Header() {
  const { isConnected, address, connect, disconnect } = useWallet()

  const shortenAddress = (addr: string) => {
    if (!addr) return ""
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-bold">
            TON Governance
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/proposals" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Proposals
            </Link>
            <Link to="/events" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Events
            </Link>
            <Link to="/groups" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Groups
            </Link>
            <Link to="/badges" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Badges
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Button variant="outline" size="sm" className="gap-2">
                <Wallet className="h-4 w-4" />
                {shortenAddress(address!)}
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={disconnect}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button onClick={connect} size="sm" className="gap-2">
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
