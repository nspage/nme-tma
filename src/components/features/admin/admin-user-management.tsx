import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Shield, ShieldAlert, ShieldCheck } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Placeholder data - replace with actual data from API/blockchain
const users = [
  {
    id: "1",
    username: "ton_enthusiast",
    address: "0x1234...5678",
    avatar: "https://avatars.githubusercontent.com/u/1234567",
    role: "admin",
    status: "active",
    joinedDate: "2024-01-15",
    lastActive: "2024-02-10T14:30:00Z",
  },
  {
    id: "2",
    username: "governance_pro",
    address: "0x9876...5432",
    avatar: "https://avatars.githubusercontent.com/u/2345678",
    role: "moderator",
    status: "active",
    joinedDate: "2024-01-20",
    lastActive: "2024-02-10T13:15:00Z",
  },
  {
    id: "3",
    username: "community_builder",
    address: "0x4567...8901",
    avatar: "https://avatars.githubusercontent.com/u/3456789",
    role: "user",
    status: "suspended",
    joinedDate: "2024-01-25",
    lastActive: "2024-02-09T12:45:00Z",
  },
]

const roleIcons = {
  admin: <ShieldCheck className="h-4 w-4 text-primary" />,
  moderator: <Shield className="h-4 w-4 text-blue-500" />,
  user: null,
}

const roleColors = {
  admin: "bg-primary/10 text-primary",
  moderator: "bg-blue-100 text-blue-800",
  user: "bg-gray-100 text-gray-800",
}

const statusColors = {
  active: "bg-green-100 text-green-800",
  suspended: "bg-red-100 text-red-800",
  banned: "bg-gray-100 text-gray-800",
}

export function AdminUserManagement() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString()
  }

  const formatLastActive = (timestamp: string) => {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  const handleUserAction = (userId: string, action: string) => {
    console.log(`Performing ${action} on user ${userId}`)
    // Implement user management actions
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>User Management</CardTitle>
          <Button variant="outline" size="sm">
            <ShieldAlert className="mr-2 h-4 w-4" />
            Manage Roles
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        {user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-xs text-muted-foreground">
                        {user.address}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {roleIcons[user.role as keyof typeof roleIcons]}
                    <Badge
                      className={
                        roleColors[user.role as keyof typeof roleColors]
                      }
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      statusColors[user.status as keyof typeof statusColors]
                    }
                  >
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(user.joinedDate)}</TableCell>
                <TableCell>{formatLastActive(user.lastActive)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleUserAction(user.id, "view")}
                      >
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleUserAction(user.id, "suspend")}
                      >
                        Suspend User
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleUserAction(user.id, "ban")}
                        className="text-red-600"
                      >
                        Ban User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
