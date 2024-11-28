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
import { Member } from "@/types/community"
import {
  Twitter,
  MessageCircle,
  Globe,
  Github,
  Users,
  Trophy,
} from "lucide-react"

// Mock data - replace with actual API call
const mockMember: Member = {
  id: "1",
  address: "0x123...",
  displayName: "Alice",
  bio: "Blockchain enthusiast and developer",
  avatar: "https://avatar.vercel.sh/alice",
  joinedAt: "2023-01-01",
  roles: ["Core Contributor"],
  badges: ["Early Adopter", "Top Contributor", "Event Organizer"],
  reputation: 100,
  groups: ["1", "2"],
  socialLinks: {
    twitter: "alice_web3",
    telegram: "alice_tg",
    github: "alice-dev",
    website: "https://alice.dev",
  },
}

export default function MemberProfilePage() {
  const { id } = useParams()
  const [member, setMember] = useState<Member | null>(null)

  useEffect(() => {
    // TODO: Replace with actual API call
    setMember(mockMember)
  }, [id])

  if (!member) {
    return <div>Loading...</div>
  }

  return (
    <div className="container py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={member.avatar} />
            <AvatarFallback>
              {member.displayName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{member.displayName}</CardTitle>
                <CardDescription className="font-mono">
                  {member.address}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {member.socialLinks.twitter && (
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={`https://twitter.com/${member.socialLinks.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {member.socialLinks.telegram && (
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={`https://t.me/${member.socialLinks.telegram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {member.socialLinks.github && (
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={`https://github.com/${member.socialLinks.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {member.socialLinks.website && (
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={member.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
            <p className="mt-2">{member.bio}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {member.roles.map((role) => (
                <Badge key={role} variant="secondary">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="badges">
        <TabsList>
          <TabsTrigger value="badges">
            <Trophy className="h-4 w-4 mr-2" />
            Badges & Achievements
          </TabsTrigger>
          <TabsTrigger value="groups">
            <Users className="h-4 w-4 mr-2" />
            Groups
          </TabsTrigger>
        </TabsList>

        <TabsContent value="badges">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {member.badges.map((badge) => (
                  <div
                    key={badge}
                    className="flex items-center gap-3 p-4 border rounded-lg"
                  >
                    <Trophy className="h-8 w-8 text-yellow-500" />
                    <div>
                      <h3 className="font-semibold">{badge}</h3>
                      <p className="text-sm text-muted-foreground">
                        Earned for outstanding contributions
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {member.groups.map((groupId) => (
                  <Link key={groupId} to={`/groups/${groupId}`}>
                    <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <Users className="h-8 w-8" />
                      <div>
                        <h3 className="font-semibold">Group {groupId}</h3>
                        <p className="text-sm text-muted-foreground">
                          Active member
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
