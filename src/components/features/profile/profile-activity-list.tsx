import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Link } from "react-router-dom"

// Placeholder data - replace with actual data from API/blockchain
const activities = [
  {
    id: "1",
    type: "proposal_vote",
    title: "Voted on 'Implement Community Treasury'",
    vote: "yes",
    date: "2024-02-10",
    link: "/proposals/1",
  },
  {
    id: "2",
    type: "event_attendance",
    title: "Attended 'Community Town Hall'",
    date: "2024-02-08",
    link: "/events/1",
  },
  {
    id: "3",
    type: "proposal_created",
    title: "Created 'Protocol Upgrade Proposal'",
    status: "active",
    date: "2024-02-05",
    link: "/proposals/2",
  },
]

const activityColors = {
  proposal_vote: "bg-blue-100 text-blue-800",
  event_attendance: "bg-purple-100 text-purple-800",
  proposal_created: "bg-green-100 text-green-800",
}

const activityLabels = {
  proposal_vote: "Vote",
  event_attendance: "Event",
  proposal_created: "Proposal",
}

export function ProfileActivityList() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <Card key={activity.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className={activityColors[activity.type as keyof typeof activityColors]}>
                    {activityLabels[activity.type as keyof typeof activityLabels]}
                  </Badge>
                  {activity.vote && (
                    <Badge variant="outline">
                      {activity.vote.toUpperCase()}
                    </Badge>
                  )}
                  {activity.status && (
                    <Badge variant="outline">
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </Badge>
                  )}
                </div>
                <div className="font-medium">{activity.title}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(activity.date).toLocaleDateString()}
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to={activity.link}>View</Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
