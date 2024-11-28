import { Link } from "react-router-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Lock, Unlock } from "lucide-react"
import { Group } from "@/types/community"

// Mock data - replace with actual API call
const mockGroups: Group[] = [
  {
    id: "1",
    name: "TON Developers",
    description: "A community for developers building on The Open Network",
    image: "https://picsum.photos/seed/group1/200",
    memberCount: 1250,
    isPrivate: false,
    tags: ["development", "blockchain", "ton"],
    createdAt: "2024-01-01",
    updatedAt: "2024-02-15",
  },
  {
    id: "2",
    name: "TON Validators",
    description: "Network validators and node operators",
    image: "https://picsum.photos/seed/group2/200",
    memberCount: 450,
    isPrivate: true,
    tags: ["validators", "nodes", "infrastructure"],
    createdAt: "2024-01-15",
    updatedAt: "2024-02-10",
  },
  {
    id: "3",
    name: "TON Community",
    description: "General discussion and updates about TON ecosystem",
    image: "https://picsum.photos/seed/group3/200",
    memberCount: 3500,
    isPrivate: false,
    tags: ["community", "discussion", "ecosystem"],
    createdAt: "2024-01-05",
    updatedAt: "2024-02-20",
  },
]

export function GroupList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockGroups.map((group) => (
        <Link key={group.id} to={`/groups/${group.id}`}>
          <Card className="h-full hover:bg-muted/50 transition-colors">
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={group.image} alt={group.name} />
                  <AvatarFallback>{group.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{group.name}</CardTitle>
                    {group.isPrivate ? (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Unlock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{group.memberCount} members</span>
                  </div>
                </div>
              </div>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
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
  )
}
