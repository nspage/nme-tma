import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useTonConnect } from "@/lib/hooks/use-ton-connect"

export function HomePage() {
  const { isConnected } = useTonConnect()

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6">
      <h1 className="text-4xl font-bold text-center">Welcome to TON Community</h1>
      <p className="text-xl text-muted-foreground text-center max-w-md">
        {isConnected
          ? "You're connected! Try out our proposal system."
          : "Connect your TON wallet to participate in governance."}
      </p>
      <Button asChild size="lg">
        <Link to="/test-proposal">Test Proposal System</Link>
      </Button>
    </div>
  )
}

export default HomePage
