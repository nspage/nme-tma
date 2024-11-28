import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useTonConnect } from "@/lib/hooks/use-ton-connect"
import { TonConnectButton } from "@tonconnect/ui-react"

export function HomePage() {
  const { isConnected } = useTonConnect()

  return (
    <div className="container space-y-8 pb-8">
      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to NME Community
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Create and participate in events, join groups, and vote on proposals. Connect with other members
            of the community and help shape its future.
          </p>
          <div className="space-x-4">
            {!isConnected && <TonConnectButton />}
            <Button asChild>
              <Link to="/events">Browse Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <Card className="flex flex-col justify-between p-6">
            <div className="space-y-2">
              <h3 className="font-bold">Events</h3>
              <p className="text-sm text-muted-foreground">
                Create and join events in your community. From meetups to workshops,
                find events that interest you.
              </p>
            </div>
            <Button className="mt-4" variant="outline" asChild>
              <Link to="/events">View Events</Link>
            </Button>
          </Card>

          <Card className="flex flex-col justify-between p-6">
            <div className="space-y-2">
              <h3 className="font-bold">Groups</h3>
              <p className="text-sm text-muted-foreground">
                Join groups based on your interests. Connect with like-minded
                people and participate in group activities.
              </p>
            </div>
            <Button className="mt-4" variant="outline" asChild>
              <Link to="/groups">View Groups</Link>
            </Button>
          </Card>

          <Card className="flex flex-col justify-between p-6">
            <div className="space-y-2">
              <h3 className="font-bold">Proposals</h3>
              <p className="text-sm text-muted-foreground">
                Vote on community proposals and help shape the future of the
                community. Create proposals to suggest changes.
              </p>
            </div>
            <Button className="mt-4" variant="outline" asChild>
              <Link to="/proposals">View Proposals</Link>
            </Button>
          </Card>
        </div>
      </section>
    </div>
  )
}
