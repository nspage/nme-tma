import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { GroupList } from "@/components/features/groups/group-list"

export function GroupsPage() {
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
          <p className="text-muted-foreground">
            Join and organize community groups
          </p>
        </div>
        <Link to="/groups/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Group
          </Button>
        </Link>
      </div>

      <GroupList />
    </div>
  )
}
