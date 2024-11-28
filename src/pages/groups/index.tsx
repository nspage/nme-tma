import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Users, Lock, Unlock } from "lucide-react"
import { Group } from "@/types/community"
import { useGroups } from "@/lib/hooks/use-groups"

export default function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { getGroups, isLoading, error } = useGroups()
  const [groups, setGroups] = useState<Group[]>([])

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await getGroups()
        setGroups(response.items)
      } catch (err) {
        console.error("Failed to fetch groups:", err)
      }
    }
    fetchGroups()
  }, [getGroups])

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Community Groups</h1>
          <p className="text-muted-foreground">Join or create groups to collaborate with others</p>
        </div>
        <Link to="/groups/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Group
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center text-destructive">
          <p>Failed to load groups. Please try again later.</p>
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="text-center text-muted-foreground">
          <p>No groups found</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredGroups.map((group) => (
            <Link key={group.id} to={`/groups/${group.id}`}>
              <Card className="hover:bg-muted/50 transition-colors">
                <CardHeader className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src={group.avatar} />
                      <AvatarFallback>{group.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <CardTitle className="flex items-center">
                        {group.name}
                        {group.isPrivate ? (
                          <Lock className="ml-2 h-4 w-4" />
                        ) : (
                          <Unlock className="ml-2 h-4 w-4" />
                        )}
                      </CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="mr-1 h-4 w-4" />
                        {group.members.length} members
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-2">
                    {group.description}
                  </CardDescription>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {group.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
