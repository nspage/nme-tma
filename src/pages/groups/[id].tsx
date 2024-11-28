import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Group, Member } from "@/types/community"
import {
  Users,
  Link as LinkIcon,
  Settings,
  Lock,
  Unlock,
} from "lucide-react"

const mockGroup: Group = {
  id: "1",
  name: "TON Developers",
  description: "A community for developers building on The Open Network",
  image: "https://picsum.photos/seed/group1/200",
  memberCount: 1250,
  isPrivate: false,
  tags: ["development", "blockchain", "ton"],
  createdAt: "2024-01-01",
  updatedAt: "2024-02-15",
}

const mockMembers: Member[] = [
  {
    id: "1",
    address: "0x123...",
    displayName: "Alice",
    avatar: "https://picsum.photos/seed/member1/40",
    role: "admin",
    joinedAt: "2024-01-01",
    badges: ["Early Adopter"],
    reputation: 100,
    groups: ["1"],
    socialLinks: {},
  },
  // Add more mock members...
]

export function GroupPage() {
  const { id } = useParams()
  const [group, setGroup] = useState<Group | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // TODO: Replace with actual API calls
    setGroup(mockGroup)
    setMembers(mockMembers)
    setIsAdmin(true) // Mock admin status
  }, [id])

  if (!group) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={group.image} alt={group.name} />
                <AvatarFallback>{group.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="flex items-center gap-2">
                  {group.name}
                  {group.isPrivate ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Unlock className="w-4 h-4" />
                  )}
                </CardTitle>
                <CardDescription>{group.description}</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              {isAdmin && (
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage
                </Button>
              )}
              <Button>Join Group</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{group.memberCount} members</span>
            </div>
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            {group.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={member.avatar} alt={member.displayName} />
                        <AvatarFallback>
                          {member.displayName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.displayName}</div>
                        <div className="text-sm text-muted-foreground">
                          {member.address}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {member.badges.map((badge) => (
                        <Badge key={badge} variant="outline">
                          {badge}
                        </Badge>
                      ))}
                      <Badge variant="secondary">{member.role}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discussions">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">No discussions yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start a discussion to engage with other members
                </p>
                <Button>Start Discussion</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">No events yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create an event to bring the community together
                </p>
                <Button>Create Event</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proposals">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">No proposals yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create a proposal to make decisions as a group
                </p>
                <Button>Create Proposal</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
