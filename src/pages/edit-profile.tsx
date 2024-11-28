import { EditProfileForm } from "@/components/features/profile/edit-profile-form"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export function EditProfilePage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link to="/profile">← Back to Profile</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="border rounded-lg p-6 bg-card">
            <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
            <EditProfileForm />
          </div>
        </div>

        <div className="space-y-6">
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-lg font-semibold mb-4">Profile Guidelines</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Your profile helps other community members get to know you better.
                Consider including:
              </p>
              <ul className="list-disc pl-4 space-y-2">
                <li>A brief bio about yourself</li>
                <li>Your interests in the TON ecosystem</li>
                <li>Skills you can contribute</li>
                <li>Languages you speak</li>
                <li>Social media links</li>
              </ul>
            </div>
          </div>

          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-lg font-semibold mb-4">Privacy Settings</h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <p className="font-medium">Public Profile</p>
                  <p className="text-muted-foreground">
                    Your profile is visible to all community members
                  </p>
                </div>
                {/* Toggle component will go here */}
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <p className="font-medium">Show Activity</p>
                  <p className="text-muted-foreground">
                    Display your governance and event participation
                  </p>
                </div>
                {/* Toggle component will go here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfilePage
