import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Users, MessageSquare, Vote, Calendar } from "lucide-react"

console.log("LandingPage imported");

export default function LandingPage() {
  console.log("LandingPage rendering");
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                TON Community Governance
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Participate in the future of TON ecosystem. Join discussions, vote on proposals, and attend community events.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500">
                <Link to="/proposals">View Proposals</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2">
                <Link to="/events">Join Events</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Why Join Our Community?
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Be part of a vibrant community shaping the future of decentralized technology.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-10">
            {/* Feature Cards */}
            <div className="grid gap-6">
              <div className="group relative overflow-hidden rounded-lg border p-6 hover:border-blue-500">
                <div className="flex items-center gap-4">
                  <Users className="h-6 w-6 text-blue-500" />
                  <h3 className="font-semibold">Connect with Members</h3>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Network with TON enthusiasts, developers, and community leaders.
                </p>
              </div>
              <div className="group relative overflow-hidden rounded-lg border p-6 hover:border-teal-500">
                <div className="flex items-center gap-4">
                  <MessageSquare className="h-6 w-6 text-teal-500" />
                  <h3 className="font-semibold">Join Discussions</h3>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Participate in meaningful discussions about the future of TON.
                </p>
              </div>
            </div>
            <div className="grid gap-6">
              <div className="group relative overflow-hidden rounded-lg border p-6 hover:border-purple-500">
                <div className="flex items-center gap-4">
                  <Vote className="h-6 w-6 text-purple-500" />
                  <h3 className="font-semibold">Vote on Proposals</h3>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Have your say in important decisions that shape the ecosystem.
                </p>
              </div>
              <div className="group relative overflow-hidden rounded-lg border p-6 hover:border-pink-500">
                <div className="flex items-center gap-4">
                  <Calendar className="h-6 w-6 text-pink-500" />
                  <h3 className="font-semibold">Attend Events</h3>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Join virtual and in-person events to learn and grow together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 border-t bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Ready to Get Started?
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Join our community today and help shape the future of decentralized governance.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link to="/connect">Connect Wallet</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/groups">Browse Groups</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
