import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/lib/hooks/use-wallet"
import { useQuery } from "@/lib/hooks/use-query"
import { memberService } from "@/lib/api"

export function ProfileOverview() {
  const { address } = useWallet()
  const { data: profile } = useQuery(() => memberService.getProfile(address!))

  if (!profile) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback>{profile.username?.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{profile.username}</h3>
            <p className="text-sm text-muted-foreground">{profile.bio}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Groups</h4>
          <div className="flex flex-wrap gap-2">
            {profile.groups.map((group) => (
              <Badge key={group.id} variant="secondary">
                {group.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{profile.proposalsCreated}</div>
            <div className="text-sm text-muted-foreground">Proposals</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{profile.eventsAttended}</div>
            <div className="text-sm text-muted-foreground">Events</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{profile.votesParticipated}</div>
            <div className="text-sm text-muted-foreground">Votes</div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Social Links</h4>
          <div className="grid grid-cols-2 gap-2">
            {profile.socialLinks?.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                {link.platform}
              </a>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
