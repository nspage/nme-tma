import { ProfileOverview } from "@/components/features/profile/profile-overview"
import { EventParticipationHistory } from "@/components/features/profile/event-participation-history"
import { GovernanceParticipationHistory } from "@/components/features/profile/governance-participation-history"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export function ProfilePage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Button variant="outline" asChild>
          <Link to="/profile/edit">Edit Profile</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6">
          <ProfileOverview />

          <div className="p-4 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/proposals/create">Create Proposal</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/events/create">Create Event</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/profile/settings">Settings</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">Governance Activity</h2>
            <GovernanceParticipationHistory />
          </div>

          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">Event Activity</h2>
            <EventParticipationHistory />
          </div>

          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">Badges & Achievements</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {/* Placeholder for badges */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-muted flex items-center justify-center"
                >
                  <span className="text-2xl">🏆</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
