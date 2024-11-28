import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useWallet } from "@/lib/hooks/use-wallet"

export function HomePage() {
  const navigate = useNavigate()
  const { isConnected } = useWallet()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to TON Community Governance
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
        A decentralized platform for TON community members to propose, discuss,
        and vote on important decisions that shape the future of the ecosystem.
      </p>
      <div className="flex gap-4">
        {isConnected ? (
          <>
            <Button onClick={() => navigate("/proposals")}>
              View Proposals
            </Button>
            <Button onClick={() => navigate("/events")} variant="outline">
              Explore Events
            </Button>
          </>
        ) : (
          <Button onClick={() => navigate("/connect")} size="lg">
            Connect Wallet to Start
          </Button>
        )}
      </div>
    </div>
  )
}
