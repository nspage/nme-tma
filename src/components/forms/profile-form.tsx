import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { useMutation } from "@/lib/hooks/use-mutation"
import { memberService } from "@/lib/api"
import { UpdateMemberInput } from "@/lib/types/api"

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().min(20, "Bio must be at least 20 characters"),
  avatar: z.string().url("Must be a valid URL").optional(),
  social: z.object({
    github: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    twitter: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    telegram: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  }),
})

type ProfileFormData = z.infer<typeof profileFormSchema>

interface ProfileFormProps {
  initialData?: Partial<ProfileFormData>
  onSuccess?: () => void
}

export function ProfileForm({ initialData, onSuccess }: ProfileFormProps) {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      bio: initialData?.bio || "",
      avatar: initialData?.avatar || "",
      social: {
        github: initialData?.social?.github || "",
        twitter: initialData?.social?.twitter || "",
        telegram: initialData?.social?.telegram || "",
        website: initialData?.social?.website || "",
      },
    },
  })

  const { mutate, isLoading, error } = useMutation<UpdateMemberInput, any>(
    memberService.updateProfile,
    {
      onSuccess: () => {
        onSuccess?.()
      },
    }
  )

  const onSubmit = async (data: ProfileFormData) => {
    // Clean up empty social links
    const social = Object.fromEntries(
      Object.entries(data.social).filter(([_, value]) => value)
    )

    await mutate({
      ...data,
      social: Object.keys(social).length > 0 ? social : undefined,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ErrorMessage error={error} />
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your display name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/avatar.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="font-medium">Social Links</h3>
          
          <FormField
            control={form.control}
            name="social.github"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="social.twitter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter</FormLabel>
                <FormControl>
                  <Input placeholder="https://twitter.com/username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="social.telegram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telegram</FormLabel>
                <FormControl>
                  <Input placeholder="https://t.me/username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="social.website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? <LoadingSpinner size="sm" /> : "Update Profile"}
        </Button>
      </form>
    </Form>
  )
}
