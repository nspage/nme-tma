import { ProposalManagementList } from "@/components/features/governance/proposal-management-list"
import { EventManagementList } from "@/components/features/events/event-management-list"
import { MemberProfileCard } from "@/components/features/profile/member-profile-card"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/ui/search-bar"
import { FilterDropdown } from "@/components/ui/filter-dropdown"
import { Link } from "react-router-dom"

export function AdminPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link to="/admin/settings">Settings</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/logs">View Logs</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 border rounded-lg bg-card">
              <h3 className="font-medium text-muted-foreground">Total Users</h3>
              <p className="text-3xl font-bold">1,234</p>
            </div>
            <div className="p-6 border rounded-lg bg-card">
              <h3 className="font-medium text-muted-foreground">Active Proposals</h3>
              <p className="text-3xl font-bold">23</p>
            </div>
            <div className="p-6 border rounded-lg bg-card">
              <h3 className="font-medium text-muted-foreground">Upcoming Events</h3>
              <p className="text-3xl font-bold">12</p>
            </div>
          </div>

          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">Proposal Management</h2>
            <div className="flex gap-4 mb-4">
              <SearchBar className="flex-1" placeholder="Search proposals..." />
              <FilterDropdown
                options={[
                  { label: "All", value: "all" },
                  { label: "Pending Review", value: "pending" },
                  { label: "Reported", value: "reported" },
                ]}
              />
            </div>
            <ProposalManagementList />
          </div>

          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">Event Management</h2>
            <div className="flex gap-4 mb-4">
              <SearchBar className="flex-1" placeholder="Search events..." />
              <FilterDropdown
                options={[
                  { label: "All", value: "all" },
                  { label: "Pending Review", value: "pending" },
                  { label: "Reported", value: "reported" },
                ]}
              />
            </div>
            <EventManagementList />
          </div>
        </div>

        <div className="space-y-6">
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4 text-sm">
              {/* Placeholder for activity feed */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="pb-4 border-b last:border-0 last:pb-0">
                  <p className="font-medium">Activity {i + 1}</p>
                  <p className="text-muted-foreground">
                    Lorem ipsum dolor sit amet consectetur.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/admin/proposals/flagged">Review Flagged Proposals</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/admin/events/pending">Review Pending Events</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/admin/users/reports">User Reports</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
