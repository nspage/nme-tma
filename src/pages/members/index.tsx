import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Member } from "@/types/community"

// Mock data - replace with actual API call
const mockMembers: Member[] = [
  {
    id: "1",
    address: "0x123...",
    displayName: "Alice",
    bio: "Blockchain enthusiast",
    avatar: "https://avatar.vercel.sh/alice",
    joinedAt: "2023-01-01",
    roles: ["Core Contributor"],
    badges: ["Early Adopter"],
    reputation: 100,
    groups: ["1", "2"],
    socialLinks: {
      twitter: "alice_web3",
      telegram: "alice_tg",
    },
  },
  // Add more mock members...
]

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")

  const filteredMembers = mockMembers.filter((member) => {
    const matchesSearch =
      member.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole =
      roleFilter === "all" || member.roles.includes(roleFilter)
    return matchesSearch && matchesRole
  })

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Community Members</h1>
        <p className="text-muted-foreground">
          Connect and collaborate with other members of our community
        </p>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Core Contributor">Core Contributors</SelectItem>
            <SelectItem value="Community Manager">Community Managers</SelectItem>
            <SelectItem value="Member">Members</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Link key={member.id} to={`/members/${member.id}`}>
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>
                    {member.displayName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{member.displayName}</CardTitle>
                  <CardDescription className="font-mono">
                    {member.address}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {member.bio}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {member.roles.map((role) => (
                      <Badge key={role} variant="secondary">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
