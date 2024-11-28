import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Github, Twitter, Globe } from "lucide-react"

interface Member {
  id: string
  name: string
  role: string
  bio: string
  avatar: string
  social: {
    github?: string
    twitter?: string
    website?: string
  }
}

const MOCK_MEMBERS: Member[] = [
  {
    id: "1",
    name: "Alex Thompson",
    role: "Core Developer",
    bio: "Blockchain developer focused on TON ecosystem and smart contracts.",
    avatar: "https://picsum.photos/seed/member1/200",
    social: {
      github: "https://github.com",
      twitter: "https://twitter.com",
      website: "https://example.com"
    }
  },
  {
    id: "2",
    name: "Sarah Chen",
    role: "Community Manager",
    bio: "Building bridges between developers, users, and stakeholders in the TON community.",
    avatar: "https://picsum.photos/seed/member2/200",
    social: {
      twitter: "https://twitter.com",
      website: "https://example.com"
    }
  },
  {
    id: "3",
    name: "Michael Patel",
    role: "DeFi Researcher",
    bio: "Researching and developing decentralized finance solutions on TON.",
    avatar: "https://picsum.photos/seed/member3/200",
    social: {
      github: "https://github.com",
      twitter: "https://twitter.com"
    }
  }
]

export default function MembersPage() {
  const [members] = useState<Member[]>(MOCK_MEMBERS)

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Community Members</h1>
          <p className="text-muted-foreground mt-2">
            Meet the people building the future of TON
          </p>
        </div>
        <Button>
          Join Community
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <div key={member.id} className="group relative overflow-hidden rounded-lg border p-6">
            <div className="flex items-center space-x-4">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {member.bio}
            </p>
            <div className="mt-4 flex space-x-2">
              {member.social.github && (
                <Button variant="ghost" size="icon" asChild>
                  <a href={member.social.github} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {member.social.twitter && (
                <Button variant="ghost" size="icon" asChild>
                  <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {member.social.website && (
                <Button variant="ghost" size="icon" asChild>
                  <a href={member.social.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
