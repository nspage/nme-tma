import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "lucide-react"

// Placeholder data - replace with actual analytics data
const analyticsData = {
  overview: {
    totalUsers: "1,234",
    activeUsers: "856",
    totalProposals: "45",
    totalVotes: "12,567",
  },
  userGrowth: [
    { date: "2024-01", users: 980 },
    { date: "2024-02", users: 1234 },
  ],
  proposalStats: {
    approved: 28,
    rejected: 12,
    pending: 5,
  },
  voteDistribution: {
    governance: "45%",
    treasury: "30%",
    community: "25%",
  },
}

export function AdminAnalytics() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <div className="flex items-center gap-4">
          <Select defaultValue="7d">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              69.4% of total users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Proposals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalProposals}</div>
            <p className="text-xs text-muted-foreground">
              +3 new this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Votes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalVotes}</div>
            <p className="text-xs text-muted-foreground">
              279.2 avg votes per proposal
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="proposals" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Proposals
          </TabsTrigger>
          <TabsTrigger value="distribution" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Vote Distribution
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                {/* Replace with actual chart component */}
                <div className="flex h-full items-center justify-center border-2 border-dashed">
                  Line Chart: User Growth Over Time
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="proposals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Proposal Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                {/* Replace with actual chart component */}
                <div className="flex h-full items-center justify-center border-2 border-dashed">
                  Bar Chart: Proposal Status Distribution
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vote Distribution by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                {/* Replace with actual chart component */}
                <div className="flex h-full items-center justify-center border-2 border-dashed">
                  Pie Chart: Vote Distribution
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
