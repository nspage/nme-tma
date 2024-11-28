import { Link } from "react-router-dom"
import { TonConnectButton } from "@tonconnect/ui-react"
import { useTonConnect } from "@/lib/hooks/use-ton-connect"
import { Button } from "@/components/ui/button"
import { truncateAddress } from "@/lib/utils"

export function Navigation() {
  const { wallet } = useTonConnect()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">NME Community</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/proposals"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Proposals
            </Link>
            <Link
              to="/events"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Events
            </Link>
            <Link
              to="/groups"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Groups
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Add search functionality later */}
          </div>
          <nav className="flex items-center space-x-2">
            {wallet && (
              <Link to="/profile">
                <Button variant="ghost" className="mr-2">
                  {truncateAddress(wallet.address)}
                </Button>
              </Link>
            )}
            <TonConnectButton />
          </nav>
        </div>
      </div>
    </header>
  )
}
