import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { Copy, Edit, ExternalLink } from "lucide-react"

interface ProfileOverviewCardProps {
  address: string
}

// Placeholder data - replace with actual data from API/blockchain
const profile = {
  address: "0x1234...5678",
  username: "ton_enthusiast",
  avatar: "https://avatars.githubusercontent.com/u/1234567",
  bio: "Active community member and governance participant. Building on TON.",
  joinedDate: "2023-09-15",
  stats: {
    proposalsCreated: 3,
    proposalsVoted: 12,
    eventsAttended: 8,
  },
  badges: [
    { id: "1", name: "Early Adopter", color: "bg-purple-100 text-purple-800" },
    { id: "2", name: "Active Voter", color: "bg-blue-100 text-blue-800" },
    { id: "3", name: "Event Host", color: "bg-green-100 text-green-800" },
  ],
}

export function ProfileOverviewCard({ address }: ProfileOverviewCardProps) {
  const copyAddress = () => {
    navigator.clipboard.writeText(address)
    // You might want to show a toast notification here
  }

  const truncateAddress = (addr: string) => {
    return addr.slice(0, 6) + "..." + addr.slice(-4)
  }

  return (
    <Card>
      <CardHeader className="flex-row items-start gap-4 space-y-0">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile.avatar} alt={profile.username} />
          <AvatarFallback>{profile.username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{profile.username}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{truncateAddress(address)}</span>
                <button onClick={copyAddress} className="hover:text-primary">
                  <Copy className="h-4 w-4" />
                </button>
                <a
                  href={`https://tonscan.org/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/profile/edit">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          </div>
          <p className="text-muted-foreground">{profile.bio}</p>
          <div className="flex flex-wrap gap-2">
            {profile.badges.map((badge) => (
              <Badge key={badge.id} className={badge.color}>
                {badge.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{profile.stats.proposalsCreated}</div>
            <div className="text-sm text-muted-foreground">Proposals Created</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{profile.stats.proposalsVoted}</div>
            <div className="text-sm text-muted-foreground">Proposals Voted</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{profile.stats.eventsAttended}</div>
            <div className="text-sm text-muted-foreground">Events Attended</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Joined {new Date(profile.joinedDate).toLocaleDateString()}
      </CardFooter>
    </Card>
  )
}
