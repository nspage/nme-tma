import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useGroups } from "@/lib/hooks/use-groups"

const formSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().min(10).max(500),
  isPrivate: z.boolean(),
  image: z.string().url().optional(),
  tags: z.string(),
})

export function CreateGroupPage() {
  const navigate = useNavigate()
  const { createGroup } = useGroups()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      isPrivate: false,
      image: "",
      tags: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const tags = values.tags.split(",").map(tag => tag.trim()).filter(Boolean)
      await createGroup({
        name: values.name,
        description: values.description,
        isPrivate: values.isPrivate,
        avatar: values.image || undefined,
        tags,
      })
      toast.success("Group created successfully!")
      navigate("/groups")
    } catch (error) {
      toast.error("Failed to create group")
      console.error(error)
    }
  }

  return (
    <div className="container max-w-2xl py-6">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Group</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter group name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a unique and descriptive name for your group
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your group's purpose and goals"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide details about what your group does and who should join
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional: Add an image URL for your group's avatar
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="development, blockchain, design"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Add comma-separated tags to help others find your group
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPrivate"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Private Group</FormLabel>
                      <FormDescription>
                        Make this group private to require approval for new members
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/groups")}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Group</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
