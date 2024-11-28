import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  Vote,
  CalendarDays,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
} from "lucide-react"

// Placeholder data - replace with actual data from API/blockchain
const stats = {
  totalUsers: 1234,
  activeUsers: 567,
  totalProposals: 45,
  activeProposals: 12,
  totalEvents: 23,
  upcomingEvents: 8,
  totalVotes: 3456,
  weeklyVotes: 234,
  totalComments: 789,
  weeklyComments: 56,
  governanceParticipation: 78, // percentage
}

interface StatCardProps {
  title: string
  value: string | number
  subValue?: string
  icon: React.ReactNode
  trend?: {
    value: number
    label: string
  }
}

function StatCard({ title, value, subValue, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subValue && (
          <p className="text-xs text-muted-foreground">{subValue}</p>
        )}
        {trend && (
          <div className="mt-2 flex items-center text-xs">
            <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
            <span className="text-green-500">{trend.value}%</span>
            <span className="ml-1 text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function AdminOverviewStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Users"
        value={stats.totalUsers}
        subValue={`${stats.activeUsers} active this week`}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        trend={{
          value: 12,
          label: "from last month",
        }}
      />
      <StatCard
        title="Proposals"
        value={stats.totalProposals}
        subValue={`${stats.activeProposals} active proposals`}
        icon={<Vote className="h-4 w-4 text-muted-foreground" />}
        trend={{
          value: 8,
          label: "from last month",
        }}
      />
      <StatCard
        title="Events"
        value={stats.totalEvents}
        subValue={`${stats.upcomingEvents} upcoming events`}
        icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Total Votes"
        value={stats.totalVotes}
        subValue={`${stats.weeklyVotes} votes this week`}
        icon={<Vote className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Comments"
        value={stats.totalComments}
        subValue={`${stats.weeklyComments} comments this week`}
        icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Governance Participation"
        value={`${stats.governanceParticipation}%`}
        icon={<ShieldCheck className="h-4 w-4 text-muted-foreground" />}
        trend={{
          value: 5,
          label: "from last month",
        }}
      />
    </div>
  )
}
